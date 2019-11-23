import { Component } from "@angular/core";
import { FieldCell } from "./model/field-cell";
import { Row } from "./model/row";
import { SoccerPlayer } from "./model/soccer-player";
import { Player } from "./model/player";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular";
}
