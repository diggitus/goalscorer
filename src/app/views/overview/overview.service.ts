import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from 'src/app/model/game';
import { Observable } from 'rxjs';

@Injectable()
export class OverviewService {

    constructor(
        private http: HttpClient
    ) { }

    createGame(game: Game): Observable<any> {
        return this.http.post('http://localhost:53636/api/game/create.php', {team1: 'Bayern', team2: 'Dortmund', goals1: 0, goals2: 2});
    }


}