import { Component, ViewChild } from '@angular/core';
import { Player } from 'src/app/model/player';
import { SoccerPlayer } from 'src/app/model/soccer-player';
import { Row } from 'src/app/model/row';
import { FieldCell } from 'src/app/model/field-cell';
import { ActivatedRoute, RouterEvent } from '@angular/router';
import { Game } from 'src/app/model/game';
import { OverviewService } from '../overview/overview.service';
import { GameState, State } from 'src/app/model/game-state';
import { filter } from 'rxjs/operators';
import { PlayerAssignmentComponent } from 'src/app/player-assignment/player-assignment.component';

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss']
})
export class GameComponent {

    @ViewChild(PlayerAssignmentComponent, {static: false}) playerAssignment: PlayerAssignmentComponent;

    playerId: number | null;
    activePlayer: Player | null;
    selectedSoccerPlayer: SoccerPlayer;

    rows: Array<Row>;
    game: Game;

    private rowsLength = 9;
    private colsLength = 5;


    constructor(
        private route: ActivatedRoute,
        private overviewService: OverviewService
    ) {
        const gameId = this.route.snapshot.paramMap.get('id');
        
        this.overviewService.getGame(parseInt(gameId)).subscribe(gameResp => {
            if (gameResp) {
                this.game = this.overviewService.deserializeGame(gameResp);
                this.activePlayer = this.initActivePlayer();

                this.route.queryParams.pipe(filter(params => params.player)).subscribe(params => {
                    this.playerId = parseInt(params.player);
                });

                this.initRows();
                this.initSoccerPlayers(this.game.gameState);
                
                if (this.game.gameState.state === State.NEW) {
                    this.highlightFields();
                }
            }
        });
    }

    private highlightFields() {
        this.rows.forEach(row => {
            row.fieldCells.forEach(fieldCell => {
                if (this.isSelectableField(fieldCell)) {
                    fieldCell.highlighted = true;
                }
            });
        });
    }

    private isSelectableField(fieldCell): boolean {
        if (this.playerId === 0) {
            if (fieldCell.rowIdx >= 1 && fieldCell.rowIdx <= 2 && fieldCell.colIdx >= 0 && fieldCell.colIdx <= 4) {
                return true;
            }
        } else if (this.playerId === 1) {
            if (fieldCell.rowIdx >= 6 && fieldCell.rowIdx <= 7 && fieldCell.colIdx >= 0 && fieldCell.colIdx <= 4) {
                return true;
            }
        }
        return false;
    }

    private initRows() {
        this.rows = new Array<Row>();

        for (let i = 0; i < this.rowsLength; i++) {
            const row = new Row();
            row.idx = i;
            row.fieldCells = new Array<FieldCell>();

            for (let j = 0; j < this.colsLength; j++) {
                const fieldCell = new FieldCell();
                fieldCell.rowIdx = row.idx;
                fieldCell.colIdx = j;
                fieldCell.disabled = false;
                fieldCell.highlighted = false;
                fieldCell.soccerPlayer = null;
                row.fieldCells.push(fieldCell);
            }
            this.rows.push(row);
        }
    }

    private initSoccerPlayers(gameState: GameState) {
        gameState.players.forEach(player => {
            player.soccerPlayers.forEach(soccerPlayer => {
                const rowIdx = soccerPlayer.rowIdx;
                const colIdx = soccerPlayer.colIdx;
    
                if (rowIdx != null && colIdx != null) {
                    soccerPlayer.playerId = player.id;
                    this.rows[rowIdx].fieldCells[colIdx].soccerPlayer = soccerPlayer;
                }
            });
        });
    }

    private initActivePlayer(): Player {
        return this.game.gameState.players.filter(player => player.active)[0];
    }

    private isDisabledField(fieldCell: FieldCell): boolean {
        const row = fieldCell.rowIdx;
        const col = fieldCell.colIdx;

        return (
            (row === 0 && col === 0) ||
            (row === 0 && col === 1) ||
            (row === 0 && col === 3) ||
            (row === 0 && col === 4) ||
            (row === 8 && col === 0) ||
            (row === 8 && col === 1) ||
            (row === 8 && col === 3) ||
            (row === 8 && col === 4)
        );
    }

    private isSoccerPlayerAlreadySelected(fieldCell: FieldCell): boolean {
        return (
            this.selectedSoccerPlayer &&
            this.selectedSoccerPlayer === fieldCell.soccerPlayer
        );
    }

    onSoccerPlayerAssigned() {
        this.updateGame();
    }

    private isGoalkeeper(fieldCell: FieldCell): boolean {
        return (fieldCell.rowIdx === 0 && fieldCell.colIdx === 2) ||
            (fieldCell.rowIdx === 8 && fieldCell.colIdx === 2)
    }

    private getPlayer(): Player {
        return this.game.gameState.players[this.playerId];
    }

    finishButtonVisible(): boolean {
        const unassignedSoccerPlayers = this.getPlayer().soccerPlayers
            .filter(soccerPlayer => soccerPlayer.colIdx == null && soccerPlayer.rowIdx == null);
        return unassignedSoccerPlayers.length === 0 && !this.getPlayer().ready;
    }

    onReady() {
        this.game.gameState.players[this.playerId].ready = true;
        const allReady = this.game.gameState.players.filter(player => player.ready).length;

        if (allReady === this.game.gameState.players.length) {
            this.switchGameStateTo(State.PLAYING);
        }
        this.updateGame();
    }

    private switchGameStateTo(state: State) {
        switch(state) {
            case State.PLAYING:
                this.game.gameState.state = state;
                this.game.gameState.players[0].active = true; // player 1 always begins
                this.activePlayer = this.game.gameState.players[0];
                break;
        }
    }

