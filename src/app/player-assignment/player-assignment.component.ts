import { Component, Output, EventEmitter } from '@angular/core';
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
    
    @Output() select: EventEmitter<any> | null;

    visible: boolean;
    unassignedSoccerPlayers: Array<SoccerPlayer>;

    private player: Player;
    private fieldCell: FieldCell;
    
    constructor() {
        this.select = new EventEmitter<any>();
        this.visible = false;
     }

    showDialog(player: Player, fieldCell: FieldCell) {
        this.fieldCell = fieldCell;
        this.player = player;
        this.unassignedSoccerPlayers = this.player.soccerPlayers
            .filter(soccerPlayer => soccerPlayer.rowIdx == null && soccerPlayer.colIdx == null)
        this.visible = true;
    }

    refresh() {
        this.unassignedSoccerPlayers = this.player.soccerPlayers
            .filter(soccerPlayer => soccerPlayer.rowIdx == null && soccerPlayer.colIdx == null)
    }

    onSelect(soccerPlayer: SoccerPlayer) {
        soccerPlayer.rowIdx = this.fieldCell.rowIdx;
        soccerPlayer.colIdx = this.fieldCell.colIdx;
        this.fieldCell.soccerPlayer = soccerPlayer;
        
        this.visible = false;
        this.select.emit();
    }

    onCancel(event: Event) {
        event.preventDefault();
        this.visible = false;
    }
}
