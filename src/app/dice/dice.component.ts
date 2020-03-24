import { Component, Output, EventEmitter, Input } from '@angular/core';

/**
 * The dice component. Returns a random number between 1 and 6.
 */
@Component({
    selector: 'app-dice',
    templateUrl: 'dice.component.html',
    styleUrls: ['dice.component.scss']
})
export class DiceComponent {

    @Input() enabled: boolean;
    @Output() rolledDice: EventEmitter<number> | null;

    randomNumber: number | null;

    constructor() {
        this.enabled = false;
        this.randomNumber = null;
        this.rolledDice = new EventEmitter<number>();
    }

    onRoll() {
        if (!this.enabled) {
            return;
        }
        this.randomNumber = this.getRndInteger(1, 6);
        this.rolledDice.emit(this.randomNumber);
    }

    private getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}