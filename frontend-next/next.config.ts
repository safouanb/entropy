import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // @ts-expect-error - turbopack types not yet in NextConfig
  turbopack: {
    root: path.resolve(process.cwd(), ".."),
  },
};

export default nextConfig;
