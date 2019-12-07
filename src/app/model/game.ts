import { Team } from "./team";

export class Game {
    id: number;
    firstTeam: Team;
    secondTeam: Team;
    firstTeamGoals: number;
    secondTeamGoals: number;
}