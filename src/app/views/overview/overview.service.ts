import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from 'src/app/model/game';
import { Observable } from 'rxjs';
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

    getTeam(teamId: number): Team {
        return this.teams.find(team => team.id === teamId);
    }

    listGames(): Observable<any> {
        return this.http.get('http://localhost:53636/api/game/list.php');
    }

    createGame(game: GameDto): Observable<any> {
        return this.http.post('http://localhost:53636/api/game/create.php', game);
    }


}