import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        redirect: resolve(__dirname, "redirect.html"),
      },
    },
  },
};
