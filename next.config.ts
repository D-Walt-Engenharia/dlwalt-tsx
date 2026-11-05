import type { NextConfig } from "next";
import { regionalPages } from './src/lib/regional-pages';

const nextConfig: NextConfig = {
  async headers() {
    return ['solar-roof-640', 'solar-roof-1280', 'dwalt-equipe-640', 'dwalt-equipe-960'].map(asset => ({
      source: `/${asset}.webp`,
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
    }));
  },
  async redirects() {
    return [
      ...regionalPages().map(({ alias, canonical }) => ({
        source: `/${alias}`,
        destination: `https://www.dwalt.net/${canonical}`,
        permanent: true,
      })),
      {
        source: '/:path*',
        has: [{ type: 'host' as const, value: 'dwalt.net' }],
        destination: 'https://www.dwalt.net/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [65, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dwalt.net',
      },
    ],
  },
};

export default nextConfig;
