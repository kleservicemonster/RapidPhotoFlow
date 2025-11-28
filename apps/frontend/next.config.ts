import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@rapidphotoflow/shared'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/photos/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3333',
        pathname: '/photos/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
