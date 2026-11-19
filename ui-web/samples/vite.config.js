import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        redirect: resolve(__dirname, "redirect.html"),
        hosted: resolve(__dirname, "hosted.html"),
        direct: resolve(__dirname, "direct.html"),
        directSession: resolve(__dirname, "direct-session.html"),
        directPollAfterRedirect: resolve(__dirname, "direct-poll-after-redirect.html"),
      },
    },
  },
};
