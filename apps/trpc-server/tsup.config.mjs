import { defineConfig } from "@yas/build/tsup.mjs";

export default defineConfig(__dirname, {
  outExtension: () => ({ js: `.js` }),
  format: "esm",
  entry: { index: "src/entrypoint.ts" },
  dts: false,
});
