#!/usr/bin/env node

// Pre-build script for Vercel deployment
// This script modifies package.json to remove backend dependencies
// that cause build issues on Vercel

import fs from 'fs';

console.log('Running Vercel pre-build script...');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Remove backend dependencies that cause issues
  const backendDeps = ['bcrypt', 'pg', 'express', 'jsonwebtoken', 'cors', 'node-cron'];
  
  console.log('Removing backend dependencies:', backendDeps.join(', '));
  
  backendDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      console.log(`Removed ${dep} from dependencies`);
    }
  });
  
  // Write modified package.json
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  console.log('Pre-build script completed successfully!');
} catch (error) {
  console.error('Pre-build script failed:', error.message);
  process.exit(1);
}