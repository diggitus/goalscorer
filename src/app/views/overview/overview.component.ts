import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/model/game';
import { Team } from 'src/app/model/team';
import { OverviewService } from './overview.service';
import { GameDto } from 'src/app/model/game.dto';

@Component({
    selector: 'app-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.scss']
})

export class OverviewComponent implements OnInit {

    selectedTeam: number;
    games: Array<Game> | null;

    constructor(
        private overviewService: OverviewService
    ) {
        this.selectedTeam = 1;
        this.games = null;
    }

    ngOnInit() {
        this.overviewService.listGames().subscribe(resp => {
            this.games = this.parseGames(resp.games);
        })
    }

    private parseGames(gamesResp: any): Array<Game> {
        const games = new Array<Game>();
        
        for (let i = 0; i < gamesResp.length; i++) {
            const gameResp = gamesResp[i];
            const game = new Game();
            game.firstTeam = this.overviewService.getTeam(parseInt(gameResp.firstTeam));
            game.secondTeam = this.overviewService.getTeam(parseInt(gameResp.secondTeam));
            game.firstTeamGoals = gameResp.firstTeamGoals;
            game.secondTeamGoals = gameResp.secondTeamGoals;
            games.push(game);
        }
        return games;
    }

    onSelectTeam(teamId: number) {
        this.selectedTeam = teamId;
    }

    createNewGame(event: MouseEvent) {
        event.preventDefault();

        const game = new GameDto(0, 1, 0, 1);
        this.overviewService.createGame(game).subscribe(() => {
            const game = new Game();
            game.firstTeam = this.overviewService.getTeam(0);
            game.secondTeam = this.overviewService.getTeam(1);
            game.firstTeamGoals = 0;
            game.secondTeamGoals = 1;
            this.games.push(game);
        });
    }

    playGame(event: MouseEvent) {
        event.preventDefault();
        console.log('play game');
    }
}