// main.js

import { cardPairs} from "./modules/card.js";
import { timer, stopTimer } from "./modules/timer.js";

document.addEventListener('DOMContentLoaded', function() {

     const jwtToken = localStorage.getItem('jwt');
     if (jwtToken) {

         const ttl = 3600;

         tokenExpiry(() => {
             localStorage.removeItem('jwt');
             alert('Sessie verlopen, je moet opnieuw inloggen');

             window.location.href = "/auth/login.html";
         }, ttl * 1000);
     } else {
         alert('Je moet ingelogd zijn hiervoor');
         window.location.href = "/auth/login.html";
     }

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