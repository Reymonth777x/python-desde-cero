import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

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

          response = NextResponse.next({
            request,
          });

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

  // Rutas de admin (requieren rol admin)
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  // Redirigir usuarios autenticados fuera de login
  if (claims && (isAuthPage || isAuthCallback)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/estudiante';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  // Proteger rutas de aprendizaje: requieren autenticación
  if (!claims && isProtectedLearningPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  // Proteger rutas de admin: requieren autenticación + rol admin
  if (isAdminRoute) {
    if (!claims) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }

    // Verificar rol de admin en los claims de JWT
    const userRole = claims.role || claims['role'];
    if (userRole !== 'admin' && userRole !== 'administrador') {
      return NextResponse.redirect(new URL('/estudiante', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
};
