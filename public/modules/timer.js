let timeInterval;

export function timer() {
    let timerValue = parseInt(document.querySelector('#elapsedTime').textContent) || 0;
    timerValue++;
    document.querySelector('#elapsedTime').textContent = timerValue;
}

export function startTimer() {
    timeInterval = setInterval(timer, 1000);
}

export function stopTimer() {
    clearInterval(timeInterval);
    timeInterval = null;
    document.querySelector('#elapsedTime').textContent = 0;
}
