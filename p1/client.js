'use strict';

const io = require('socket.io-client');

const sinkyShip = io.connect('http://localhost:3000/sinky-ship');

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
const numbers = ['1', '2', '3', '4', '5', '6'];

const guessesMade = []; //empty array to push player guesses into

const ship = ['F1', 'F2', 'F3', 'F4'];

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
}

function start() {
  const guess = guessMaker();
  sinkyShip.emit('guess', guess);
  console.log('in start:', guess);
}

sinkyShip.on('guess', (payload) => {
  console.log(payload);
  if (ship.includes(payload)) {
    hitCounter++;

    if (hitCounter === ship.length) {
      sinkyShip.emit('game-over', 'Sinky Shipped!!!');
    }

    sinkyShip.emit('answer', 'hit');

  } else { sinkyShip.emit('answer', 'miss'); }

  setTimeout(() => {
    const guess = guessMaker();
    sinkyShip.emit('guess', guess);
  }, 2000);

  console.log(guessesMade);
  console.log(hitCounter);
});

start();

// for (let index = 0; index < 40; index++) {

//   console.log(guessMaker());
// }
