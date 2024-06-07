import { cardPairs } from "./modules/card.js";
import { startTimer, stopTimer } from "./modules/timer.js";
import { handleSession } from "./modules/session.js";
import { fetchTopFiveScores, displayAverageGameDuration } from "./modules/score.js";
import { initSettings, handleSymbolChange, handleNewGame, handleOpenColorChange } from "./modules/settings.js";

document.addEventListener('DOMContentLoaded', function() {
    handleSession();

    stopTimer();
    cardPairs();

    initSettings();
    fetchTopFiveScores();
    displayAverageGameDuration();
});
