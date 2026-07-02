import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Uses the Render internal network in production, falls back to localhost for your computer
        destination: `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "https://backend-service-0rys.onrender.com"}:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
