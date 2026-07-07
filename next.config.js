/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  experimental: {
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        "**/node_modules",
        "C:/System Volume Information",
        "C:/hiberfil.sys",
        "C:/pagefile.sys",
        "C:/swapfile.sys",
        "C:/DumpStack.log.tmp",
      ],
    };
    return config;
  },
};

module.exports = nextConfig;