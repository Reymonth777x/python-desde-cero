/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// Host exacto de Supabase desde variable de entorno (sin comodines).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : '';
const supabaseConnect = supabaseHost
  ? [`https://${supabaseHost}`, `wss://${supabaseHost}`]
  : [];

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Permite iframe same-origin para el runner aislado de Python.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  ...(isProd
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]
    : []),
];

const nextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
