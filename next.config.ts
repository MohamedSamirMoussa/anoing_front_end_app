import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mc-heads.net',
        port: '',
        pathname: '/avatar/**',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: "https://anoing-app.vercel.app/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
