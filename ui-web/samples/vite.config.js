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
        advanced: resolve(__dirname, "advanced.html"),
        advancedPopup: resolve(__dirname, "advanced-popup.html"),
        advancedPollAfterRedirect: resolve(__dirname, "advanced-poll-after-redirect.html"),
      },
    },
  },
};
