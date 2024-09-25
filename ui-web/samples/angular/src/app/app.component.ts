import { Component } from "@angular/core";
import { launchPopup } from "@trinsic/web-ui";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [],
  template: `<h1>Hello world!</h1>`,
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "homes" + typeof launchPopup;
  constructor() {
    launchPopup(() => Promise.resolve("https://google.com"));
    console.log(typeof launchPopup);
  }
}
