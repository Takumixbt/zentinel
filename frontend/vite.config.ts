import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The Zama relayer SDK ships WASM (TFHE + KMS). Excluding it from dep
// pre-bundling lets Vite serve the WASM glue correctly, and esnext keeps
// top-level await / bigint literals intact.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["@zama-fhe/relayer-sdk"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
});
