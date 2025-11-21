/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {},
};

export default nextConfig;

