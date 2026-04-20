import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "community.cloudflare.steamstatic.com",
        pathname: "/economy/image/**"
      },
      {
        protocol: "https",
        hostname: "steamcommunity-a.akamaihd.net",
        pathname: "/economy/image/**"
      }
    ]
  }
};

export default nextConfig;
