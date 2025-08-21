import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // React Strict Mode (helps catch bugs in development)
  reactStrictMode: true,
  
  // Image configuration
  images: {
    domains: ['flagcdn.com', 'res.cloudinary.com'],
  },
  
  webpack(config, { isServer }) {
    // Disable persistent Webpack cache to avoid ENOSPC disk error
    config.cache = false;
    return config;
  },
};

export default nextConfig;