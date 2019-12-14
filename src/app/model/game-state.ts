import { Row } from "./row";

export class GameState {
    rows: Array<Row> | null;

    constructor() {
        this.rows = null;
    }
}