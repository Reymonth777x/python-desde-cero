'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { normalizeInvitationCode } from '@/lib/invitation-code';

function generateInvitationCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export async function listInvitations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/academia');

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { invitations: [], error: 'No se pudieron cargar las invitaciones.' };

  const usedUserIds = [...new Set((invitations ?? [])
    .map((invitation) => invitation.used_by)
    .filter((id): id is string => Boolean(id)))];

  const { data: profiles, error: profileError } = usedUserIds.length > 0
    ? await supabase.from('profiles').select('id, email, full_name').in('id', usedUserIds)
    : { data: [], error: null };

  const profilesById = new Map((profileError ? [] : profiles ?? []).map((profile) => [profile.id, profile]));
  const now = Date.now();
  const withExpiryStatus = (invitations ?? []).map((invitation) => {
    const usedProfile = invitation.used_by ? profilesById.get(invitation.used_by) : null;
    return {
      ...invitation,
      used_by_name: usedProfile?.full_name ?? null,
      used_by_email: usedProfile?.email ?? null,
      is_expired: Boolean(invitation.expires_at && new Date(invitation.expires_at).getTime() < now),
    };
  });
  return { invitations: withExpiryStatus, error: null };
}

export async function createInvitation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/academia');

  const submittedCode = String(formData.get('code') ?? '').trim();
  const code = submittedCode ? normalizeInvitationCode(submittedCode) : generateInvitationCode();
  const rawExpiresAt = String(formData.get('expires_at') ?? '').trim();

  if (!code) {
    return { error: 'El código personalizado debe tener entre 8 y 32 caracteres: letras, números y guiones, sin guiones al inicio, al final ni repetidos.' };
  }


  const insertData: {
    code: string;
    is_used: boolean;
    used_by: null;
    created_by: string;
    expires_at: string;
  } = {
    code,
    is_used: false,
    used_by: null,
    created_by: user.id,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  if (rawExpiresAt) {
    const expires = new Date(rawExpiresAt);
    if (Number.isNaN(expires.getTime()) || expires.getTime() <= Date.now()) {
      return { error: 'La fecha de expiración debe ser una fecha futura válida.' };
    }
    insertData.expires_at = expires.toISOString();
  }

  const { error } = await supabase.from('invitations').insert(insertData);
  if (error) {
    return {
      error: error.code === '23505'
        ? 'Ya existe una invitación con ese código.'
        : 'No se pudo crear la invitación.',
    };
  }
  return { error: null };
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/academia');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: 'Identificador de invitación inválido.' };

  const { data: invitation, error: lookupError } = await supabase
    .from('invitations')
    .select('is_used')
    .eq('id', id)
    .maybeSingle();

  if (lookupError || !invitation) return { error: 'No se encontró la invitación.' };
  if (invitation.is_used) return { error: 'Una invitación utilizada se conserva como historial y no se elimina.' };

  const { data: deleted, error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)
    .eq('is_used', false)
    .select('id')
    .maybeSingle();

  if (error || !deleted) return { error: 'No se pudo eliminar la invitación. Puede que ya haya sido utilizada.' };
  return { error: null };
}
