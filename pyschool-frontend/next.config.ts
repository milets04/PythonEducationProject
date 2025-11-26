import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Advertencia: Esto permite que las compilaciones de producción
    // se completen incluso si hay errores de ESLint.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;