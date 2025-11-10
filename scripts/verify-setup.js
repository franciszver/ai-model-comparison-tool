#!/usr/bin/env node

/**
 * Verification script to check if the project is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying project setup...\n');

let hasErrors = false;

// Check if dist folder exists
if (!fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  console.error('❌ dist/ folder not found. Run: npm run build');
  hasErrors = true;
} else {
  console.log('✅ dist/ folder exists');
}

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  .env file not found. Create it from .env.example');
  console.warn('   Run: Copy-Item .env.example .env (PowerShell) or cp .env.example .env (Mac/Linux)');
} else {
  console.log('✅ .env file exists');
  
  // Check if OPENROUTER_API_KEY is set
  const envContent = fs.readFileSync(envPath, 'utf-8');
  if (!envContent.includes('OPENROUTER_API_KEY=') || envContent.includes('your_openrouter_api_key_here')) {
    console.warn('⚠️  OPENROUTER_API_KEY not set in .env file');
    console.warn('   Add your OpenRouter API key to the .env file');
  } else {
    console.log('✅ OPENROUTER_API_KEY appears to be set');
  }
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
  console.error('❌ node_modules/ not found. Run: npm install');
  hasErrors = true;
} else {
  console.log('✅ node_modules/ exists');
}

// Check if outputs directory exists
const outputsPath = path.join(__dirname, '..', 'outputs');
if (!fs.existsSync(outputsPath)) {
  console.warn('⚠️  outputs/ directory not found. Creating it...');
  fs.mkdirSync(outputsPath, { recursive: true });
  console.log('✅ outputs/ directory created');
} else {
  console.log('✅ outputs/ directory exists');
}

// Check if config/models.json exists
const modelsPath = path.join(__dirname, '..', 'config', 'models.json');
if (!fs.existsSync(modelsPath)) {
  console.error('❌ config/models.json not found');
  hasErrors = true;
} else {
  console.log('✅ config/models.json exists');
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup incomplete. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('✅ Setup verification complete!');
  console.log('\nNext steps:');
  console.log('1. Add your OPENROUTER_API_KEY to .env file');
  console.log('2. Test with: node dist/index.js compare https://hibid.com/lot/test123');
  process.exit(0);
}


