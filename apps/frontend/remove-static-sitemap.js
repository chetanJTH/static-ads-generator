#!/usr/bin/env node

/**
 * Script to ensure no static sitemap.xml files exist
 * This forces Next.js to use the dynamic app/sitemap.ts route
 */

const fs = require('fs');
const path = require('path');

const filesToRemove = [
  'public/sitemap.xml',
  '.next/static/sitemap.xml',
  '.next/server/pages/sitemap.xml',
  'out/sitemap.xml',
  'build/sitemap.xml'
];

console.log('🗑️  Removing static sitemap files...');

filesToRemove.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filePath}`);
    } else {
      console.log(`ℹ️  Not found: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error removing ${filePath}:`, error.message);
  }
});

console.log('🚀 Static sitemap cleanup complete!');
console.log('📝 Next.js will now use dynamic app/sitemap.ts route');
