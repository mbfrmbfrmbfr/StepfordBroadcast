#!/usr/bin/env node

// Simple production start script
console.log('Starting SBC News Website in production mode...');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Set production environment
process.env.NODE_ENV = 'production';

// Import and run the server
import('./dist/index.js').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});