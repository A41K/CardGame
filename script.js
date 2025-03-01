// script.js
window.onload = () => {
    const handContainer = document.getElementById('handContainer');
    const playingField = document.getElementById('playingField');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const moneyDisplay = document.getElementById('moneyDisplay');
    const deckContainer = document.getElementById('deckContainer');
    const shopContainer = document.getElementById('shopItems');
    const multiplierContainer = document.getElementById('multiplierContainer');
    let targetScore = 20;
    let currentScore = 0;
    let money = 0;
    let cardsInHand = [];
    let multipliers = [];
    let roundNumber = 1;

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateTargetScore() {
        targetScore = Math.floor(20 * Math.pow(3, roundNumber - 1));
        scoreDisplay.textContent = `Target Score: ${targetScore}`;
    }

    function generateRandomCard() {
        const value = getRandomNumber(1, 10);
        const isRed = Math.random() < 0.5;
        return { value, color: isRed ? 'red' : 'black' };
    }

    function generateInitialHand() {
        cardsInHand = [];
        for (let i = 0; i < 5; i++) {
            cardsInHand.push(generateRandomCard());
        }
        renderHand();
    }

    function renderHand() {
        handContainer.innerHTML = '';
        cardsInHand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'handcard';
            cardElement.textContent = card.value;
            cardElement.style.backgroundColor = card.color;
            cardElement.onclick = () => playCard(index);
            handContainer.appendChild(cardElement);
        });
    }

    function playCard(index) {
        const card = cardsInHand.splice(index, 1)[0];
        const totalMultiplier = multipliers.reduce((acc, val) => acc * val, 1);
        currentScore += card.value * totalMultiplier;
        renderHand();
        const playedCard = document.createElement('div');
        playedCard.className = 'card';
        playedCard.textContent = card.value;
        playedCard.style.backgroundColor = card.color;
        playingField.appendChild(playedCard);
        earnMoney(card.value);
        checkScore();
    }

    function drawCard() {
        if (cardsInHand.length < 5) {
            cardsInHand.push(generateRandomCard());
            renderHand();
        }
    }

    function checkScore() {
        if (currentScore >= targetScore) {
            alert('You win!');
            roundNumber++;
            startGame(true);
        } else if (cardsInHand.length === 0) {
            alert('You lose! Not enough points.');
            roundNumber = 1;
            startGame(false);
        }
    }

    function earnMoney(amount) {
        money += amount;
        moneyDisplay.textContent = `Money: $${money}`;
    }

    function generateShopItems() {
        shopContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const multiplierValue = getRandomNumber(1, 5);
            const cost = multiplierValue * 3;
            const shopItem = document.createElement('div');
            shopItem.className = 'shop-item';
            shopItem.textContent = `Multiplier x${multiplierValue} - $${cost}`;
            shopItem.onclick = () => buyMultiplier(multiplierValue, cost);
            shopContainer.appendChild(shopItem);
        }
    }

    function buyMultiplier(multiplierValue, cost) {
        if (money >= cost) {
            money -= cost;
            multipliers.push(multiplierValue);
            moneyDisplay.textContent = `Money: $${money}`;
            renderMultipliers();
        } else {
            alert('Not enough money!');
        }
    }

    function renderMultipliers() {
        multiplierContainer.innerHTML = '';
        multipliers.forEach(mult => {
            const multElement = document.createElement('div');
            multElement.className = 'multcard';
            multElement.textContent = `x${mult}`;
            multElement.style.backgroundColor = '#888';
            multiplierContainer.appendChild(multElement);
        });
    }

    function startGame(newRound = false) {
        currentScore = 0;
        playingField.innerHTML = '';
        generateTargetScore();
        generateInitialHand();
        if (!newRound) {
            money = 0;
            multipliers = [];
            roundNumber = 1;
        }
        renderMultipliers();
        earnMoney(0);
        generateShopItems();
    }

    deckContainer.onclick = drawCard;
    startGame();
};
