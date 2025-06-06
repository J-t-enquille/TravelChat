import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            plugins: [commonjs(), nodeResolve()],
            input: resolve(__dirname, "src/index.ts"),
            output: {
                entryFileNames: `bundle.js`,
                dir: resolve(__dirname, "dist"),
            },
        },
        ssr: true,
    },
});
