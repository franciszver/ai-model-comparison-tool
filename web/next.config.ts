import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress workspace root warning in Amplify builds
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
