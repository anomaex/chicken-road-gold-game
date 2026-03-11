import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  server: {
    port: 8080,
    open: true,
  },
  plugins: [viteSingleFile()],
  build: {
    target: "es2015",
    assetsInlineLimit: 100000000, // ВАЖНО: 100MB лимит, чтобы картинки стали Base64
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
