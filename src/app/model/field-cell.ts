import { SoccerPlayer } from './soccer-player';
import { Row } from './row';

export class FieldCell {
  row: Row;
  id: number;
  soccerPlayer: SoccerPlayer;
  disabled: boolean;
  highlighted: boolean;
}