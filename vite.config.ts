import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Disable runtime error overlay in development
const plugins = [react()];

// Load Replit plugins if in development and REPL_ID is set
if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
  try {
    // Use dynamic import with type assertion
    const cartographerModule = await import("@replit/vite-plugin-cartographer") as any;
    const cartographer = cartographerModule.default || cartographerModule;
    if (typeof cartographer === 'function') {
      plugins.push(cartographer());
    }
  } catch (error) {
    console.warn("Failed to load @replit/vite-plugin-cartographer", error);
  }
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    hmr: {
      overlay: false
    }
  },
});
