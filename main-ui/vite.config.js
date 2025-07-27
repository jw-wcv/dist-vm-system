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

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
    },
    build: {
        outDir: 'dist',
    },
});
