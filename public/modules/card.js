// card.js

import { timer, startTimer, stopTimer } from './timer.js';
import { fetchDogImages, fetchRandomImages } from './api.js';

let timeInterval;
let gameStarted = false;
let foundPairs = 0;
let cardSet = [];
let score = 0;
let numPairs = 0;

const selectedSymbol = 'dot';

const symbolIcons = {
    dot: '•',
    star: '★',
    heart: '♥'
};
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function createPairsFromDogImages(numPairs) {
    const dogUrls = await fetchDogImages();
    const selectedDogUrls = dogUrls.slice(0, numPairs);
    const duplicatedDogUrls = selectedDogUrls.flatMap(url => [url, url]);
    shuffle(duplicatedDogUrls);
    return duplicatedDogUrls;
}

async function createPairsFromRandomImages(numPairs) {
    const randomUrls = await fetchRandomImages();
    const selectedRandomUrls = randomUrls.slice(0, numPairs);
    const duplicatedRandomUrls = selectedRandomUrls.flatMap(url => [url, url]);
    shuffle(duplicatedRandomUrls);
    return duplicatedRandomUrls;
}

export async function cardPairs(boardSize) {

    const container = document.querySelector('.item2');
    container.innerHTML = '';

    const storedPreferences = JSON.parse(localStorage.getItem('formData'));
    const api = storedPreferences ? storedPreferences.api : 'dogs';
    const selectedSymbol = 'dot';

    boardSize = boardSize || 2;
    boardSize = parseInt(boardSize);

    if (boardSize === 2) {
        numPairs = 2; 
        container.className = 'item2  main-2x2';
    } else if (boardSize === 4) {
        numPairs = 8; 
        container.className = 'item2  main-4x4';
    } else {
        numPairs = 18; 
        container.className = 'item2  main-6x6';
    }

    const symbolIcons = {
        dot: '•',
        star: '★',
        heart: '♥'
    };

    if (api === 'dogs') {
        cardSet = await createPairsFromDogImages(numPairs);
    } else if (api === 'randomPics') {
        cardSet = await createPairsFromRandomImages(numPairs);
    } else {
        console.error('Onbekende api:', api);
        return;
    }

    cardSet = cardSet.slice(0, numPairs * 2);

    for (let i = 0; i < numPairs * 2; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', 'closed');
        card.setAttribute('index', i);

        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.innerHTML = symbolIcons[selectedSymbol];
        card.appendChild(symbol);

        card.addEventListener('click', show);
        container.appendChild(card);
    }

    const closedColor = localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')).color_closed : '#90ee90';

    const closedCards = document.querySelectorAll('.card#closed');
    closedCards.forEach(card => {
        card.style.backgroundColor = closedColor;
        card.style.borderColor = closedColor;
    });

}

export function show() {
    const cards = document.querySelectorAll('.card');
    const foundColor = localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')).color_found : '#800080';

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    const index = this.getAttribute('index');

    if (this.id === 'closed' || !this.id) {

        if (!this.querySelector('.symbol')) {
            const symbol = document.createElement('div');
            symbol.classList.add('symbol');
            symbol.innerHTML = symbolIcons[selectedSymbol];
            this.appendChild(symbol);
        }


        this.style.backgroundImage = `url(${cardSet[index]})`;
        this.querySelector('.symbol').style.visibility = 'hidden';
        this.id = 'open';

        const openCards = document.querySelectorAll('.card#open');

        if (openCards.length === 2) {
            const [first, second] = openCards;
            const firstIndex = first.getAttribute('index');
            const secondIndex = second.getAttribute('index');

            if (cardSet[firstIndex] === cardSet[secondIndex]) {
                first.id = 'found';
                second.id = 'found';

                first.style.backgroundColor = foundColor;
                first.style.borderColor = foundColor;

                second.style.backgroundColor = foundColor;
                second.style.borderColor = foundColor;

                first.removeEventListener('click', show);
                second.removeEventListener('click', show);
                foundPairs++;

                document.getElementById('foundPairs').textContent = foundPairs;

                if (foundPairs === numPairs) {
                    clearInterval(timeInterval);
                    saveGame();
                    alert('Goed gedaan, je hebt alle paren gevonden! Je hebt er ' + document.querySelector('#elapsedTime').innerHTML + ' seconden over gedaan');
                }
            } else {
                score += 5;

                const progressBarContent = document.querySelector('.progress-bar-content');
                progressBarContent.style.width = '100%';


                const decreaseWidthInterval = setInterval(() => {
                    const currentWidth = parseInt(progressBarContent.style.width);
                    if (currentWidth > 0) {
                        progressBarContent.style.width = (currentWidth - 1) + '%';
                    } else {
                        clearInterval(decreaseWidthInterval); 
                    }
                }, 20);

                setTimeout(() => {
                    first.style.backgroundImage = '';
                    second.style.backgroundImage = '';
                    first.id = 'closed';
                    second.id = 'closed';
                    first.querySelector('.symbol').style.visibility = 'visible';
                    second.querySelector('.symbol').style.visibility = 'visible';
                    progressBarContent.style.width = '0%';
                }, 2000);
            }
        }
    } else {
        this.style.backgroundImage = '';
        this.id = 'closed';
    }
}

function saveGame() {
    const userId = localStorage.getItem('userId');
    const storedPreferences = localStorage.getItem('formData');
    const preferences = JSON.parse(storedPreferences);

    const elapsedTime = parseInt(document.querySelector('#elapsedTime').textContent);

    let gameDurations = JSON.parse(localStorage.getItem('gameDurations')) || [];

    gameDurations.push(elapsedTime);

    localStorage.setItem('gameDurations', JSON.stringify(gameDurations));

    const formData = {
        id: userId,
        api: preferences.api,
        score: score,
        color_closed: preferences.color_closed,
        color_found: preferences.color_found
    };

    fetch('http://localhost:8000/game/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Spel succesvol opgeslagen!');
        } else {
            throw new Error('Fout bij het opslaan van het spel');
        }
    })
    .catch(error => {
        console.error('Fout bij het opslaan van het spel:', error);
    });
}
