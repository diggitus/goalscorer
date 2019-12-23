import { Row } from "./row";

export enum State {
    NEW, PLAYING
}

export class GameState {
    state: State | null;
    readyPlayerOne: boolean;
    readyPlayerTwo: boolean;
    rows: Array<Row> | null;

    constructor() {
        this.state = State.NEW;
        this.readyPlayerOne = false;
        this.readyPlayerTwo = false;
        this.rows = null;
    }
}