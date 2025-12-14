import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://debunk-api.onrender.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(
              `[Vite Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`
            );
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@layouts': '/src/layouts',
      '@components': '/src/components',
      '@api': '/src/api',
      '@router': '/src/router',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@styles': '/src/styles',
      '@pages': '/src/pages',
    },
  },
});
