'use strict';


const io = require('socket.io-client');

const sinkyShip = io.connect('http://localhost:3000/sinky-ship');

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
const numbers = ['1', '2', '3', '4', '5', '6'];

const guessesMade = []; //empty array to push player guesses into

const ship = ['A3', 'B3', 'C3', 'D3'];

let hitCounter = 0;

function generateGuess(lettersArr, numbersArr) {
  const letter = Math.floor(Math.random() * 6);
  const number = Math.floor(Math.random() * 6);

  const guess = lettersArr[letter] + numbersArr[number];
  return guess;
}

function guessMaker() {
  let guess = generateGuess(letters, numbers);
  while (guessesMade.includes(guess)) {
    guess = generateGuess(letters, numbers);
  }
  guessesMade.push(guess);
  return guess;
}

sinkyShip.on('guess', (payload) => {

  if (ship.includes(payload)) {
    hitCounter++;

    if (hitCounter === ship.length) {
      sinkyShip.emit('game-over', 'Sinky Shipped!!!');
      return;
    }

    sinkyShip.emit('answer', 'HIT!!');

  } else { sinkyShip.emit('answer', 'MISS'); }

  setTimeout(() => {
    const guess = guessMaker();
    sinkyShip.emit('guess', guess);
  }, 500);

  console.log(guessesMade);
  console.log(hitCounter);

  sinkyShip.on('game-over', (payload) => {
    if (hitCounter === ship.length) {
      console.log('Loser');
    } else {
      console.log('WINNER!!');
    }
    console.log('exit');
    process.exit(1);
  });
});