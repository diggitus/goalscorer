export class GameDto {
    firstTeam: number;
    secondTeam: number; 
    firstTeamGoals: number;
    secondTeamGoals: number;

    constructor(firstTeam: number, secondTeam: number, firstTeamGoals: number, secondTeamGoals: number) {
        this.firstTeam = firstTeam;
        this.secondTeam = secondTeam;
        this.firstTeamGoals = firstTeamGoals;
        this.secondTeamGoals = secondTeamGoals;
    }
}