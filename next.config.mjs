/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// Host exacto de Supabase desde variable de entorno (sin comodines).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : '';
const supabaseConnect = supabaseHost
  ? [`https://${supabaseHost}`, `wss://${supabaseHost}`]
  : [];

// CSP completa. En desarrollo usa Report-Only para recoger violaciones;
// en producción usa enforce.
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-eval' necesario para Pyodide WebAssembly y Monaco Editor services.
  // wasm-unsafe-eval es más específico para WebAssembly (soportado en navegadores modernos).
  "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseConnect.join(' ')}`,
  "worker-src 'self' blob:",
  "frame-src 'self' https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  // Permite iframe del runner de Python mismo origen (aislado por sandbox y postMessage).
  "frame-ancestors 'self'",
  "report-uri /api/csp-report",
].join('; ');

const securityHeaders = [
  {
    key: isProd ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
    value: cspDirectives,
  },
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
