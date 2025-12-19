// Critical: Import React and createRoot first (smallest, required for render)
import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// Defer CSS - Load after LCP to reduce blocking
// CSS is loaded after the LCP image has rendered
const loadCSS = () => {
  // Wait for LCP (typically hero image) before loading CSS
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./styles/index.css');
      import('./styles/performance.css');
    }, { timeout: 500 });
  } else {
    // Fallback: Load after a short delay
    setTimeout(() => {
      import('./styles/index.css');
      import('./styles/performance.css');
    }, 100);
  }
};

// Defer heavy imports - Load in parallel, not sequentially
// Split the import chain to reduce sequential dependencies
// This reduces critical request chain length significantly
const loadHeavyDeps = Promise.all([
  import('react-router-dom').then(m => m.BrowserRouter),
  import('react-helmet-async').then(m => m.HelmetProvider),
  import('@mui/material/styles').then(m => ({ ThemeProvider: m.ThemeProvider, createTheme: m.createTheme })),
  import('@mui/material/CssBaseline').then(m => m.default),
  // React lazy/Suspense already imported - use directly
  Promise.resolve({ lazy, Suspense })
]).then(([BrowserRouter, HelmetProvider, muiStyles, CssBaseline, reactUtils]) => ({
  BrowserRouter,
  HelmetProvider,
  ThemeProvider: muiStyles.ThemeProvider,
  createTheme: muiStyles.createTheme,
  CssBaseline,
  lazy: reactUtils.lazy,
  Suspense: reactUtils.Suspense
}));

// Lazy load App - Defer to reduce initial bundle size
const AppPromise = import('./App');

// Import context providers - lightweight, can load synchronously
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load ToastContainer - Defer to reduce initial chain
// Load styles asynchronously when needed
let toastStylesLoaded = false;
const ToastContainerLazy = lazy(() => 
  import('react-toastify').then(mod => {
    // Load toast styles asynchronously (doesn't block main chain)
    if (!toastStylesLoaded) {
      import('react-toastify/dist/ReactToastify.css').catch(() => {});
      toastStylesLoaded = true;
    }
    return { default: mod.ToastContainer };
  })
);

// Simple lightweight fallback - avoid heavy components
const SimpleFallback = () => React.createElement('div', { 
  style: { 
    minHeight: '100vh', 
    background: '#0e0e10',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  } 
}, 'Loading...');

// Optimized app - load dependencies in parallel to reduce chain depth
const AppWrapper = () => {
  const [deps, setDeps] = React.useState(null);
  const [theme, setTheme] = React.useState(null);
  const [app, setApp] = React.useState(null);

  React.useEffect(() => {
    // Load CSS after LCP - defer to ensure image gets priority
    loadCSS();

    // Load heavy dependencies in PARALLEL (not sequential chain)
    // Defer until after initial paint to not block LCP
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadHeavyDeps.then(loadedDeps => {
          setDeps(loadedDeps);
          
          // Create theme after dependencies load (reduces work)
          const themeValue = loadedDeps.createTheme({
            palette: {
              mode: 'dark',
              primary: { main: '#c4975b' },
              background: {
                default: '#0e0e10',
                paper: '#0f1720',
              },
            },
            typography: {
              fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            },
          });
          setTheme(themeValue);
        });
      }, { timeout: 300 });
    } else {
      setTimeout(() => {
        loadHeavyDeps.then(loadedDeps => {
          setDeps(loadedDeps);
          
          // Create theme after dependencies load (reduces work)
          const themeValue = loadedDeps.createTheme({
            palette: {
              mode: 'dark',
              primary: { main: '#c4975b' },
              background: {
                default: '#0e0e10',
                paper: '#0f1720',
              },
            },
            typography: {
              fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            },
          });
          setTheme(themeValue);
        });
      }, 50);
    }

    // Load App component in parallel but defer slightly to prioritize LCP image
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        AppPromise.then(module => {
          setApp(() => module.default);
        });
      }, { timeout: 200 });
    } else {
      setTimeout(() => {
        AppPromise.then(module => {
          setApp(() => module.default);
        });
      }, 50);
    }
  }, []);

  // Render immediately with minimal JS execution
  if (!deps || !theme || !app) {
    // Minimal render - no heavy dependencies
    return SimpleFallback();
  }

  const { BrowserRouter, HelmetProvider, ThemeProvider, CssBaseline, Suspense } = deps;
  const App = app;

  // Full render with all dependencies loaded
  return React.createElement(
    Suspense,
    { fallback: SimpleFallback() },
    React.createElement(
      HelmetProvider,
      null,
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(CssBaseline, null),
        React.createElement(
          AuthProvider,
          null,
          React.createElement(
            CartProvider,
            null,
            React.createElement(
              BrowserRouter,
              null,
              React.createElement(App, null),
              React.createElement(
                Suspense,
                { fallback: null },
                React.createElement(ToastContainerLazy, {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  newestOnTop: false,
                  closeOnClick: true,
                  rtl: false,
                  pauseOnFocusLoss: true,
                  draggable: true,
                  pauseOnHover: true,
                  theme: 'dark'
                })
              )
            )
          )
        )
      )
    )
  );
};

// Optimize initial render - minimal work on main thread
const initApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    requestAnimationFrame(initApp);
    return;
  }
  
  const root = createRoot(rootElement);
  
  // Render immediately with minimal JavaScript
  root.render(React.createElement(AppWrapper));
};

// Start immediately for faster FCP
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
