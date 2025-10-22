#!/usr/bin/env node

// Pre-build script for Vercel deployment
// This script modifies package.json to remove backend dependencies
// that cause build issues on Vercel

import fs from 'fs';

console.log('Running Vercel pre-build script...');

try {
  // Read package.json
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Remove backend dependencies that cause issues
  const backendDeps = ['bcrypt', 'pg', 'express', 'jsonwebtoken', 'cors', 'node-cron', 'express-rate-limit', 'dotenv'];
  
  console.log('Removing backend dependencies:', backendDeps.join(', '));
  
  backendDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      console.log(`Removed ${dep} from dependencies`);
    }
  });
  
  // Also remove backend devDependencies if they exist
  const backendDevDeps = ['@types/express', '@types/node-cron', '@types/supertest', 'concurrently', 'supertest', 'tsx'];
  
  console.log('Removing backend devDependencies:', backendDevDeps.join(', '));
  
  backendDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
      console.log(`Removed ${dep} from devDependencies`);
    }
  });
  
  // Write modified package.json
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  console.log('Pre-build script completed successfully!');
} catch (error) {
  console.error('Pre-build script failed:', error.message);
  process.exit(1);
}