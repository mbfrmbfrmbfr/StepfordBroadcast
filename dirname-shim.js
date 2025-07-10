// ESM dirname shim for esbuild
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create a global __dirname for ESM compatibility
globalThis.__dirname = dirname(fileURLToPath(import.meta.url));