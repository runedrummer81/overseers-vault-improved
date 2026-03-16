import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: "/",
  };

  // Change base path when building for production
  if (command !== "serve") {
    config.base = "/overseers-vault-improved/"; // 👈 Replace with your GitHub repository name
  }

  return config;
});
