
let coinBalance = 100; // saldo de moedas - inicial
let multiplier = 1; 

document.getElementById('play-button').addEventListener('click', play);


function updateMultiplier() {
  const multiplierSelect = document.getElementById('multiplier');
  multiplier = parseInt(multiplierSelect.value);
  generateDiceImages(); // adicionar isso na página -  multiplicar / lógica
}

function generateDiceImages() {
  const diceContainer = document.getElementById('dice-container');
  diceContainer.innerHTML = ''; // limpa os dados atuais
  const numberOfDice = multiplier + 1; // num de dados aumenta conforme o multiplicador escolhido - add multiplicador

  for (let i = 0; i < numberOfDice; i++) {
    const img = document.createElement('img');
    img.src = 'img/dice-01.svg'; // imagem dado incial
    img.alt = `Dado ${i + 1}`;
    img.id = `dado-${i + 1}`;
    img.style.width = '150px'; // largura do dado
    diceContainer.appendChild(img);
  }
}

generateDiceImages();

function getRandomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}

function play() {
  // obter o valor da aposta e jogar 
  const betAmount = parseInt(document.getElementById('bet-amount').value);
  if (isNaN(betAmount) || betAmount < 1) {
    alert('Por favor, insira uma quantidade válida de moedas para apostar.');
    return;
  }

  if (betAmount > coinBalance) {
    alert('Você não tem moedas suficientes para essa aposta.');
    return;
  }

  // geração dos valores dos dados.
  const diceValues = [];
  const numberOfDice = multiplier + 1;

  for (let i = 0; i < numberOfDice; i++) {
    const value = getRandomDiceValue();
    diceValues.push(value);
    // atualiza a imagem do dado 
    const diceImage = document.getElementById(`dado-${i + 1}`);
    diceImage.src = `img/dice-0${value}.svg`;
  }

  // calcular a soma dos dados
  const sum = diceValues.reduce((a, b) => a + b, 0);

  // exibir a soma em texto ---- arrumar outra forma de fazer isso pq ta feio
  const sumElement = document.getElementById('dice-sum');
  sumElement.innerText = `Soma dos Dados: ${sum}`;

  // tentiva do usuario
  const guess = parseInt(document.getElementById('guess').value);

  // validacao da entrada da tentativa
  if (isNaN(guess)) {
    alert('Por favor, insira um valor para a sua adivinhação.');
    return;
  }

  // atualiza o saldo (perde a aposta)
  coinBalance -= betAmount;

  // verificacao de acerto de guess
  let resultText;
  if (guess === sum) {
    const winnings = betAmount * (multiplier + 1); // calcular a recompensa
    coinBalance += winnings; // saldo + recompensa
    resultText = `Parabéns! Você acertou a soma ${sum} e ganhou ${winnings} moedas!`;
  } else {
    resultText = `Você errou! A soma foi ${sum}. Você perdeu ${betAmount} moedas.`;
  }

  // atualiza o saldo na interface
  document.getElementById('coin-balance').innerText = coinBalance;

  // Exibir o resuktado 
  document.getElementById('result').innerText = resultText;

  // Verifica se o user ficou sem moedas
  if (coinBalance <= 0) {
    alert('Você ficou sem moedas! O jogo será reiniciado.');
    coinBalance = 100; // Reinicia o saldo de moedas
    document.getElementById('coin-balance').innerText = coinBalance;
  }
}
