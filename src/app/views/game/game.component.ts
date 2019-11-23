import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/player';
import { SoccerPlayer } from 'src/app/model/soccer-player';
import { Row } from 'src/app/model/row';
import { FieldCell } from 'src/app/model/field-cell';

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss']
})
export class GameComponent {
    player1: Player;
    player2: Player;
    selectedPlayer: Player;
    selectedSoccerPlayer: SoccerPlayer;

    rows: Array<Row>;

    private rowsLength = 9;
    private colsLength = 5;

    constructor() {
        this.initPlayers();
        this.initRows();
        this.initSoccerPlayers();
    }

    private initPlayers() {
        this.player1 = new Player();
        this.player1.name = "Player1";
        this.player1.goals = 0;

        this.player2 = new Player();
        this.player2.name = "Player2";
        this.player2.goals = 0;

        this.selectedPlayer = this.player1;
    }

    private initRows() {
        this.rows = new Array<Row>();

        for (let i = 0; i < this.rowsLength; i++) {
            const row = new Row();
            row.id = i;
            row.fieldCells = new Array<FieldCell>();

            for (let j = 0; j < this.colsLength; j++) {
                const fieldCell = new FieldCell();
                fieldCell.row = row;
                fieldCell.id = j;
                fieldCell.soccerPlayer = null;
                fieldCell.disabled = false;
                fieldCell.highlighted = false;
                row.fieldCells.push(fieldCell);
            }
            this.rows.push(row);
        }
    }

    private initSoccerPlayers() {
        this.initPlayerOneSoccerPlayers();
        this.initPlayerTwoSoccerPlayers();
        this.selectedSoccerPlayer = null;
    }

    private initPlayerOneSoccerPlayers() {
        const soccerNumbers = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

        for (let i = 0; i <= 2; i++) {
            const row = this.rows[i];

            for (const fieldCell of row.fieldCells) {
                if (this.isDisabledField(row.id, fieldCell.id)) {
                    fieldCell.disabled = true;
                    continue;
                }

                const soccerPlayer = new SoccerPlayer();
                soccerPlayer.player = this.player1;
                soccerPlayer.num = soccerNumbers.shift();
                soccerPlayer.fieldCell = fieldCell;
                soccerPlayer.selected = false;
                fieldCell.soccerPlayer = soccerPlayer;
            }
        }
    }

    private isDisabledField(row: number, col: number): boolean {
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

    private initPlayerTwoSoccerPlayers() {
        const soccerNumbers = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

        for (let i = 6; i <= 8; i++) {
            const row = this.rows[i];

            for (const fieldCell of row.fieldCells) {
                if (this.isDisabledField(row.id, fieldCell.id)) {
                    fieldCell.disabled = true;
                    continue;
                }

                const soccerPlayer = new SoccerPlayer();
                soccerPlayer.player = this.player2;
                soccerPlayer.num = soccerNumbers.pop();
                soccerPlayer.fieldCell = fieldCell;
                soccerPlayer.selected = false;
                fieldCell.soccerPlayer = soccerPlayer;
            }
        }
    }

    private isGoalKeeper(row: number, col: number): boolean {
        return (row === 0 && col === 2) || (row === 8 && col === 2);
    }

    private isSoccerPlayerAlreadySelected(fieldCell: FieldCell): boolean {
        return (
            this.selectedSoccerPlayer &&
            this.selectedSoccerPlayer === fieldCell.soccerPlayer
        );
    }

    onFieldCellClick(fieldCell: FieldCell) {
        if (this.isSoccerPlayerAlreadySelected(fieldCell)) {
            this.selectedSoccerPlayer = null;
            fieldCell.soccerPlayer.selected = false;
            this.resetOptions();
            return;
        }

        if (fieldCell.soccerPlayer) {
            if (fieldCell.soccerPlayer.player !== this.selectedPlayer) {
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
                this.selectedSoccerPlayer.fieldCell.soccerPlayer = null;
                this.selectedSoccerPlayer.fieldCell = fieldCell;
                fieldCell.soccerPlayer = this.selectedSoccerPlayer;
                this.selectedSoccerPlayer = null;
                this.resetSoccerPlayerSelection();
                this.resetOptions();

                if (this.isGameOver()) {
                    alert(this.selectedPlayer.name);
                    return;
                }
                this.switchPlayer();
            }
        }
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
        const rowId = this.selectedSoccerPlayer.fieldCell.row.id;
        const colId = this.selectedSoccerPlayer.fieldCell.id;

        const selectableRows = this.getSelectableRows(rowId);
        const selectableCols = this.getSelectableCols(colId);

        this.rows.forEach(row => {
            row.fieldCells.forEach(fieldCell => {
                if (selectableRows.some(rowId => rowId === row.id)) {
                    if (selectableCols.some(colId => colId === fieldCell.id)) {
                        if (fieldCell.disabled) return;
                        if (fieldCell.soccerPlayer) return;

                        fieldCell.highlighted = true;
                    }
                }
            });
        });
    }

    private getSelectableCols(colId): Array<number> {
        const result = [];
        result.push(colId);

        if (colId - 1 >= 0) {
            result.push(colId - 1);
        }

        if (colId + 1 <= 4) {
            result.push(colId + 1);
        }
        return result;
    }

    private getSelectableRows(rowId: number): Array<number> {
        const result = [];

        if (this.selectedPlayer === this.player2) {
            if (rowId - 1 >= 0) {
                result.push(rowId - 1);
            }
        }

        if (this.selectedPlayer === this.player1) {
            if (rowId + 1 <= 8) {
                result.push(rowId + 1);
            }
        }
        return result;
    }

    onOK() {
        this.switchPlayer();
        this.resetOptions();
    }

    private switchPlayer() {
        this.selectedPlayer =
            this.selectedPlayer === this.player1 ? this.player2 : this.player1;
    }
}