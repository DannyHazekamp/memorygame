export function fetchTopFiveScores() {
    fetch('http://localhost:8000/scores')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.score - b.score);

            const topFiveScores = data.slice(0, 5);

            const topFiveList = document.getElementById('topFiveList');
            topFiveList.innerHTML = '';
            topFiveScores.forEach((score, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${score.username}: ${score.score.toFixed(1)}`;
                topFiveList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fout bij het ophalen van de scores:', error));
}

export function displayAverageGameDuration() {
    const averageDuration = calculateAverageGameDuration();
    document.querySelector('.settings-container p strong').textContent = `Gemiddelde speeltijd: ${averageDuration}s`;
}

function calculateAverageGameDuration() {
    const gameDurations = JSON.parse(localStorage.getItem('gameDurations')) || [];
    
    if (gameDurations.length === 0) {
        return 0;
    }

    const total = gameDurations.reduce((acc, curr) => acc + curr, 0);
    return (total / gameDurations.length).toFixed(1);
}
