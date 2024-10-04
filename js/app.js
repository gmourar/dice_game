document.addEventListener('DOMContentLoaded', function () {
  function calculateProbability(numberOfDice, userGuess) {
      const totalCombinations = Math.pow(6, numberOfDice);
      const possibleSums = {};

      // Contar as combinações possíveis para cada soma
      function countSums(diceLeft, currentSum) {
          if (diceLeft === 0) {
              possibleSums[currentSum] = (possibleSums[currentSum] || 0) + 1;
              return;
          }
          for (let i = 1; i <= 6; i++) {
              countSums(diceLeft - 1, currentSum + i);
          }
      }

      countSums(numberOfDice, 0);

      const guessCombinations = possibleSums[userGuess] || 0; // Combinações que resultam no palpite do usuário
      return (guessCombinations / totalCombinations) * 100; // Probabilidade em porcentagem
  }

  function updateProbability() {
      const numberOfDice = parseInt(document.getElementById('dice-count').value);
      const userGuess = parseInt(document.getElementById('guess').value);
      const probability = calculateProbability(numberOfDice, userGuess);
      const probabilityElement = document.getElementById('probability');
      probabilityElement.innerText = `Probabilidade APROXIMADA de acertar: ${probability.toFixed(4)}%`;

      const betAmountInput = document.getElementById('bet-amount');
      betAmountInput.min = numberOfDice;
      if (parseInt(betAmountInput.value) < numberOfDice) {
          betAmountInput.value = numberOfDice;
      }

      updateRoulette(numberOfDice); // Atualiza a roleta sempre que a probabilidade é atualizada
  }

  function updateRoulette(numberOfDice, winningSum = null) {
    const roulette = document.getElementById('roulette');
    roulette.innerHTML = ''; // Limpa a roleta existente

    const totalSquares = numberOfDice * 6; // Total de quadrados na roleta

    for (let i = 1; i <= totalSquares; i++) {
        const square = document.createElement('div');
        square.classList.add('roulette-square');
        square.innerText = i; // Adiciona o número do quadrado

        // Adiciona a classe 'winning' se for a soma correta
        if (winningSum !== null && i === winningSum) {
            square.classList.add('winning');
        }

        roulette.appendChild(square);
    }
}

  document.getElementById('dice-count').addEventListener('change', updateProbability);
  document.getElementById('guess').addEventListener('input', updateProbability);
  updateProbability();

  let coinBalance = 100;

  document.getElementById('play-button').addEventListener('click', play);

  function generateDiceImages(numberOfDice) {
      const diceContainer = document.getElementById('dice-container');
      diceContainer.innerHTML = '';

      for (let i = 0; i < numberOfDice; i++) {
          const img = document.createElement('img');
          img.src = 'img/dice-01.svg'; // imagem padrão para o dado
          img.alt = `Dado ${i + 1}`;
          img.id = `dado-${i + 1}`;
          img.style.width = '150px';
          diceContainer.appendChild(img);
      }
  }

  function getRandomDiceValue() {
      return Math.floor(Math.random() * 6) + 1;
  }

  function play() {
    const numberOfDice = parseInt(document.getElementById('dice-count').value);
    const betAmount = parseInt(document.getElementById('bet-amount').value);

    // Validar a aposta
    if (isNaN(betAmount) || betAmount < numberOfDice) {
        alert(`A aposta mínima é ${numberOfDice} moedas.`);
        return;
    }

    if (betAmount > coinBalance) {
        alert('Você não tem moedas suficientes para essa aposta.');
        return;
    }

    const diceValues = [];
    for (let i = 0; i < numberOfDice; i++) {
        const value = getRandomDiceValue();
        diceValues.push(value);
        const diceImage = document.getElementById(`dado-${i + 1}`);
        diceImage.src = `img/dice-0${value}.svg`;
    }

    const sum = diceValues.reduce((a, b) => a + b, 0);
    const sumElement = document.getElementById('dice-sum');
    sumElement.innerText = `Soma dos Dados: ${sum}`;

    const guess = parseInt(document.getElementById('guess').value);
    if (isNaN(guess)) {
        alert('Por favor, insira um valor para a sua adivinhação.');
        return;
    }

    // Validar a soma máxima
    const maxSum = numberOfDice * 6;
    if (guess < numberOfDice || guess > maxSum) {
        alert(`Sua adivinhação deve ser entre ${numberOfDice} e ${maxSum}.`);
        return;
    }

    coinBalance -= betAmount;

    // Definindo a mensagem de resultado e a classe para o número correto
    if (guess === sum) {
        const winnings = betAmount * numberOfDice;
        coinBalance += winnings;
        resultText = `Você acertou a soma: <span class="correct-guess">${sum}</span>!`;
    } else {
        resultText = `Você errou! A soma foi ${sum}. Você perdeu ${betAmount} moedas.`;
    }

    document.getElementById('coin-balance').innerText = `Saldo: ${coinBalance} moedas`;
    document.getElementById('result').innerHTML = resultText; // Alterado para innerHTML para permitir a tag span

    // Atualizar a roleta para incluir a soma correta
    updateRoulette(numberOfDice, sum); // Passando a soma correta

    if (coinBalance <= 0) {
        alert('Você ficou sem moedas! O jogo será reiniciado.');
        coinBalance = 100;
        document.getElementById('coin-balance').innerText = `Saldo: ${coinBalance} moedas`;
    }
}

  generateDiceImages(2); // Inicializa com 2 dados
});
