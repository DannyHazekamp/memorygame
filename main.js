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

    const closedColorInput = document.querySelector('#closedColor');
    const openColorInput = document.querySelector('#openColor');
    const foundColorInput = document.querySelector('#foundColor');

    closedColorInput.addEventListener('change', function() {
        const closedCards = document.querySelectorAll('.card#closed');
        closedCards.forEach(card => {
            card.style.backgroundColor = this.value;
            card.style.borderColor = this.value;
        });
    });

    openColorInput.addEventListener('change', function() {
        const openCards = document.querySelectorAll('.card#open');
        openCards.forEach(card => {
            card.style.backgroundColor = this.value;
            card.style.borderColor = this.value;
        });
    });

    foundColorInput.addEventListener('change', function() {
        const foundCards = document.querySelectorAll('.card#found');
        foundCards.forEach(card => {
            card.style.backgroundColor = this.value;
            card.style.borderColor = this.value;
        });
    });
});