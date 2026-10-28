import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function buildContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const connectSources = new Set<string>(["'self'", 'https://challenges.cloudflare.com']);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      connectSources.add(url.origin);
      if (url.protocol === 'https:') {
        connectSources.add('wss://' + url.host);
      } else if (url.protocol === 'http:') {
        connectSources.add('ws://' + url.host);
      }
    } catch {
      // Ignore malformed optional environment values; the server client reports its own configuration error.
    }
  }

  if (isDev) {
    connectSources.add('ws:');
    connectSources.add('http://localhost:3000');
    connectSources.add('http://127.0.0.1:3000');
  }

  const directives = [
    "default-src 'self'",
    // Nonce lets Next.js run only its own per-request inline bootstrap scripts.
    // unsafe-eval remains required by the browser Python/WebAssembly runtime.
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic' 'unsafe-eval' 'wasm-unsafe-eval' https://challenges.cloudflare.com",
    "style-src 'self' 'nonce-" + nonce + "'",
    // The UI uses React style attributes for theme-driven colors; scripts remain nonce-protected.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src " + Array.from(connectSources).join(' '),
    "worker-src 'self' blob:",
    "frame-src 'self' https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "report-uri /api/csp-report",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join('; ');
}

export async function middleware(request: NextRequest) {
  // Next.js extracts this nonce from the incoming CSP and attaches it to framework scripts.
  // A fresh nonce per request avoids weakening script-src with unsafe-inline.
  const nonce = btoa(crypto.randomUUID());
  const cspHeader = buildContentSecurityPolicy(nonce);
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set('x-nonce', nonce);
  forwardedHeaders.set('Content-Security-Policy', cspHeader);

  const createNextResponse = () => {
    const requestHeaders = new Headers(forwardedHeaders);
    requestHeaders.set('cookie', request.cookies.toString());
    const nextResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    nextResponse.headers.set('Content-Security-Policy', cspHeader);
    return nextResponse;
  };

  let response = createNextResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = createNextResponse();

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getClaims();
  const claims = data && !error ? data.claims : null;

  const pathname = request.nextUrl.pathname;

  // Rutas protegidas que requieren autenticación
  const isAuthPage = pathname === '/login' || pathname.startsWith('/login/');
  const isAuthCallback = pathname === '/auth/callback' || pathname.startsWith('/auth/callback/');

  // Rutas protegidas de aprendizaje (requieren autenticación)
  const isProtectedLearningPage =
    pathname === '/practica' ||
    pathname.startsWith('/practica/') ||
    pathname === '/academia' ||
    pathname.startsWith('/academia/') ||
    pathname === '/estudiante' ||
    pathname.startsWith('/estudiante/') ||
    pathname === '/docente' ||
    pathname.startsWith('/docente/');

  // Rutas de admin (requieren autenticación + rol admin)
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  // Redirigir usuarios autenticados fuera de login
  if (claims && (isAuthPage || isAuthCallback)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/estudiante';
    redirectUrl.search = '';
    const redirect = NextResponse.redirect(redirectUrl);
    redirect.headers.set('Content-Security-Policy', cspHeader);
    response.cookies.getAll().forEach(({ name, value }) => {
      redirect.cookies.set(name, value);
    });
    return redirect;
  }

  // Proteger rutas de aprendizaje: requieren autenticación
  if (!claims && isProtectedLearningPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.search = '';
    const redirect = NextResponse.redirect(redirectUrl);
    redirect.headers.set('Content-Security-Policy', cspHeader);
    response.cookies.getAll().forEach(({ name, value }) => {
      redirect.cookies.set(name, value);
    });
    return redirect;
  }

  // Proteger rutas de admin: requieren autenticación + rol admin
  if (isAdminRoute) {
    if (!claims) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.search = '';
      const redirect = NextResponse.redirect(redirectUrl);
      redirect.headers.set('Content-Security-Policy', cspHeader);
      response.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie);
      });
      return redirect;
    }

    // Verificar rol de admin en los claims de JWT
    const userRole = claims.role || claims['role'];
    if (userRole !== 'admin' && userRole !== 'administrador') {
      const redirect = NextResponse.redirect(new URL('/estudiante', request.url));
      redirect.headers.set('Content-Security-Policy', cspHeader);
      response.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie);
      });
      return redirect;
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
};
