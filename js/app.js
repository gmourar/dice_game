// Variáveis Globais
let coinBalance = 100; // Saldo inicial de moedas
let multiplier = 1; // Multiplicador inicial (2 dados)

function updateMultiplier() {
  const multiplierSelect = document.getElementById('multiplier');
  multiplier = parseInt(multiplierSelect.value);
  generateDiceImages();
}

function generateDiceImages() {
  const diceContainer = document.getElementById('dice-container');
  diceContainer.innerHTML = ''; // Limpa os dados atuais
  const numberOfDice = multiplier + 1; // Número de dados aumenta com o multiplicador

  for (let i = 0; i < numberOfDice; i++) {
    const img = document.createElement('img');
    img.src = 'img/dice-01.svg'; // Imagem inicial do dado
    img.alt = `Dado ${i + 1}`;
    img.id = `dado-${i + 1}`;
    img.style.width = '250px';
    diceContainer.appendChild(img);
  }
}

// Inicializa os dados na primeira carga
generateDiceImages();

function getRandomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}

function play() {
  // Obtém o valor da aposta e valida
  const betAmount = parseInt(document.getElementById('bet-amount').value);
  if (isNaN(betAmount) || betAmount < 1) {
    alert('Por favor, insira uma quantidade válida de moedas para apostar.');
    return;
  }

  if (betAmount > coinBalance) {
    alert('Você não tem moedas suficientes para essa aposta.');
    return;
  }

  // Gera os valores dos dados
  const diceValues = [];
  const numberOfDice = multiplier + 1;

  for (let i = 0; i < numberOfDice; i++) {
    const value = getRandomDiceValue();
    diceValues.push(value);
    // Atualiza a imagem do dado
    const diceImage = document.getElementById(`dado-${i + 1}`);
    diceImage.src = `img/dice-0${value}.svg`;
  }

  // Calcula a soma dos dados
  const sum = diceValues.reduce((a, b) => a + b, 0);

  // Exibe a soma abaixo dos dados
  const sumElement = document.getElementById('dice-sum');
  sumElement.innerText = `Soma dos Dados: ${sum}`;

  // Obtém a adivinhação do jogador
  const guess = parseInt(document.getElementById('guess').value);

  // Verifica se a adivinhação é válida
  if (isNaN(guess)) {
    alert('Por favor, insira um valor para a sua adivinhação.');
    return;
  }

  // Atualiza o saldo de moedas (perde a aposta)
  coinBalance -= betAmount;

  // Verifica se o jogador acertou
  let resultText;
  if (guess === sum) {
    const winnings = betAmount * (multiplier + 1); // Calcula a recompensa
    coinBalance += winnings; // Atualiza o saldo com a recompensa
    resultText = `Parabéns! Você acertou a soma ${sum} e ganhou ${winnings} moedas!`;
  } else {
    resultText = `Você errou! A soma foi ${sum}. Você perdeu ${betAmount} moedas.`;
  }

  // Atualiza o saldo de moedas na interface
  document.getElementById('coin-balance').innerText = coinBalance;

  // Exibe o resultado
  document.getElementById('result').innerText = resultText;

  // Verifica se o jogador ficou sem moedas
  if (coinBalance <= 0) {
    alert('Você ficou sem moedas! O jogo será reiniciado.');
    coinBalance = 100; // Reinicia o saldo de moedas
    document.getElementById('coin-balance').innerText = coinBalance;
  }
}

