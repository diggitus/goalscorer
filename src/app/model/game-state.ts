import { Row } from "./row";

export enum State {
    NEW, PLAYING
}

export class GameState {
    state: State | null;
    rows: Array<Row> | null;

    constructor() {
        this.state = State.NEW;
        this.rows = null;
    }
}