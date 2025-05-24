import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";
import { fileURLToPath } from "url";

//https://react-dev-inspector.zthxxx.me/docs/inspector-component ,_ new plug in may delete la
//import { inspectorServer } from 'react-dev-inspector/vite-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],//inspectorServer()
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
});
