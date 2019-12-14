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
        this.listGames();
    }

    private listGames() {
        this.overviewService.listGames().subscribe(resp => {
            if (resp == null) {
                this.games = new Array<Game>();
            } else {
                this.games = this.parseGames(resp.games);
            }
        })
    }

    private parseGames(gamesResp: any): Array<Game> {
        const games = new Array<Game>();
        
        for (let i = 0; i < gamesResp.length; i++) {
            const gameResp = gamesResp[i];
            const game = new Game();
            game.id = gameResp.id;
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

        const gameDto = new GameDto(0, 0, 1, 0, 0);
        this.overviewService.createGame(gameDto).subscribe(() => {
            this.listGames();
        });
    }

    deleteGame(event: MouseEvent, game: Game) {
        event.preventDefault();

        const confirmed = confirm("Spiel wirklich löschen?");

        if (confirmed) {
            this.overviewService.deleteGame(game).subscribe(() => {
                this.listGames();
            });
        }
    }

    updateGame(game: Game, toUpdate: number, team: Team) {
        if (toUpdate === 0) {
            game.firstTeam = team;
        } else {
            game.secondTeam = team;
        }

        const gameDto = new GameDto(
            game.id,
            game.firstTeam.id,
            game.secondTeam.id,
            game.firstTeamGoals,
            game.secondTeamGoals
        );

        this.overviewService.updateGame(gameDto).subscribe(() => {
            this.listGames();
        });
    }

    playGame(event: MouseEvent) {
        event.preventDefault();
        console.log('play game');
    }
}