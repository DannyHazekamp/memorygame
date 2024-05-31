// card.js

import { timer, startTimer, stopTimer } from './timer.js';
import { fetchDogImages, fetchRandomImages } from './api.js';

let timeInterval;
let gameStarted = false;
let foundPairs = 0;
let cardSet = [];

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

export async function cardPairs(imageSource = 'dogs') {

    const container = document.querySelector('.item2.main');
    container.innerHTML = '';

    let cardset;
    if (imageSource === 'dogs') {
        cardSet = await createPairsFromDogImages();
    } else if (imageSource === 'randomPics') {
        cardSet = await createPairsFromRandomImages();
    } else {
        console.error('Unknown image source:', imageSource);
        return;
    }

    for (let i = 0; i < 36; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', 'closed');
        card.setAttribute('index', i);
        card.addEventListener('click', show);
        container.appendChild(card);
    }

    const newGameButton = document.querySelector('#newGame');
    newGameButton.addEventListener('click', function() {
        clearInterval(timeInterval);
        window.location.reload();
    });
}

export function show() {
    const cards = document.querySelectorAll('.card');

    if (!gameStarted) {
        gameStarted = true;
        timeInterval = setInterval(timer, 1000);
    }

    const index = this.getAttribute('index');

    if (this.id === 'closed' || !this.id) {
        this.style.backgroundImage = `url(${cardSet[index]})`;
        this.id = 'open';

        const openCards = document.querySelectorAll('.card#open');

        if (openCards.length === 2) {
            const [first, second] = openCards;
            const firstIndex = first.getAttribute('index');
            const secondIndex = second.getAttribute('index');

            if (cardSet[firstIndex] === cardSet[secondIndex]) {
                first.id = 'found';
                second.id = 'found';
                first.removeEventListener('click', show);
                second.removeEventListener('click', show);
                foundPairs++;
                if (foundPairs === 18) {
                    clearInterval(timeInterval);
                    alert('Goed gedaan, je hebt alle paren gevonden! Je hebt er ' + document.querySelector('#elapsedTime').innerHTML + ' seconden over gedaan');
                }
            } else {
                setTimeout(() => {
                    first.style.backgroundImage = '';
                    second.style.backgroundImage = '';
                    first.id = 'closed';
                    second.id = 'closed';
                }, 1000);
            }
        }
    } else {
        this.style.backgroundImage = '';
        this.id = 'closed';
    }
}
