import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Gym App',
        short_name: 'Gym',
        description: 'Gym workout tracker and leaderboard',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    allowedHosts: [
      'unswooning-overgrossly-myla.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'fullcalendar': [
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction'
          ],
          'form-libs': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'ui-libs': ['@heroicons/react', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
