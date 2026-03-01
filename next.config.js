/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ensure App Router behaves in SSR mode
  experimental: {
    appDir: true,
  },

  // disable static export behavior
  output: undefined,
};

module.exports = nextConfig;
