import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSourceLocator } from "@metagptx/vite-plugin-source-locator";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.VITE_PORT || '22000');
  return {
    plugins: [
      viteSourceLocator({
        prefix: "icm",
      }),
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
    server: {
      port: port,
      strictPort: true,
      host: true,
    },
  }
  
});
