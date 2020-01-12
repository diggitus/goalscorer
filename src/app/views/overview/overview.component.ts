import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/model/game';
import { OverviewService } from './overview.service';
import { GameDto } from 'src/app/model/game.dto';
import { Router } from '@angular/router';
import { GameState } from 'src/app/model/game-state';
import { Player } from 'src/app/model/player';
import { SoccerPlayer } from 'src/app/model/soccer-player';

@Component({
    selector: 'app-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.scss']
})

export class OverviewComponent implements OnInit {

    selectedPlayer: number;
    games: Array<Game> | null;

    constructor(
        private overviewService: OverviewService,
        private router: Router
    ) {
        this.selectedPlayer = 0;
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
            const game = this.overviewService.deserializeGame(gameResp);
            games.push(game);
        }
        return games;
    }

    onSelectPlayer(playerId: number) {
        this.selectedPlayer = playerId;
    }

    createNewGame(event: MouseEvent) {
        event.preventDefault();

        const gameDto = new GameDto();
        gameDto.id = 0;

        const gameState = this.initGameState();
        gameDto.gameState = JSON.stringify(gameState);
        
        this.overviewService.createGame(gameDto).subscribe(() => {
            this.listGames();
        });
    }

    private initGameState(): GameState {
        const gameState = new GameState();
        gameState.players.push(this.initPlayer(0, 'Player1'));
        gameState.players.push(this.initPlayer(1, 'Player2'));
        this.chooseActivePlayer(gameState.players);
        return gameState;
    }

    private chooseActivePlayer(players: Array<Player>) {
        players[0].active = true; // can be random
    }

    private initPlayer(id: number, name: string): Player {
        const player = new Player();
        player.id = id;
        player.name = name;
        player.goals = 0;
        player.soccerPlayers = this.initSoccerPlayers(id);
        player.team = this.overviewService.getTeams()[0];
        player.lastActivityOn = null;
        player.active = false;
        player.ready = false;
        return player;
    }

    private initSoccerPlayers(playerId: number): Array<SoccerPlayer> {
        const soccerNumbers = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
        const soccerPlayers = new Array<SoccerPlayer>();

        soccerNumbers.forEach(soccerNumber => {
            const soccerPlayer = new SoccerPlayer();
            soccerPlayer.num = soccerNumber;
            soccerPlayer.playerId = playerId;

            if (playerId === 0 && soccerNumber === 1) {
                soccerPlayer.rowIdx = 0;
                soccerPlayer.colIdx = 2;
            } else if (playerId === 1 && soccerNumber === 1) {
                soccerPlayer.rowIdx = 8;
                soccerPlayer.colIdx = 2;
            }
            soccerPlayers.push(soccerPlayer);
        });
        return soccerPlayers;
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

    updateGame(game: Game) {
        const gameDto = this.overviewService.serializeGame(game);
        this.overviewService.updateGame(gameDto).subscribe(() => {
            this.listGames();
        });
    }

    canPlay(game: Game): boolean {
        return game.gameState.players[0].team.id !== game.gameState.players[1].team.id;
    }

    playGame(event: MouseEvent, game: Game) {
        event.preventDefault();
        this.router.navigate(['game', game.id], { queryParams: { player: this.selectedPlayer }});
    }
}