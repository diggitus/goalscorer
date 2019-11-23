import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/model/game';
import { Team } from 'src/app/model/team';

@Component({
    selector: 'app-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.scss']
})

export class OverviewComponent implements OnInit {

    selectedTeam: number;
    games: Array<Game> | null;

    constructor() {
        this.selectedTeam = 1;
        this.games = null;
     }

    ngOnInit() {
        this.games = new Array<Game>();

        const game = new Game();
        game.team1 = new Team('Bayern');
        game.team1Goals = 0;
        game.team2 = new Team('Dortmund');
        game.team1Goals = 1;
        this.games.push(game);
     }

    onSelectTeam(teamId: number) {
        this.selectedTeam = teamId;
    }

    createNewGame(event: MouseEvent) {
        event.preventDefault();
        console.log('new game');

        const game = new Game();
        game.team1 = new Team('Bayern');
        game.team1Goals = 0;
        game.team2 = new Team('Dortmund');
        game.team1Goals = 1;
        this.games.push(game);
    }

    playGame(event: MouseEvent) {
        event.preventDefault();
        console.log('play game');
    }
}