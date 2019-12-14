export class GameDto {
    id: number | null;
    firstTeam: number | null;
    secondTeam: number | null; 
    firstTeamGoals: number | null;
    secondTeamGoals: number | null;
    gameState: string | null;

    constructor() {
        this.id = null;
        this.firstTeam = null;
        this.secondTeam = null;
        this.firstTeamGoals = null;
        this.secondTeamGoals = null;
        this.gameState = null;
    }
}