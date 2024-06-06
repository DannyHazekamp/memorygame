// main.js

import { cardPairs} from "./modules/card.js";
import { timer, startTimer, stopTimer } from "./modules/timer.js";

const symbolIcons = {
    dot: '•',
    star: '★',
    heart: '♥'
};

document.addEventListener('DOMContentLoaded', function() {

    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {

        const ttl = 3600;

        setTimeout(() => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userId');
            localStorage.removeItem('formData');
            alert('Sessie verlopen, je moet opnieuw inloggen');

            window.location.href = "/index.html";
        }, ttl * 1000);
    } else {
        alert('Je moet ingelogd zijn hiervoor');
        window.location.href = "/index.html";
    }

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }

    const decodedToken = parseJwt(jwtToken);
    const userId = decodedToken.sub;   
    localStorage.setItem('userId', userId);

    if (!localStorage.getItem('formData')) {
        localStorage.setItem('formData', JSON.stringify({ 
            api: 'dogs',
            color_closed: '#90ee90',
            color_found: '#800080' 
        }));
    }

    stopTimer();
    cardPairs();

    const settingsButton = document.querySelector('#settings');
    settingsButton.addEventListener('click', function() {
        window.location.href = 'settings/settings.html';
    });

    const selectSymbol = document.querySelector('select');
    selectSymbol.addEventListener('change', function() {
        const selectedSymbol = this.value;
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach(symbol => {
            symbol.innerHTML = symbolIcons[selectedSymbol];
        });
    });

    const newGameButton = document.querySelector('#newGame');
    newGameButton.addEventListener('click', function() {
        stopTimer();
        cardPairs();
        startTimer();
    });

    const openColorInput = document.querySelector('#openColor');

    openColorInput.addEventListener('change', function() {
        const openCards = document.querySelectorAll('.card#open');
        openCards.forEach(card => {
            card.style.backgroundColor = this.value;
            card.style.borderColor = this.value;
        });
    });

    function fetchTopFiveScores() {
            fetch('http://localhost:8000/scores')
                .then(response => response.json())
                .then(data => {
                    data.sort((a, b) => a.score - b.score);

                    const topFiveScores = data.slice(0, 5);

                    const topFiveList = document.getElementById('topFiveList');
                    topFiveList.innerHTML = '';
                    data.forEach((score, index) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${index + 1}. ${score.username}: ${score.score.toFixed(1)}`;
                        topFiveList.appendChild(listItem);
                    });
                })
                .catch(error => console.error('Fout bij het ophalen van scores:', error));
    }

    fetchTopFiveScores();
});
