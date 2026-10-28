'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function listInvitations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/estudiante');
  }

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { invitations: [], error: error.message };
  }

  return { invitations: invitations ?? [], error: null };
}

export async function createInvitation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/estudiante');
  }

  const code = String(formData.get('code') ?? '').trim().toUpperCase();
  const expiresAt = String(formData.get('expires_at') ?? '');

  if (!code) {
    return { error: 'El código de invitación es requerido' };
  }

  if (!/^[A-F0-9]{16}$/.test(code)) {
    return { error: 'El código debe tener 16 caracteres hexadecimales' };
  }

  const insertData = {
    code,
    is_used: false,
    used_by: null,
    expires_at: expiresAt || null,
    created_by: user.id,
  };

  const { error } = await supabase.from('invitations').insert(insertData);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/estudiante');
  }

  const { error } = await supabase.from('invitations').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
