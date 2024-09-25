import { launchPopup } from "@trinsic/web-ui";

console.log(launchPopup(() => Promise.resolve("https://google.com")));
