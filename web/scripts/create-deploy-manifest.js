// Create deploy-manifest.json for Amplify WEB_COMPUTE
// This follows the Amplify deploy manifest schema for Next.js
const fs = require('fs');
const path = require('path');

const manifest = {
  version: 1,
  framework: {
    name: 'nextjs',
    version: '16.0.1',
  },
  build: {
    commands: {
      preBuild: 'cd web && npm ci',
      build: 'cd web && npm run build',
    },
  },
  runtime: {
    name: 'nodejs',
    version: '18.x',
  },
  server: {
    command: 'cd web && npm start',
    port: 3000,
  },
  routes: [
    {
      path: '/*',
      target: {
        kind: 'rewrite',
        source: '/*',
      },
    },
  ],
};

// Write to .next directory (where Amplify expects it)
const manifestPath = path.join(__dirname, '..', '.next', 'deploy-manifest.json');
const nextDir = path.dirname(manifestPath);

// Ensure .next directory exists
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}

// Write manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Created deploy-manifest.json for Amplify at:', manifestPath);

