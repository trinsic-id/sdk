import { launchRedirect } from "@trinsic/web-ui";

const form = document.querySelector("form")!;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const launchUrl = new FormData(form).get("launchUrl");
  if (typeof launchUrl === "string") launchRedirect(launchUrl).catch(error => alert(error.message));
});
