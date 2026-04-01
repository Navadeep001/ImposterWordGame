'use strict';

/* WORD DATABASE */
const WORD_BANK = [
  {
    word: 'School',
    hints: {
      easy: 'A place where children learn and study every day',
      medium: 'Where students and teachers spend their weekdays with bells',
      hard: 'A structured institution with scheduled periods'
    }
  },
  {
    word: 'Hospital',
    hints: {
      easy: 'A place where sick people get treatment',
      medium: 'Doctors and nurses work here',
      hard: 'A medical facility with wards and operating theatres'
    }
  },
  {
    word: 'Beach',
    hints: {
      easy: 'A sandy place near the ocean',
      medium: 'People build sandcastles here',
      hard: 'A coastal strip shaped by tidal action'
    }
  },
  {
    word: 'Airport',
    hints: {
      easy: 'Planes take off here',
      medium: 'Passengers travel with boarding passes',
      hard: 'A commercial aviation terminal hub'
    }
  }
];

/* GAME STATE */
const state = {
  numPlayers: 4,
  difficulty: 'easy',
  chosenEntry: null,
  imposterIndex: -1,
  currentPlayer: 0
};

/* DOM SHORTCUT */
const $ = id => document.getElementById(id);

/* SCREEN REFERENCES */
const screens = {
  setup: $('screen-setup'),
  reveal: $('screen-reveal'),
  final: $('screen-final')
};

/* SETUP ELEMENTS */
const elPlayerCount = $('player-count');
const btnMinus = $('btn-minus');
const btnPlus = $('btn-plus');
const btnStart = $('btn-start');
const diffBtns = document.querySelectorAll('.diff-btn');
const elDiffDesc = $('diff-desc');

/* REVEAL ELEMENTS */
const elProgressDots = $('progress-dots');
const elStepLabel = $('reveal-step-label');
const elFlipCard = $('flip-card');
const elCardBack = $('card-back');
const elFrontName = $('front-player-name');
const elRoleIcon = $('role-icon');
const elRoleBadge = $('role-badge');
const elCardWord = $('card-word');
const elCardHint = $('card-hint-text');
const btnNext = $('btn-next');
const elBtnNextLabel = $('btn-next-label');

/* FINAL ELEMENTS */
const elFinalPlayer = $('final-player-name');
const elFinalMsg = $('final-msg');
const btnPlayAgain = $('btn-play-again');
const btnRevealImposter = $('btn-reveal-imposter');

/* DIFFICULTY TEXT */
const DIFF_DESCS = {
  easy: 'Hints are clear and descriptive',
  medium: 'Hints require some thinking',
  hard: 'Hints are abstract and tricky'
};

/* SCREEN SWITCHER */
function showScreen(name) {

  Object.entries(screens).forEach(([key, el]) => {

    if (key === name) {
      el.classList.add('active');
    }

    else {
      el.classList.remove('active');
    }

  });

}

/* PLAYER COUNT CONTROL */

function updatePlayerDisplay() {

  elPlayerCount.textContent = state.numPlayers;

}

btnMinus.onclick = () => {

  if (state.numPlayers > 2) {

    state.numPlayers--;

    updatePlayerDisplay();

  }

};

btnPlus.onclick = () => {

  if (state.numPlayers < 10) {

    state.numPlayers++;

    updatePlayerDisplay();

  }

};

/* DIFFICULTY SELECT */

diffBtns.forEach(btn => {

  btn.onclick = () => {

    diffBtns.forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    state.difficulty = btn.dataset.diff;

    elDiffDesc.textContent = DIFF_DESCS[state.difficulty];

  };

});

/* START GAME */

btnStart.onclick = startGame;

function startGame() {

  state.chosenEntry =

    WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];

  state.imposterIndex =

    Math.floor(Math.random() * state.numPlayers);

  state.currentPlayer = 0;

  buildRevealScreen();

  showScreen('reveal');

}

/* BUILD PLAYER REVEAL SCREEN */

function buildRevealScreen() {

  const i = state.currentPlayer;

  const n = state.numPlayers;

  const playerNum = i + 1;

  elProgressDots.innerHTML = '';

  for (let d = 0; d < n; d++) {

    const dot = document.createElement('div');

    dot.className = 'pip' +

      (d < i ? ' done' : d === i ? ' active' : '');

    elProgressDots.appendChild(dot);

  }

  elStepLabel.textContent =

    `Player ${playerNum} of ${n}`;

  elFlipCard.classList.remove('flipped');

  elCardBack.className = 'flip-back';

  elFrontName.textContent =

    `Player ${playerNum}`;

  const isImposter =

    i === state.imposterIndex;

  const word = state.chosenEntry.word;

  const hint =

    state.chosenEntry.hints[state.difficulty];

  if (isImposter) {

    elRoleIcon.textContent = '🕵️';

    elRoleBadge.textContent = 'Imposter';

    elRoleBadge.className =

      'role-badge imposter';

    elCardHint.textContent = hint;

    elCardHint.style.display = 'block';

    elCardWord.style.display = 'none';

  }

  else {

    elRoleIcon.textContent = '✅';

    elRoleBadge.textContent =

      'Normal Player';

    elRoleBadge.className =

      'role-badge normal';

    elCardWord.textContent = word;

    elCardWord.style.display = 'block';

    elCardHint.style.display = 'none';

  }

  btnNext.style.display = 'none';

  elFlipCard.onclick = handleCardTap;

}

/* CARD TAP */

function handleCardTap() {

  if (elFlipCard.classList.contains('flipped'))

    return;

  elFlipCard.classList.add('flipped');

  const isLast =

    state.currentPlayer ===

    state.numPlayers - 1;

  setTimeout(() => {

    elBtnNextLabel.textContent =

      isLast ?

        'START DISCUSSION'

        :

        'NEXT PLAYER';

    btnNext.style.display = 'flex';

  }, 600);

}

/* NEXT BUTTON */

btnNext.onclick = () => {

  const isLast =

    state.currentPlayer ===

    state.numPlayers - 1;

  if (isLast)

    showFinalScreen();

  else {

    state.currentPlayer++;

    buildRevealScreen();

  }

};

/* FINAL SCREEN */

function showFinalScreen() {

  const randomPlayer =

    Math.floor(Math.random()

      * state.numPlayers) + 1;

  elFinalPlayer.textContent =

    `Player ${randomPlayer}`;

  elFinalMsg.textContent =

    'Someone here is lying. Discuss!';

  btnRevealImposter.style.display = 'block';

  showScreen('final');

}

/* REVEAL IMPOSTER BUTTON */

btnRevealImposter.onclick = () => {

  const imposter =

    state.imposterIndex + 1;

  const word =

    state.chosenEntry.word;

  elFinalMsg.textContent =

    `Player ${imposter} was the IMPOSTER.\nThe word was "${word}"`;

  btnRevealImposter.style.display = 'none';

};

/* PLAY AGAIN BUTTON */

btnPlayAgain.onclick = () => {

  showScreen('setup');

};

/* INIT */

updatePlayerDisplay();

elDiffDesc.textContent =

  DIFF_DESCS[state.difficulty];

showScreen('setup');