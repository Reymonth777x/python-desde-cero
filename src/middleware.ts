
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
const isProtectedLearningPage =
  pathname === '/practica' ||
  pathname.startsWith('/practica/') ||
  pathname === '/academia' ||
  pathname.startsWith('/academia/');

if (!claims && isProtectedLearningPage) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/login';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}

return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
};
