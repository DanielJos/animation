// vite.config.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Animations",
      fileName: (format) => (format === "cjs" ? "index.cjs" : "index.js"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@mui/material",
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
        "react-leaflet",
        "leaflet",
        "@tanstack/react-query",
      ],
    },
    sourcemap: true,
    target: "es2020",
    emptyOutDir: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true,
    }),
  ],
});
