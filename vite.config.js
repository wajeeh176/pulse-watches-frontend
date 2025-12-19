import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Emotion is automatically handled by @vitejs/plugin-react
      // The babel plugin will be used if @emotion/babel-plugin is installed
    }),
  ],
  server: { port: 5173 },
  build: {
    // Use terser with very conservative settings to avoid breaking Emotion's circular dependencies
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Minimal compression to avoid breaking circular dependencies
        passes: 1,
        unsafe: false,
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        // Disable all variable-related optimizations that break circular deps
        dead_code: false, // Don't remove dead code that might be needed for init order
        evaluate: false, // Don't evaluate expressions that might affect init order
        collapse_vars: false,
        reduce_vars: false,
        reduce_funcs: false,
        // Minimal safe optimizations
        booleans: false, // Disable to be safe
        if_return: true,
        loops: false, // Disable loop optimizations
        sequences: false, // Don't reorder sequences
        switches: true,
        // Preserve side effects and initialization order
        side_effects: true,
        toplevel: false,
        // Disable hoisting that might break init order
        hoist_funs: false,
        hoist_vars: false,
        keep_infinity: true,
        keep_fargs: true, // Keep function arguments
      },
      mangle: false, // Disable ALL mangling to prevent breaking Emotion's circular dependencies
      // mangle: {
      //   toplevel: false,
      //   properties: false,
      //   reserved: ['e', 't', 'X', 'Y', 'Z', 'ft', 'emotion', 'emotionCache', 'css', 'keyframes'],
      // },
      format: {
        comments: false,
      },
      ecma: 2020,
      module: true,
    },
    cssCodeSplit: true,
    sourcemap: false,
    // Enable tree-shaking and better optimization
    rollupOptions: {
      // Enable tree-shaking by marking all exports as side-effect free where possible
      treeshake: {
        moduleSideEffects: (id) => {
          // Allow side effects for CSS files, entry points, and Emotion
          if (
            id.endsWith('.css') || 
            id.includes('/styles/') || 
            id.includes('main.jsx') ||
            id.includes('@emotion') ||
            id.includes('emotion')
          ) {
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
          // Put ALL node_modules in one chunk to ensure React is always available
          // This prevents "React is undefined" errors from chunk loading order issues
          if (id.includes('node_modules')) {
            // MUI icons can be separate as they're lazy loaded
            if (id.includes('node_modules/@mui/icons-material')) {
              return 'mui-icons';
            }
            // Everything else goes in react-mui-core to ensure React is available
            return 'react-mui-core';
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
    // Keep identifiers for Emotion to avoid circular dependency issues
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    drop: ['console', 'debugger'], // Drop console and debugger statements
  },
})
