#!/usr/bin/env node

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build the server with proper dirname handling
build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  packages: 'external',
  format: 'esm',
  outdir: 'dist',
  define: {
    'import.meta.dirname': '__dirname',
  },
  inject: ['./dirname-shim.js'],
}).catch(() => process.exit(1));