/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// CSP completa. En desarrollo usa Report-Only para recoger violaciones;
// en producción usa enforce.
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-eval' necesario para Pyodide WebAssembly y Monaco Editor services.
  "script-src 'self' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co https://*.supabase.fr wss://*.supabase.co wss://*.supabase.fr",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "report-uri /api/csp-report",
].join('; ');

const securityHeaders = [
  {
    key: isProd ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
    value: cspDirectives,
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
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
