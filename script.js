// Seleciona os elementos do DOM usados no jogo
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const start = document.querySelector('.start');
const gameOver = document.querySelector('.game-over');
const scoreValue = document.getElementById('scoreValue');

// Variáveis de controle
let score = 0;
let isJumping = false;
let loopInterval;
let hasScored = false;

// Áudios
const audioStart = new Audio('./song/audio_theme.mp3');
const audioGameOver = new Audio('./song/audio_gameover.mp3');

// Inicia o jogo
const startGame = () => {
  // Ativa a animação do cano
  pipe.classList.add('pipe-animation');
  start.style.display = 'none';

  // Reinicia som e pontuação
  audioStart.currentTime = 0;
  audioStart.play();

  score = 0;
  scoreValue.innerText = score;

  clearInterval(loopInterval);
  loop();
};

// Reinicia o jogo após game over
const restartGame = () => {
  score = 0;
  scoreValue.innerText = score;

  start.style.display = 'none';
  gameOver.style.display = 'none';

  mario.src = './img/mario.gif';
  mario.style.width = '150px';
  mario.style.bottom = '0';
  mario.style.marginLeft = '0';
  mario.classList.remove('jump');

  pipe.classList.remove('pipe-animation');
  void pipe.offsetWidth; // força reflow
  pipe.classList.add('pipe-animation');
  pipe.style.left = '';
  pipe.style.right = '0';

  audioGameOver.pause();
  audioGameOver.currentTime = 0;

  audioStart.currentTime = 0;
  audioStart.play();

  clearInterval(loopInterval);
  hasScored = false;

  loop();
};

// Faz o Mario pular
const jump = () => {
  if (isJumping) return;

  isJumping = true;
  mario.classList.add('jump');

  setTimeout(() => {
    mario.classList.remove('jump');
    isJumping = false;
  }, 800);
};

// Loop principal de colisão e pontuação
const loop = () => {
  loopInterval = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseFloat(getComputedStyle(mario).bottom);

    // COLISÃO: se o cano estiver perto e o Mario baixo, GAME OVER
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 90) {
      pipe.classList.remove('pipe-animation');
      pipe.style.left = `${pipePosition}px`;

      mario.src = './img/game-over.png';
      mario.style.width = '80px';
      mario.style.marginLeft = '50px';

      audioStart.pause();
      audioGameOver.play();

      gameOver.style.display = 'flex';

      clearInterval(loopInterval);
      hasScored = false;
      return;
    }

    // PONTUAÇÃO: se o cano passou e o Mario não bateu
    if (pipePosition < 0 && !hasScored) {
      score++;
      scoreValue.innerText = score;
      hasScored = true;
    }

    // Quando o cano reseta do lado direito (recomeça ciclo)
    if (pipePosition > 800) {
      hasScored = false;
    }
  }, 10);
};

// Inicia o loop ao carregar a página
loop();

// Evento de teclado
document.addEventListener('keypress', e => {
  const tecla = e.key;
  if (tecla === ' ') {
    jump();
  } else if (tecla === 'Enter') {
    startGame();
  }
});

// Evento de toque para mobile
document.addEventListener('touchstart', e => {
  if (e.touches.length) {
    jump();
  }
});
