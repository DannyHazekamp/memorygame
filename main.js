// main.js

import { cardPairs} from "./modules/card.js";
import { timer, stopTimer } from "./modules/timer.js";

document.addEventListener('DOMContentLoaded', function() {
    cardPairs();

    const newGameButton = document.querySelector('#newGame');
    newGameButton.addEventListener('click', function() {
        stopTimer();
        cardPairs();
        startTimer();
    });

    const imageSourceSelect = document.querySelector('#imageSource');
    imageSourceSelect.addEventListener('change', function() {
        stopTimer();
        const selectedValue = this.value;
        cardPairs(selectedValue);
        startTimer();
    });
});