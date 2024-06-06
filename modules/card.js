// card.js

import { timer, startTimer, stopTimer } from './timer.js';
import { fetchDogImages, fetchRandomImages } from './api.js';

let timeInterval;
let gameStarted = false;
let foundPairs = 0;
let cardSet = [];
let score = 0;

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

async function createPairsFromDogImages() {
    const dogUrls = await fetchDogImages();
    const duplicatedDogUrls = dogUrls.flatMap(url => [url, url]);
    shuffle(duplicatedDogUrls);
    return duplicatedDogUrls;
}

async function createPairsFromRandomImages() {
    const randomUrls = await fetchRandomImages();
    const duplicatedRandomUrls = randomUrls.flatMap(url => [url, url]);
    shuffle(duplicatedRandomUrls);
    return duplicatedRandomUrls;
}

export async function cardPairs() {

    const container = document.querySelector('.item2.main');
    container.innerHTML = '';

    const storedPreferences = JSON.parse(localStorage.getItem('formData'));
    const api = storedPreferences ? storedPreferences.api : 'dogs';
    const selectedSymbol = 'dot';

    const symbolIcons = {
        dot: '•',
        star: '★',
        heart: '♥'
    };

    if (api === 'dogs') {
        cardSet = await createPairsFromDogImages();
    } else if (api === 'randomPics') {
        cardSet = await createPairsFromRandomImages();
    } else {
        console.error('Onbekende api:', api);
        return;
    }

    for (let i = 0; i < 36; i++) {
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


    const newGameButton = document.querySelector('#newGame');
    newGameButton.addEventListener('click', function() {
        clearInterval(timeInterval);
        window.location.reload();
    });
}

export function show() {
    const cards = document.querySelectorAll('.card');
    const foundColor = localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')).color_found : '#800080';

    if (!gameStarted) {
        gameStarted = true;
        timeInterval = setInterval(timer, 1000);
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

                if (foundPairs === 18) {
                    clearInterval(timeInterval);
                    saveGame();
                    alert('Goed gedaan, je hebt alle paren gevonden! Je hebt er ' + document.querySelector('#elapsedTime').innerHTML + ' seconden over gedaan');
                }
            } else {
                score += 5;
                setTimeout(() => {
                    first.style.backgroundImage = '';
                    second.style.backgroundImage = '';
                    first.id = 'closed';
                    second.id = 'closed';
                    first.querySelector('.symbol').style.visibility = 'visible';
                    second.querySelector('.symbol').style.visibility = 'visible';
                }, 1000);
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
