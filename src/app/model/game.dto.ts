export class GameDto {
    id: number;
    firstTeam: number;
    secondTeam: number; 
    firstTeamGoals: number;
    secondTeamGoals: number;

    constructor(id: number, firstTeam: number, secondTeam: number, firstTeamGoals: number, secondTeamGoals: number) {
        this.id = id;
        this.firstTeam = firstTeam;
        this.secondTeam = secondTeam;
        this.firstTeamGoals = firstTeamGoals;
        this.secondTeamGoals = secondTeamGoals;
    }
}