    onFieldCellClick(fieldCell: FieldCell) {
        if (this.isDisabledField(fieldCell)) {
            return;
        }

        // New
        if (this.game.gameState.state === State.NEW) {
            if (this.getPlayer().ready) {
                return;
            } else if (fieldCell.soccerPlayer) {
                // delete soccer player on that position
                if (this.isSelectableField(fieldCell) && !this.isGoalkeeper(fieldCell)) {
                    fieldCell.soccerPlayer.rowIdx = null;
                    fieldCell.soccerPlayer.colIdx = null;
                    fieldCell.soccerPlayer = null;
                    this.playerAssignment.refresh();
                }
            } else {
                if (this.isSelectableField(fieldCell)) {
                    this.playerAssignment.showDialog(this.game.gameState.players[this.playerId], fieldCell);
                }
            }

        // Playing
        } else if (this.game.gameState.state === State.PLAYING) {
            if (!this.getPlayer().active) {
                return;
            }

            // reselect soccerplayer
            if (this.isSoccerPlayerAlreadySelected(fieldCell)) {
                this.selectedSoccerPlayer = null;
                fieldCell.soccerPlayer.selected = false;
                this.resetOptions();
                return;
            }
            
            // select soccerplayer
            if (fieldCell.soccerPlayer) {
                if (fieldCell.soccerPlayer.playerId !== this.playerId) {
                    return;
                }
                
                this.selectedSoccerPlayer = fieldCell.soccerPlayer;
                this.resetSoccerPlayerSelection();
                fieldCell.soccerPlayer.selected = true;
                this.resetOptions();
                this.showOptions();
                return;
            }
            
            if (this.selectedSoccerPlayer) {
                if (fieldCell.highlighted) {
                    this.removeSoccerPlayerFromFieldCell(this.selectedSoccerPlayer.rowIdx, this.selectedSoccerPlayer.colIdx);
                    this.selectedSoccerPlayer.rowIdx = fieldCell.rowIdx;
                    this.selectedSoccerPlayer.colIdx = fieldCell.colIdx;
                    fieldCell.soccerPlayer = this.selectedSoccerPlayer;
                    this.selectedSoccerPlayer = null;
                    this.resetSoccerPlayerSelection();
                    this.resetOptions();
                    this.switchActivePlayer();
                    
                    if (this.isGameOver()) {
                        alert(this.game.gameState.players[this.playerId].name);
                        return;
                    }
                }
            }
        }

        this.updateGame();
    }

    private removeSoccerPlayerFromFieldCell(rowIdx: number, colIdx: number) {
        for (let row of this.rows) {
            for (let fieldCell of row.fieldCells) {
                if (fieldCell.rowIdx == rowIdx && fieldCell.colIdx == colIdx) {
                    fieldCell.soccerPlayer = null;
                    return;
                }
            }
        }
    }

    private updateGame() {
        const gameDto = this.overviewService.serializeGame(this.game);
        this.overviewService.updateGame(gameDto).subscribe();
    }

    private isGameOver(): boolean {
        let fieldCell = this.rows[0].fieldCells[2];
        if (fieldCell.soccerPlayer != null && fieldCell.soccerPlayer.playerId === this.game.gameState.players[1].id) {
            this.game.gameState.players[1].goals++;
            return true;
        }

        fieldCell = this.rows[8].fieldCells[2];
        if (fieldCell.soccerPlayer != null && fieldCell.soccerPlayer.playerId === this.game.gameState.players[0].id) {
            this.game.gameState.players[0].goals++;
            return true;
        }
    }

    private resetSoccerPlayerSelection() {
        this.rows.forEach(row => {
            row.fieldCells.forEach(fieldCell => {
                if (fieldCell.soccerPlayer) {
                    fieldCell.soccerPlayer.selected = false;
                }
            });
        });
    }

    private resetOptions() {
        this.rows.forEach(row => {
            row.fieldCells.forEach(fieldCell => {
                fieldCell.highlighted = false;
            });
        });
    }

    private switchActivePlayer() {
        for (const player of this.game.gameState.players) {
            if (player.active) {
                player.active = false;
            } else {
                player.active = true;
                this.activePlayer = player;
            }
        }
    }

    private showOptions() {
        const currentRowIdx = this.selectedSoccerPlayer.rowIdx;
        const currentColIdx = this.selectedSoccerPlayer.colIdx;

        const selectableRowIndexes = this.getSelectableRowIndexes(currentRowIdx);
        const selectableColIndexes = this.getSelectableColIndexes(currentColIdx);

        this.rows.forEach(row => {
            row.fieldCells.forEach(fieldCell => {
                if (selectableRowIndexes.some(rowIdx => rowIdx === row.idx)) {
                    if (selectableColIndexes.some(colIdx => colIdx === fieldCell.colIdx)) {
                        if (fieldCell.disabled) return;
                        if (fieldCell.soccerPlayer) return;

                        fieldCell.highlighted = true;
                    }
                }
            });
        });
    }

    private getSelectableColIndexes(colIdx: number): Array<number> {
        const result = [];
        result.push(colIdx);

        if (colIdx - 1 >= 0) {
            result.push(colIdx - 1);
        }

        if (colIdx + 1 <= 4) {
            result.push(colIdx + 1);
        }
        return result;
    }

    private getSelectableRowIndexes(rowIdx: number): Array<number> {
        const result = [];

        if (this.playerId === 1) {
            if (rowIdx - 1 >= 0) {
                result.push(rowIdx - 1);
            }
        }

        if (this.playerId === 0) {
            if (rowIdx + 1 <= 8) {
                result.push(rowIdx + 1);
            }
        }
        return result;
    }
}