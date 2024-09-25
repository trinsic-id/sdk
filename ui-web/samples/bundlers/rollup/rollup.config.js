import { nodeResolve } from "@rollup/plugin-node-resolve";
// rollup.config.js
export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife", // Suitable for <script> tags in browsers
    name: "MyBundle", // Global variable name
  },
  plugins: [nodeResolve()],
};
