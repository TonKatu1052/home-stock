import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'src',
  base: '/home-stock/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
          name: 'Home Stock',
          short_name: 'HomeStock',
          description: '家の在庫管理アプリ',
          start_url: '/home-stock/',
          theme_color: '#212529',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/home-stock/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/home-stock/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
      }
    })
  ]
});
