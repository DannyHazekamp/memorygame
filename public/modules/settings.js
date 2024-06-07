import { cardPairs } from './card.js';
import { stopTimer } from './timer.js';

const symbolIcons = {
    dot: '•',
    star: '★',
    heart: '♥'
};

export function initSettings() {
    const settingsButton = document.querySelector('#settings');
    settingsButton.addEventListener('click', function() {
        window.location.href = 'settings.html';
    });

    const selectSymbol = document.querySelector('select');
    selectSymbol.addEventListener('change', handleSymbolChange);

    const newGameButton = document.querySelector('#newGame');
    newGameButton.addEventListener('click', handleNewGame);

    const openColorInput = document.querySelector('#openColor');
    openColorInput.addEventListener('change', handleOpenColorChange);

    const boardSizeSelector = document.querySelector('#boardSize');
    boardSizeSelector.addEventListener('change', handleBoardSizeChange);
}

export function handleSymbolChange() {
    const selectedSymbol = this.value;
    const symbols = document.querySelectorAll('.symbol');
    symbols.forEach(symbol => {
        symbol.innerHTML = symbolIcons[selectedSymbol];
    });
}

export function handleBoardSizeChange() {
    stopTimer();
    window.location.reload();
}

export function handleNewGame() {
    stopTimer();
    window.location.reload();
}

export function handleOpenColorChange() {
    const openCards = document.querySelectorAll('.card#open');
    openCards.forEach(card => {
        card.style.backgroundColor = this.value;
        card.style.borderColor = this.value;
    });
}
