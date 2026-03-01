/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ensure App Router behaves in SSR mode
  experimental: {
    appDir: true,
  },

  // disable static export behavior
  output: undefined,

  // NAYA ADDITION: External images ko Vercel par load hone allow karne ke liye
  images: {
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
