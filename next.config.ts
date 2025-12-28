import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud", // 允许 Pinata 网关
      },
      {
        protocol: "https",
        hostname: "www.unabiz.com", // 允许你的图片来源域名
      },
      // 如果有其他图片域名，也加在这里
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
