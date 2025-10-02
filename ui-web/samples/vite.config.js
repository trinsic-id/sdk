import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        redirect: resolve(__dirname, "redirect.html"),
        widget: resolve(__dirname, "widget.html"),
        hosted: resolve(__dirname, "hosted.html"),
        mdl: resolve(__dirname, "mdl.html"),
        direct: resolve(__dirname, "direct.html"),
        directPopup: resolve(__dirname, "direct-popup.html"),
        directPollAfterRedirect: resolve(__dirname, "direct-poll-after-redirect.html"),
      },
    },
  },
};
