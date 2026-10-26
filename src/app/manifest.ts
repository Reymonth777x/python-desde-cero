import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Python desde cero',
    short_name: 'Python desde cero',
    description: 'Aprende Python paso a paso, practica código y avanza desde tu computadora, tableta o teléfono.',
    id: '/',
    start_url: '/academia',
    scope: '/',
    display: 'standalone',
    background_color: '#f4f2e9',
    theme_color: '#294936',
    icons: [
      {
        src: '/academy-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
