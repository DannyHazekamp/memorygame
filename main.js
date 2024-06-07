import { cardPairs } from "./modules/card.js";
import { startTimer, stopTimer } from "./modules/timer.js";
import { handleAuth, setupSessionTimeout } from "./modules/auth.js";
import { fetchTopFiveScores, displayAverageGameDuration } from "./modules/score.js";
import { initSettings, handleSymbolChange, handleNewGame, handleOpenColorChange } from "./modules/settings.js";

document.addEventListener('DOMContentLoaded', function() {
    handleAuth();
    setupSessionTimeout();

    stopTimer();
    cardPairs();

    initSettings();
    fetchTopFiveScores();
    displayAverageGameDuration();
});
