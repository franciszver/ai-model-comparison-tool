#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate a proper deploy-manifest.json for Amplify WEB_COMPUTE
const manifest = {
  version: 1,
  framework: {
    name: "next",
    version: "14.2.33"
  },
  imageOptimization: {
    path: "/_next/image",
    loader: "default"
  },
  routes: [
    {
      path: "/_next/static/*",
      target: "static",
      fallback: null
    },
    {
      path: "/api/*",
      target: "compute",
      src: "/.next/server/app/api"
    },
    {
      path: "/*",
      target: "compute",
      src: "/.next/server"
    }
  ],
  computeResources: [
    {
      name: "default",
      runtime: "nodejs18.x",
      entrypoint: "server.js"
    }
  ]
};

const outputPath = path.join(__dirname, '.next', 'deploy-manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log('✅ Generated deploy-manifest.json');

