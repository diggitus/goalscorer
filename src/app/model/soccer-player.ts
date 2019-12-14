import { Player } from './player';
import { FieldCell } from './field-cell';

export class SoccerPlayer {
  num: number;
  player: Player;
  selected: boolean;
  rowIdx: number;
  colIdx: number;
}