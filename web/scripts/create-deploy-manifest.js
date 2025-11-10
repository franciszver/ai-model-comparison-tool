// Create deploy-manifest.json for Amplify WEB_COMPUTE
const fs = require('fs');
const path = require('path');

const manifest = {
  version: 1,
  framework: 'nextjs',
  buildCommand: 'npm run build',
  devCommand: 'npm run dev',
  installCommand: 'npm ci',
  outputDirectory: '.next',
  serverCommand: 'npm start',
  serverPort: 3000,
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

