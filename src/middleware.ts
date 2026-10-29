import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { safeNext } from '@/lib/safe-next';
import { isGuestOnlyAuthPage } from '@/lib/auth-route-policy';

const LEARNING_PREFIXES = ['/practica', '/academia', '/estudiante', '/docente'];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

function redirectWithRefreshedCookies(source: NextResponse, destination: URL) {
  const redirectResponse = NextResponse.redirect(destination);

  // A redirect is a new response. Copy every refreshed Supabase cookie,
  // including its security options, or the browser can lose the new session.
  source.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  // Preserve the cache protections Supabase SSR supplies during token refresh.
  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = source.headers.get(header);
    if (value) redirectResponse.headers.set(header, value);
  }

  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers ?? {}).forEach(([name, value]) => {
            if (typeof value === 'string') response.headers.set(name, value);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();
  let claims = data && !error ? data.claims : null;
  const { pathname, search } = request.nextUrl;

  // Only these two screens should redirect an already-authenticated user.
  // In particular, never intercept /auth/callback or /login/reset-password:
  // they must be able to finish Supabase's PKCE exchange.
  const isGuestOnlyPage = isGuestOnlyAuthPage(pathname);
  const isLearningRoute = LEARNING_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix),
  );
  const isAdminRoute = matchesPrefix(pathname, '/admin');

  // getClaims validates a JWT locally; it cannot tell us whether the session
  // was revoked in Auth. A stale cookie can otherwise create a redirect loop
  // between login and protected pages (Supabase logs showed session_not_found).
  // Check the live session on auth-gated pages only, not every static request.
  if (claims && (isGuestOnlyPage || isLearningRoute || isAdminRoute)) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) claims = null;
  }

  if (claims && isGuestOnlyPage) {
    const destinationPath = safeNext(
      request.nextUrl.searchParams.get('next'),
      '/estudiante',
    );
    return redirectWithRefreshedCookies(
      response,
      new URL(destinationPath, request.url),
    );
  }

  if (!claims && (isLearningRoute || isAdminRoute)) {
    const destination = request.nextUrl.clone();
    destination.pathname = '/login';
    destination.search = '';
    // URLSearchParams encodes the path and query as one parameter. The login
    // Server Action validates it again with safeNext before redirecting.
    destination.searchParams.set('next', pathname + search);
    return redirectWithRefreshedCookies(response, destination);
  }

  if (claims && isAdminRoute) {
    // Supabase's JWT "role" is normally "authenticated"; admin authorization
    // must come from the server-controlled profile, not that claim.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', claims.sub)
      .maybeSingle();

    if (profileError || profile?.is_admin !== true) {
      return redirectWithRefreshedCookies(
        response,
        new URL('/estudiante', request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
};
