const symbolIcons = {
    dot: '•',
    star: '★',
    heart: '♥'
};

export function initSettings() {
    const settingsButton = document.querySelector('#settings');
    settingsButton.addEventListener('click', function() {
        window.location.href = 'settings/settings.html';
    });

    const selectSymbol = document.querySelector('select');
    selectSymbol.addEventListener('change', handleSymbolChange);

    const newGameButton = document.querySelector('#newGame');
    newGameButton.addEventListener('click', handleNewGame);

    const openColorInput = document.querySelector('#openColor');
    openColorInput.addEventListener('change', handleOpenColorChange);
}

export function handleSymbolChange() {
    const selectedSymbol = this.value;
    const symbols = document.querySelectorAll('.symbol');
    symbols.forEach(symbol => {
        symbol.innerHTML = symbolIcons[selectedSymbol];
    });
}

export function handleNewGame() {
    stopTimer();
    cardPairs();
    startTimer();
}

export function handleOpenColorChange() {
    const openCards = document.querySelectorAll('.card#open');
    openCards.forEach(card => {
        card.style.backgroundColor = this.value;
        card.style.borderColor = this.value;
    });
}
