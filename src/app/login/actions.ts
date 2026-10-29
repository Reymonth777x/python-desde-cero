'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { resolveAuthCallbackUrl } from '@/lib/auth-callback-url';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/safe-next';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const captchaToken = String(formData.get('captchaToken') ?? '');
  const next = safeNext(formData.get('next'), '/academia');
  if (!email || !password) redirect('/login?error=missing');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: captchaToken || undefined },
  });
  if (error) redirect('/login?error=login');

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) redirect('/login?error=logout');
  revalidatePath('/', 'layout');
  redirect('/login?message=signed-out');
}

export async function signup(formData: FormData) {
  const fullName = String(formData.get('full_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const captchaToken = String(formData.get('captchaToken') ?? '');

  if (!fullName || !email || !password) redirect('/login?error=missing');
  if (fullName.length > 100 || email.length > 254) redirect('/login?error=missing');
  if (password.length < 8) redirect('/login?error=password');

  const emailRedirectTo = resolveAuthCallbackUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NODE_ENV === 'production',
  );
  if (!emailRedirectTo) redirect('/login?error=configuration');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo,
      captchaToken: captchaToken || undefined,
    },
  });
  if (error) redirect('/login?error=signup');

  if (data.session) {
    revalidatePath('/', 'layout');
    redirect(safeNext(formData.get('next'), '/academia'));
  }
  redirect('/login?message=check-email');
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const captchaToken = String(formData.get('captchaToken') ?? '');
  if (!email || email.length > 254) redirect('/login/forgot-password?error=missing');

  const emailRedirectTo = resolveAuthCallbackUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NODE_ENV === 'production',
    'password-reset',
  );
  if (!emailRedirectTo) redirect('/login/forgot-password?error=configuration');

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: emailRedirectTo,
    captchaToken: captchaToken || undefined,
  });
  redirect('/login/forgot-password?message=sent');
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const confirmation = String(formData.get('password_confirmation') ?? '');
  if (password.length < 8) redirect('/login/reset-password?error=password');
  if (password !== confirmation) redirect('/login/reset-password?error=mismatch');

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login?error=confirmation');

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect('/login/reset-password?error=update');
  revalidatePath('/', 'layout');
  redirect('/academia');
}
