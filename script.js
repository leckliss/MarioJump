const musicAudio = new Audio('./assets/sounds/music.mp3');
const jumpAudio = new Audio('./assets/sounds/jump.mp3');
const deathAudio = new Audio('./assets/sounds/death.mp3');

const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const startText = document.getElementById('start-text');
const marioScore = document.querySelector('.mario-score');
const timeScore = document.querySelector('.time-score');
const gameOvertText = document.getElementById('game-over-text');

let gameStarted = false;
let distance = 0;
let time = 0;
let scoreInterval; // Variável para armazenar o intervalo de atualização do placar

// Constantes para o cálculo da distância
const tempoMedio = 25 * 60; // Tempo médio de 25 minutos convertido para segundos
const distancia5Km = 5 * 1000; // Distância de 5 km convertida para metros

// Função para iniciar o jogo
const startGame = () => {
    if (!gameStarted) {
        gameStarted = true;
        musicAudio.play();
        startText.style.display = 'none'; // Oculta o texto "Pressione para iniciar"
        document.addEventListener("keydown", jump);
        mario.src = "./assets/run.gif"; // Muda a imagem do Mario para a animação de corrida
        mario.classList.remove('mario-stopped', 'mario-hidden'); // Remove classes para parar e ocultar o Mario
        // Remove a classe para pausar as animações do pipe e das nuvens
        pipe.classList.remove('animation-paused');
        clouds.classList.remove('animation-paused');
        // Inicia o placar de tempo e distância
        startScoreCounter();
    }
}

// Adiciona o evento de clique em qualquer tecla para iniciar o jogo
document.addEventListener("keydown", startGame);

// Função para o salto do Mario
const jump = () => {
    if (!gameStarted) return; // Retorna se o jogo não foi iniciado ainda

    jumpAudio.play();
    mario.style.marginLeft = 20;
    mario.classList.add('jump');
    mario.src = "./assets/jump.png";

    setTimeout(() => {
        mario.style.marginLeft = 0;
        mario.classList.remove('jump');
        mario.src = "./assets/run.gif";
    }, 500);
}

// Função para atualizar o placar de tempo e distância
const startScoreCounter = () => {
    scoreInterval = setInterval(() => {
        if (gameStarted) {
            time += 1; // Aumenta o tempo de jogo
            distance = Math.floor((time / tempoMedio) * distancia5Km * 0.5); // Calcula a distância percorrida
            updateScore(); // Atualiza os placares de tempo e distância
        }
    }, 1000); // Atualiza a cada segundo
}

// Função para atualizar os placares de tempo e distância
const updateScore = () => {
    marioScore.textContent = distance.toString().padStart(5, '0'); // Atualiza o placar de distância
    timeScore.textContent = time.toString().padStart(5, '0'); // Atualiza o placar de tempo
}

// Função para reiniciar o jogo
const restartGame = () => {
    // Reinicia as variáveis do jogo
    gameStarted = false;
    distance = 0;
    time = 0;
    marioScore.textContent = '00000';
    timeScore.textContent = '00000';
    startText.style.display = 'block'; // Exibe o texto "Pressione para iniciar"
    gameOvertText.style.display = 'none'; // Oculta o texto "GAME OVER"
    mario.src = "./assets/initial.png"; // Retorna a imagem do Mario para a inicial
    mario.classList.add('mario-stopped', 'mario-hidden'); // Adiciona classes para parar e ocultar o Mario
    // Adiciona a classe para pausar as animações do pipe e das nuvens
    pipe.classList.add('animation-paused');
    clouds.classList.add('animation-paused');
    // Reinicia a animação do cano
    pipe.style.left = '100%'; // Move o cano para a direita da tela
    clearInterval(pipeAnimationInterval); // Limpa o intervalo de animação do cano
}

// Função para pausar o jogo e exibir o texto de game over
const gameOver = () => {
    gameStarted = false;
    clearInterval(scoreInterval); // Pausa o placar
    startText.style.display = 'block'; // Exibe o texto "Pressione para iniciar"
    gameOvertText.style.display = 'block'; // Exibe o texto "GAME OVER"
    // Adiciona um evento de clique para reiniciar o jogo
    startText.addEventListener('click', restartGame);
}

// Loop principal do jogo
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (!gameStarted) return; // Retorna se o jogo não foi iniciado ainda

    musicAudio.play();

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;
        musicAudio.pause();
        deathAudio.play();
        mario.src = "./assets/death.png";
        mario.classList.add('jump-death');
        gameOver(); // Chama a função de game over
        setTimeout(() => {
            mario.src = "./assets/death.png";
            mario.style.animation = 'none';
            mario.style.left = `${marioPosition}px`;
            document.removeEventListener('keydown', jump);
        }, 1000);

        clearInterval(loop);
    }
}, 10);

// Inicia a animação do cano após um pequeno intervalo para evitar sobreposição com o Mario
setTimeout(() => {
    pipeAnimationInterval = setInterval(() => {
        pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    }, 2000); // Reinicia a animação a cada 2 segundos
}, 1000); // Inicia após 1 segundo para dar tempo para a tela de carregamento aparecer
