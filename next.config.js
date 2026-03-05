/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // disable static export behavior
  output: undefined,

  // Keeping the safety nets so Vercel doesn't fail your build due to the missing ESLint config
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // NAYA ADDITION: Optimized Edge images with formats and Cache TTL
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**', 
      }
    ],
  },
};

module.exports = nextConfig;
