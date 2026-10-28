/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Allows a same-origin iframe for the isolated Python runner.
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

  // CSP is created per request in middleware.ts so Next.js can nonce its inline
  // hydration/bootstrap scripts. Setting a static CSP here would block hydration.
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
