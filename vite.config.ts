import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import firebasePlugin from "vite-plugin-firebase";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "docs",
  },
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 9001,
  },
});
