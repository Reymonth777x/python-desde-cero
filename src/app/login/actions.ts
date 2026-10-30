'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { resolveAuthCallbackUrl } from '@/lib/auth-callback-url';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/safe-next';
import { parseOptionalInvitationCode } from '@/lib/invitation-code';

export type LoginActionState = { error?: 'missing' | 'captcha' | 'login'; attempt?: number };

export async function login(_previousState: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const attempt = (_previousState.attempt ?? 0) + 1;
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const captchaToken = String(formData.get('captchaToken') ?? '');
  const next = safeNext(formData.get('next'), '/academia');
  if (!email || !password) return { error: 'missing', attempt };
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken) {
    return { error: 'captcha', attempt };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: captchaToken || undefined },
  });
  if (error) {
    const authMessage = error.message.toLowerCase();
    return {
      error: authMessage.includes('captcha') || authMessage.includes('turnstile')
        ? 'captcha'
        : 'login',
      attempt,
    };
  }

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
  const parsedInvitation = parseOptionalInvitationCode(String(formData.get('invitation_code') ?? ''));

  if (!fullName || !email || !password) redirect('/login?error=missing');
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken) {
    redirect('/login?error=captcha');
  }
  if (!parsedInvitation.ok) redirect('/login?error=invitation');
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
      data: {
        full_name: fullName,
        ...(parsedInvitation.code ? { invitation_code: parsedInvitation.code } : {}),
      },
      emailRedirectTo,
      captchaToken: captchaToken || undefined,
    },
  });
  if (error) {
    const authMessage = error.message.toLowerCase();
    const captchaError = authMessage.includes('captcha') || authMessage.includes('turnstile');
    const invitationError = /invitation.*(invalid|expired|used)|invitation is/i.test(error.message);
    redirect(
      captchaError
        ? '/login?error=captcha'
        : invitationError
          ? '/login?error=invitation'
          : '/login?error=signup',
    );
  }

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
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken) {
    redirect('/login/forgot-password?error=captcha');
  }

  const emailRedirectTo = resolveAuthCallbackUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NODE_ENV === 'production',
    'password-reset',
  );
  if (!emailRedirectTo) redirect('/login/forgot-password?error=configuration');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: emailRedirectTo,
    captchaToken: captchaToken || undefined,
  });
  if (error && (error.message.toLowerCase().includes('captcha') || error.message.toLowerCase().includes('turnstile'))) {
    redirect('/login/forgot-password?error=captcha');
  }

  // Keep a uniform response for non-CAPTCHA failures to avoid account enumeration.
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
