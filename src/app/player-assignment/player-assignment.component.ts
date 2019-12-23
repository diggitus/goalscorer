import { Component } from '@angular/core';
import { FieldCell } from '../model/field-cell';
import { SoccerPlayer } from '../model/soccer-player';
import { Player } from '../model/player';
import { Row } from '../model/row';

@Component({
    selector: 'app-player-assignment',
    templateUrl: './player-assignment.component.html',
    styleUrls: ['./player-assignment.component.scss']
})
export class PlayerAssignmentComponent {
    
    visible: boolean;
    availableSoccerNumbers: Array<number>;

    private soccerNumbers: Array<number>;
    private player: Player;
    private fieldCell: FieldCell;
    
    constructor() {
        this.visible = false;
        this.soccerNumbers = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
     }

    showDialog(player: Player, rows: Array<Row>, fieldCell: FieldCell) {
        this.fieldCell = fieldCell;
        this.player = player;
        const usedSoccerNumbers = rows
            .map(row => row.fieldCells
                .filter(fieldCell => fieldCell.soccerPlayer != null && fieldCell.soccerPlayer.player.name === player.name)
                .map(fieldCell => fieldCell.soccerPlayer.num)
            ).reduce((prev, cur) => prev.concat(cur), []);

        this.soccerNumbers = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
            
        usedSoccerNumbers.forEach(usedSoccerNumber => {
                const idx = this.soccerNumbers.indexOf(usedSoccerNumber);
                this.soccerNumbers.splice(idx, 1);
            });

        this.availableSoccerNumbers = this.soccerNumbers;
        this.visible = true;
    }

    onSelect(availableSoccerNumber: number) {
        const soccerPlayer = new SoccerPlayer();
        soccerPlayer.player = this.player;
        soccerPlayer.num = availableSoccerNumber;
        soccerPlayer.rowIdx = this.fieldCell.rowIdx;
        soccerPlayer.colIdx = this.fieldCell.colIdx;
        soccerPlayer.selected = false;
        this.fieldCell.soccerPlayer = soccerPlayer;
        
        this.visible = false;
    }

    onCancel(event: Event) {
        event.preventDefault();
        this.visible = false;
    }
}
