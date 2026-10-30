'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { parseOptionalInvitationCode } from '@/lib/invitation-code';

const INVITATIONS_PATH = '/admin/invitaciones';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || profile?.is_admin !== true) redirect('/estudiante');
  return { supabase, user };
}

export async function listInvitations() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('invitations')
    .select('id, code, is_used, used_by, expires_at, created_at, created_by')
    .order('created_at', { ascending: false });

  return { invitations: data ?? [], error: error?.message ?? null };
}

export async function createInvitation(formData: FormData): Promise<{ error: string | null; success?: string }> {
  const { supabase, user } = await requireAdmin();
  const parsed = parseOptionalInvitationCode(String(formData.get('code') ?? ''));

  if (!parsed.ok || !parsed.code) {
    return { error: 'Usa entre 4 y 32 caracteres: letras, números y guiones. El código no puede empezar ni terminar con guion.' };
  }

  const expiresInput = String(formData.get('expires_at') ?? '').trim();
  const insertData: {
    code: string;
    created_by: string;
    expires_at?: string;
  } = { code: parsed.code, created_by: user.id };

  if (expiresInput) {
    const date = new Date(expiresInput);
    if (Number.isNaN(date.getTime())) return { error: 'La fecha de expiración no es válida.' };
    if (date.getTime() <= Date.now()) return { error: 'La fecha de expiración debe estar en el futuro.' };
    insertData.expires_at = date.toISOString();
  }
  // Al omitir expires_at, Postgres aplica el DEFAULT configurado (7 días).
  const { error } = await supabase.from('invitations').insert(insertData);

  if (error?.code === '23505') return { error: 'Ese código ya existe. Prueba con otro.' };
  if (error) {
    console.error('[invitations:create]', { code: error.code, message: error.message });
    return { error: 'No se pudo crear la invitación. Revisa los datos e inténtalo de nuevo.' };
  }

  revalidatePath(INVITATIONS_PATH);
  return { error: null, success: `Invitación ${parsed.code} creada correctamente.` };
}

export async function deleteInvitation(id: string): Promise<{ error: string | null; success?: string }> {
  const { supabase } = await requireAdmin();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { error: 'Identificador de invitación no válido.' };
  }

  const { data, error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[invitations:delete]', { code: error.code, message: error.message });
    return { error: 'No se pudo eliminar la invitación. Comprueba tus permisos e inténtalo de nuevo.' };
  }
  if (!data) return { error: 'La invitación ya no existe o no está disponible.' };

  revalidatePath(INVITATIONS_PATH);
  return { error: null, success: 'Invitación eliminada. La cuenta del estudiante no se modifica.' };
}
