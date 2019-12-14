import { Team } from "./team";
import { GameState } from "./game-state";

export class Game {
    id: number;
    firstTeam: Team;
    secondTeam: Team;
    firstTeamGoals: number;
    secondTeamGoals: number;
    gameState: GameState | null;
}