import { SoccerPlayer } from './soccer-player';

export class FieldCell {
  rowIdx: number;
  colIdx: number;
  soccerPlayer: SoccerPlayer;
  disabled: boolean;
  highlighted: boolean;
}