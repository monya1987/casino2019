import Reel from './Reel.js';
import Symbol from './Symbol.js';

export default class Slot {
  constructor(domElement, config = {}) {
    Symbol.preload();

    this.currentSymbols = [
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
    ];

    this.nextSymbols = [
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
    ]

    this.counter = 0;
    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName('reel')).map((reelContainer, idx) => new Reel(reelContainer, idx, this.currentSymbols[idx]));

    this.spinButton = document.getElementById('spin');
    this.errAlert = document.getElementById('errAlert');
    this.succAlert = document.getElementById('succAlert');
    this.spinButton.addEventListener('click', () => this.spin());


    if (config.inverted) {
      this.container.classList.add('inverted');
    } 
  }

  spin() {
    this.onSpinStart();

    this.currentSymbols = this.nextSymbols;

    if (this.counter > 1) {
      this.nextSymbols = [
        [Symbol.random(), 'slot1', Symbol.random()],
        [Symbol.random(), 'slot1', Symbol.random()],
        [Symbol.random(), 'slot1', Symbol.random()],
        [Symbol.random(), 'slot1', Symbol.random()],
        [Symbol.random(), 'slot1', Symbol.random()],
      ];
    } else {
      this.nextSymbols = [
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
      ];
    }


    return Promise.all(this.reels.map(reel => {
      reel.renderSymbols(this.currentSymbols[reel.idx], this.nextSymbols[reel.idx]);
      return reel.spin();
    })).then(() => this.onSpinEnd());
  }

  onSpinStart() {
    document.getElementById('shadow').style.display = 'none';
    this.spinButton.disabled = true;

    console.log('SPIN START');
  }

  onSpinEnd() {
    this.spinButton.disabled = false;
    this.counter++;
    if (this.counter > 2) {
      this.succAlert.style.display = 'block';
    } else {
      this.errAlert.style.display = 'block';
    }
    console.log('SPIN END');
  }
}
