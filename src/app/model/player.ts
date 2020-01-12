import { Team } from "./team";
import { SoccerPlayer } from "./soccer-player";

export class Player {
  id: number;
  name: string;
  goals: number;
  soccerPlayers: Array<SoccerPlayer>;
  team: Team;
  lastActivityOn: number;
  active: boolean; // current player is active
  ready: boolean; // all soccer players set
}