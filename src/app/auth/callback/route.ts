import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const isPasswordReset = requestUrl.searchParams.get('flow') === 'password-reset';

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(
          isPasswordReset ? '/login/reset-password' : '/practica',
          requestUrl.origin,
        )
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      isPasswordReset
        ? '/login/forgot-password?error=confirmation'
        : '/login?error=confirmation',
      requestUrl.origin,
    )
  );
}
