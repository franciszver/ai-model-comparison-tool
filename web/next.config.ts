import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'standalone' output - incompatible with Amplify WEB_COMPUTE
  // Amplify requires deploy-manifest.json which is generated with default Next.js output
};

export default nextConfig;
