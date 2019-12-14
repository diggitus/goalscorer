import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from 'src/app/model/game';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Team } from 'src/app/model/team';
import { GameDto } from 'src/app/model/game.dto';

@Injectable()
export class OverviewService {

    private teams: Array<Team>;

    constructor(
        private http: HttpClient
    ) { 
        this.initTeams();
    }

    private initTeams() {
        this.teams = new Array<Team>();
        this.teams.push(new Team(0, 'Bayern München'));
        this.teams.push(new Team(1, "VfB Stuttgart"));
        this.teams.push(new Team(2, 'Dortmund'));
    }

    getTeams() {
        return this.teams;
    }

    getTeam(teamId: number): Team {
        return this.teams.find(team => team.id === teamId);
    }

    deserializeGame(gameResp: any): Game {
        const game = new Game();
        game.id = gameResp.id;
        game.firstTeam = this.getTeam(parseInt(gameResp.firstTeam));
        game.secondTeam = this.getTeam(parseInt(gameResp.secondTeam));
        game.firstTeamGoals = gameResp.firstTeamGoals;
        game.secondTeamGoals = gameResp.secondTeamGoals;
        game.gameState = gameResp.gameState ? JSON.parse(gameResp.gameState) : null;
        return game;
    }

    serializeGame(game: Game): GameDto {
        const gameDto = new GameDto()
        gameDto.id = game.id,
        gameDto.firstTeam = game.firstTeam.id,
        gameDto.secondTeam = game.secondTeam.id,
        gameDto.firstTeamGoals = game.firstTeamGoals,
        gameDto.secondTeamGoals = game.secondTeamGoals,
        gameDto.gameState = JSON.stringify(game.gameState);
        return gameDto;
    }

    listGames(): Observable<any> {
        return this.http.get('http://localhost:53636/api/game/list.php').pipe(catchError(error => of(null)));
    }

    getGame(gameId: number): Observable<any> {
        return this.http.get('http://localhost:53636/api/game/get.php?id=' + gameId).pipe(catchError(error => of(null)));
    }

    createGame(game: GameDto): Observable<any> {
        return this.http.post('http://localhost:53636/api/game/create.php', game);
    }

    deleteGame(game: Game): Observable<any> {
        return this.http.post('http://localhost:53636/api/game/delete.php?id=' + game.id, {});
    }

    updateGame(game: GameDto) {
        return this.http.post('http://localhost:53636/api/game/update.php', game);
    }


}