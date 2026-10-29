import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const LEARNING_PREFIXES = ['/practica', '/academia', '/estudiante', '/docente'];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const redirectTo = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  const { data, error } = await supabase.auth.getClaims();
  const claims = data && !error ? data.claims : null;
  const { pathname, search } = request.nextUrl;
  const isGuestOnlyPage = pathname === '/login' || pathname === '/login/forgot-password';

  if (claims && isGuestOnlyPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/estudiante';
    url.search = '';
    return redirectTo(url);
  }

  const isLearningRoute = LEARNING_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
  const isAdminRoute = matchesPrefix(pathname, '/admin');

  if (!claims && (isLearningRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return redirectTo(url);
  }

  if (claims && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', claims.sub)
      .maybeSingle();

    if (profile?.is_admin !== true) {
      const url = request.nextUrl.clone();
      url.pathname = '/estudiante';
      url.search = '';
      return redirectTo(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
};
