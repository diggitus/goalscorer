import { Player } from "./player";

export enum State {
    NEW, PLAYING
}

export class GameState {
    state: State | null;
    players: Array<Player> | null;

    constructor() {
        this.state = State.NEW;
        this.players = new Array<Player>();
    }
}