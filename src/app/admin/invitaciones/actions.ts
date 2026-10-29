'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function listInvitations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/estudiante');

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { invitations: [], error: 'No se pudieron cargar las invitaciones.' };
  return { invitations: invitations ?? [], error: null };
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

  if (!profile?.is_admin) redirect('/estudiante');

  const code = String(formData.get('code') ?? '').trim().toUpperCase();
  const rawExpiresAt = String(formData.get('expires_at') ?? '').trim();

  if (!code) return { error: 'El código de invitación es requerido' };
  if (!/^[A-F0-9]{16}$/.test(code)) {
    return { error: 'El código debe tener 16 caracteres hexadecimales' };
  }

  const insertData: {
    code: string;
    is_used: boolean;
    used_by: null;
    created_by: string;
    expires_at?: string;
  } = {
    code,
    is_used: false,
    used_by: null,
    created_by: user.id,
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

  if (!profile?.is_admin) redirect('/estudiante');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: 'Identificador de invitación inválido.' };

  const { error } = await supabase.from('invitations').delete().eq('id', id);
  if (error) return { error: 'No se pudo eliminar la invitación.' };
  return { error: null };
}
