import { Component, ViewChild } from '@angular/core';
import { Player } from 'src/app/model/player';
import { SoccerPlayer } from 'src/app/model/soccer-player';
import { Row } from 'src/app/model/row';
import { FieldCell } from 'src/app/model/field-cell';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/model/game';
import { OverviewService } from '../overview/overview.service';
import { GameState } from 'src/app/model/game-state';
import { filter } from 'rxjs/operators';
import { PlayerAssignmentComponent } from 'src/app/player-assignment/player-assignment.component';

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss']
})
export class GameComponent {

    @ViewChild(PlayerAssignmentComponent, {static: false}) playerAssignment: PlayerAssignmentComponent;

    player1: Player;
    player2: Player;
    activePlayer: Player;
    selectedSoccerPlayer: SoccerPlayer;

    rows: Array<Row>;

    private rowsLength = 9;
    private colsLength = 5;

    private game: Game;

    constructor(
        private route: ActivatedRoute,
        private overviewService: OverviewService
    ) {
        const gameId = this.route.snapshot.paramMap.get('id');
        
        this.overviewService.getGame(parseInt(gameId)).subscribe(gameResp => {
            this.route.queryParams.pipe(filter(params => params.player)).subscribe(params => {
                const playerId = params.player;
                this.initPlayers(parseInt(playerId));
            });

            if (gameResp) {
                this.game = this.overviewService.deserializeGame(gameResp);

                if (this.game.gameState == null) {
                    this.game.gameState = new GameState();
                    this.initRows();
                } else {
                    this.rows = this.parseRows(this.game.gameState.rows);
                }
            }
        });
    }

    private parseRows(rows: any): Array<Row> {
        for (let row of rows) {
            for (let fieldCell of row.fieldCells) {
                if (fieldCell.soccerPlayer) {
                    fieldCell.soccerPlayer.player = this.parsePlayer(fieldCell.soccerPlayer.player);
                }
            }
        }
        return rows;
    }

    private parsePlayer(player: any): Player {
        if (player.name == "Player1") {
            return this.player1;
        } else {
            return this.player2;
        }
    }

    private initPlayers(playerId: number) {
        this.player1 = new Player();
        this.player1.name = "Player1";
        this.player1.goals = 0;

        this.player2 = new Player();
        this.player2.name = "Player2";
        this.player2.goals = 0;

        this.activePlayer = playerId === 1 ? this.player1 : this.player2;
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
                fieldCell.soccerPlayer = null;
                fieldCell.disabled = false;
                fieldCell.highlighted = false;
                row.fieldCells.push(fieldCell);
            }
            this.rows.push(row);
        }
        this.game.gameState.rows = this.rows;
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

    onFieldCellClick(fieldCell: FieldCell) {
        if (this.isDisabledField(fieldCell)) {
            return;
        }

        this.playerAssignment.showDialog(this.activePlayer, this.rows, fieldCell);

        if (this.isSoccerPlayerAlreadySelected(fieldCell)) {
            this.selectedSoccerPlayer = null;
            fieldCell.soccerPlayer.selected = false;
            this.resetOptions();
            return;
        }

        if (fieldCell.soccerPlayer) {
            if (fieldCell.soccerPlayer.player !== this.activePlayer) {
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

                if (this.isGameOver()) {
                    alert(this.activePlayer.name);
                    return;
                }
                this.switchPlayer();
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
        if (fieldCell.soccerPlayer != null && fieldCell.soccerPlayer.player === this.player2) {
            this.player2.goals++;
            return true;
        }

        fieldCell = this.rows[8].fieldCells[2];
        if (fieldCell.soccerPlayer != null && fieldCell.soccerPlayer.player === this.player1) {
            this.player1.goals++;
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

        if (this.activePlayer === this.player2) {
            if (rowIdx - 1 >= 0) {
                result.push(rowIdx - 1);
            }
        }

        if (this.activePlayer === this.player1) {
            if (rowIdx + 1 <= 8) {
                result.push(rowIdx + 1);
            }
        }
        return result;
    }

    onOK() {
        this.switchPlayer();
        this.resetOptions();
    }

    private switchPlayer() {
        this.activePlayer =
            this.activePlayer === this.player1 ? this.player2 : this.player1;
    }
}