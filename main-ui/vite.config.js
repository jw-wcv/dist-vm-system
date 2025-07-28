// vite.config.js
// 
// Description: Vite build configuration for the main UI application
// 
// This file configures the Vite build tool for the React-based main UI
// of the distributed VM system. It sets up the development server,
// build output, and React plugin integration.
// 
// Configuration:
//   - React plugin enabled for JSX support
//   - Development server on port 3000
//   - Build output directory: dist/
//   - Hot module replacement enabled (default)
// 
// Inputs: None (uses default Vite configuration)
// Outputs: 
//   - Development server with hot reload
//   - Optimized production builds
//   - React JSX compilation
// 
// Dependencies:
//   - vite (build tool)
//   - @vitejs/plugin-react (React support)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            // Whether to polyfill specific globals
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            // Whether to polyfill `global`
            protocolImports: true,
        }),
    ],
    root: resolve(__dirname, '.'),
    publicDir: 'public',
    server: {
        port: 5173,
        host: true,
        open: true,
        historyApiFallback: true,
    },
    build: {
        outDir: 'dist',
    },
    preview: {
        port: 5173,
        host: true,
    },
    appType: 'spa',
    optimizeDeps: {
        include: [
            '@aleph-sdk/client',
            '@aleph-sdk/ethereum',
            '@aleph-sdk/evm',
            '@aleph-sdk/message',
            '@aleph-sdk/core',
            '@aleph-sdk/account',
            'ethers',
            'decimal.js',
            '@ethereumjs/util',
            '@metamask/eth-sig-util',
            'bip39'
        ],
        exclude: []
    }
});
