import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: { port: 5173 },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
        passes: 3, // Multiple passes for better dead code elimination
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        // Aggressive dead code elimination
        dead_code: true,
        unused: true,
        // Code optimization for tree-shaking
        evaluate: true,
        booleans: true,
        collapse_vars: true,
        reduce_vars: true,
        reduce_funcs: true,
        properties: true,
        sequences: true,
        side_effects: false, // Allow side effects for React, but tree-shake unused exports
        toplevel: true, // Enable tree-shaking at top level
        // Remove unreachable code
        if_return: true,
        loops: true,
        switches: true,
      },
      mangle: {
        toplevel: true, // Mangle top-level variable names for better tree-shaking
        properties: false, // Keep property names for React/MUI compatibility
      },
      format: {
        comments: false, // Remove all comments
        ecma: 2020, // Target modern ECMAScript for better tree-shaking
      },
      ecma: 2020, // Target modern ECMAScript
      module: true, // Treat as ES module for better tree-shaking
    },
    cssCodeSplit: true,
    sourcemap: false,
    // Enable tree-shaking and better optimization
    rollupOptions: {
      // Enable tree-shaking by marking all exports as side-effect free where possible
      treeshake: {
        moduleSideEffects: (id) => {
          // Allow side effects only for CSS files and entry points
          if (id.endsWith('.css') || id.includes('/styles/') || id.includes('main.jsx')) {
            return true;
          }
          // Assume no side effects for other modules (enables tree-shaking)
          return false;
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        // Optimize chunk splitting to reduce chain depth
        // Split into smaller, loadable-in-parallel chunks
        manualChunks: (id) => {
          // React core - smallest, loads first (foundation)
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          // React Router - can load in parallel with MUI
          if (id.includes('node_modules/react-router-dom')) {
            return 'react-router';
          }
          // MUI core - split from icons for parallel loading and better tree-shaking
          if (id.includes('node_modules/@mui/material')) {
            return 'mui-core';
          }
          // MUI icons - defer loading (not critical for initial render)
          // Split to enable tree-shaking of unused icons
          if (id.includes('node_modules/@mui/icons-material')) {
            return 'mui-icons';
          }
          // Emotion - MUI dependency, but can load after initial render
          if (id.includes('node_modules/@emotion')) {
            return 'emotion';
          }
          // Other vendor libraries - defer
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      // Externalize dependencies that should not be bundled
      external: [],
    },
    chunkSizeWarningLimit: 1000,
    // Enable CSS minification
    cssMinify: true,
    // Reduce build output size
    reportCompressedSize: false,
    // Target modern browsers for smaller bundles
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  // Optimize dependencies - enable tree-shaking
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
    // Enable tree-shaking for dependencies
    esbuildOptions: {
      treeShaking: true,
      legalComments: 'none', // Remove license comments
    },
  },
  // Enable better tree-shaking
  esbuild: {
    treeShaking: true,
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
})
