import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - turbopack types not yet in NextConfig
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
