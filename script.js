function cards() {
    const container = document.querySelector('.item2.main');
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const randomLetters = shuffle(letters);
    const cardLetters = randomLetters.slice(0, 18);
    
    const cardPairs = cardLetters.concat(cardLetters);
    console.log(cardPairs);


    const show = function() {
        if(this.id === 'closed') {
            const index = this.getAttribute('index');
            this.textContent = cardPairs[index];
            this.id = 'open';

            const openCards = document.querySelectorAll('.card#open');

            if (openCards.length === 2) {
                const [first, second] = openCards;

                firstIndex = first.getAttribute('index');
                secondIndex = second.getAttribute('index');

                if(cardPairs[firstIndex] === cardPairs[secondIndex]) {
                    first.id = 'found';
                    second.id = 'found';
                    first.removeEventListener('click', show);
                    second.removeEventListener('click', show);
                } else {
                    setTimeout(() => {
                        if (this.id === 'open') {
                            first.textContent = '';
                            second.textContent = '';
                            first.id = 'closed';
                            second.id = 'closed';
                        }
                    }, 1000);
            }
        }


        } else {
            this.textContent = '';
            this.id = 'closed';
        }
    };


    for(let i = 0; i < 36; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', 'closed');
        card.setAttribute('index', i);
        card.addEventListener('click', show);
        container.appendChild(card);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    cards();
});