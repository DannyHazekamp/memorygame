import { cardPairs } from "./modules/card.js";
import { stopTimer } from "./modules/timer.js";
import { handleSession, logout } from "./modules/session.js";
import { fetchTopFiveScores, displayAverageGameDuration } from "./modules/score.js";
import { initSettings } from "./modules/settings.js";

document.addEventListener('DOMContentLoaded', function() {
    handleSession();
    stopTimer();
    cardPairs();

    initSettings();
    fetchTopFiveScores();
    displayAverageGameDuration();

    logout();
});
