'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createInvitation() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.is_admin !== true) {
    redirect('/practica');
  }

  const code = randomBytes(8).toString('hex').toUpperCase();

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase.from('invitations').insert({
    code,
    expires_at: expiresAt,
    created_by: user.id,
  });

  if (error) {
    console.error('Error al crear la invitación:', error.message);
    redirect('/admin/invitaciones?error=create');
  }

  revalidatePath('/admin/invitaciones');
  redirect('/admin/invitaciones?created=1');
}
