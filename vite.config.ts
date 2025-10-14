import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ICM/',
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return `assets/${assetInfo.name}-[hash][extname]`.replace('./', '');
        },
        chunkFileNames: (chunkInfo) => {
          return `assets/${chunkInfo.name}-[hash].js`.replace('./', '');
        },
        entryFileNames: (entryInfo) => {
          return `assets/${entryInfo.name}-[hash].js`.replace('./', '');
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
