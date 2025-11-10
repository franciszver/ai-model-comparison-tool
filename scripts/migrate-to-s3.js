#!/usr/bin/env node

/**
 * Migration script to upload existing execution folders from outputs/ to S3
 */

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION || 'us-east-1';

if (!BUCKET_NAME) {
  console.error('Error: AWS_S3_BUCKET environment variable is required');
  console.error('Please set it in your .env file');
  process.exit(1);
}

const s3Client = new S3Client({
  region: REGION,
  // Credentials will be loaded from AWS profile or environment variables
});

/**
 * Get content type for file
 */
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.json': 'application/json',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Check if folder exists in S3
 */
async function folderExistsInS3(folderName) {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${folderName}/config.json`,
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get all files in directory recursively
 */
function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Upload execution folder to S3
 */
async function uploadFolder(executionPath, folderName) {
  const files = getAllFiles(executionPath);
  let uploaded = 0;
  const total = files.length;

  console.log(`  Uploading ${total} files...`);

  for (const file of files) {
    const filePath = path.join(executionPath, file);
    const s3Key = `${folderName}/${file}`;
    const fileContent = fs.readFileSync(filePath);

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileContent,
          ContentType: getContentType(file),
        })
      );

      uploaded++;
      if (uploaded % 10 === 0 || uploaded === total) {
        process.stdout.write(`\r  Progress: ${uploaded}/${total} files (${Math.round((uploaded / total) * 100)}%)`);
      }
    } catch (error) {
      console.error(`\n  Error uploading ${file}:`, error.message);
      throw error;
    }
  }

  console.log(`\n  ✅ Uploaded ${uploaded} files`);
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration to S3...\n');
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Region: ${REGION}\n`);

  const outputsDir = path.join(process.cwd(), 'outputs');

  if (!fs.existsSync(outputsDir)) {
    console.error('Error: outputs/ directory not found');
    process.exit(1);
  }

  const executionFolders = fs
    .readdirSync(outputsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('execution-'))
    .map((entry) => entry.name)
    .sort();

  if (executionFolders.length === 0) {
    console.log('No execution folders found in outputs/ directory');
    return;
  }

  console.log(`Found ${executionFolders.length} execution folder(s)\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const folderName of executionFolders) {
    const executionPath = path.join(outputsDir, folderName);

    try {
      // Check if already uploaded
      const exists = await folderExistsInS3(folderName);
      if (exists) {
        console.log(`⏭️  Skipping ${folderName} (already in S3)`);
        skipped++;
        continue;
      }

      console.log(`📤 Uploading ${folderName}...`);
      await uploadFolder(executionPath, folderName);
      migrated++;
      console.log(`✅ Completed ${folderName}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${folderName}:`, error.message);
      failed++;
      console.log('');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Migration Summary:');
  console.log(`  ✅ Migrated: ${migrated}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📊 Total: ${executionFolders.length}`);
  console.log('='.repeat(50));

  if (migrated > 0) {
    console.log(`\n✅ Migration complete! ${migrated} execution(s) uploaded to S3.`);
    console.log(`Dashboard URL: Your dashboard will show these executions once deployed.`);
  }
}

// Run migration
migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});


