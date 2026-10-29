import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const LEARNING_PREFIXES = ['/practica', '/academia', '/estudiante', '/docente'];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function createContentSecurityPolicy(nonce: string) {
  const connectSources = ["'self'"];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl) {
    try {
      const host = new URL(supabaseUrl).host;
      connectSources.push(`https://${host}`, `wss://${host}`);
    } catch {
      // A malformed public URL should not add a broad connection source.
    }
  }

  const developmentEval = process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'${developmentEval} https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    `connect-src ${connectSources.join(' ')}`,
    "worker-src 'self' blob:",
    "frame-src 'self' https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "report-uri /api/csp-report",
  ].join('; ');
}

function applySecurityHeaders(response: NextResponse, csp: string) {
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  }
  return response;
}

export async function middleware(request: NextRequest) {
  // Next.js needs this per-response nonce in the incoming request CSP so its
  // framework and inline flight scripts can be authorized without unsafe-inline.
  const nonce = btoa(crypto.randomUUID());
  const csp = createContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  let response = applySecurityHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
    csp,
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          requestHeaders.set('cookie', request.cookies.toString());
          response = applySecurityHeaders(
            NextResponse.next({ request: { headers: requestHeaders } }),
            csp,
          );
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const redirectTo = (url: URL) => {
    const redirect = applySecurityHeaders(NextResponse.redirect(url), csp);
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
