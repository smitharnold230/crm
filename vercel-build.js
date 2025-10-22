#!/usr/bin/env node

// Vercel build script for frontend-only deployment
// This script replaces the package.json with the frontend-only version
// and then runs the build process

import fs from 'fs';
import { execSync } from 'child_process';

console.log('Starting Vercel frontend build process...');

try {
  // Copy the Vercel-specific package.json
  console.log('Using frontend-only package configuration...');
  fs.copyFileSync('package.vercel.json', 'package.json');
  
  // Install dependencies (skip optional dependencies that cause issues)
  console.log('Installing dependencies...');
  execSync('pnpm install --no-optional', { stdio: 'inherit' });
  
  // Build the frontend
  console.log('Building frontend...');
  execSync('pnpm build', { stdio: 'inherit' });
  
  console.log('Vercel build completed successfully!');
} catch (error) {
  console.error('Vercel build failed:', error.message);
  process.exit(1);
}