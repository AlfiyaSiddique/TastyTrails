import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "TastyTrails",
        short_name: "TastyTrails",
        description: "Explore, create, and share recipes with TastyTrails, your companion in culinary adventures.",
        start_url: "/",
        display_override: ["window-controls-overlay"],
        display: "standalone",
        background_color: "#0a1f44",
        theme_color: "#ff0000",
        orientation: "portrait-primary",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        lang: "en",
        scope: "/",
        screenshots: [
          {
            src: "540x720.png",
            type: "image/png",
            sizes: "540x720"
          },
          {
            src: "540x720.png",
            type: "image/png",
            sizes: "540x720",
            form_factor: "wide"
          }
        ],
        related_applications: [],
        prefer_related_applications: false
      },
      workbox: {
        // You can add custom Workbox settings here if necessary
      }
    })
  ],
});
