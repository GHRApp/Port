/* matrix.js */

// CORREÇÃO: Guardamos a referência ao canvas e contexto uma única vez no topo
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Configura o tamanho do canvas para ocupar a tela inteira inicialmente
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// ACESSIBILIDADE: canvas decorativo não precisa ser lido por leitores de tela
canvas.setAttribute('aria-hidden', 'true');

// Define os caracteres (apenas 0 e 1)
const characters = "01";
const charArray = characters.split('');

const fontSize = 16;

// CORREÇÃO: Usa Math.floor para garantir número inteiro de colunas
let columns = Math.floor(canvas.width / fontSize);

// Array para controlar a posição 'y' (vertical) de cada coluna
const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// CORREÇÃO: Usamos requestAnimationFrame no lugar de setInterval.
// Vantagens:
//   1. Pausa automaticamente quando a aba está em segundo plano (economiza CPU/bateria)
//   2. Sincroniza com a taxa de atualização do monitor (mais suave)
//   3. Permite cancelar com cancelAnimationFrame()
let animationId = null;
let lastTime = 0;
const FRAME_INTERVAL = 33; // ~30 fps

function draw(timestamp) {
    // Só desenha se o intervalo de tempo desejado tiver passado
    if (timestamp - lastTime >= FRAME_INTERVAL) {
        lastTime = timestamp;

        // 1. Fundo preto semi-transparente para o efeito de rastro (fading)
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Define cor e fonte dos caracteres
        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px arial";

        // 3. Desenha um caractere em cada coluna
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reinicia a gota aleatoriamente ao passar do final da tela
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Continua o loop de animação
    animationId = requestAnimationFrame(draw);
}

// Inicia a animação e guarda o ID para poder cancelar depois
animationId = requestAnimationFrame(draw);

// CORREÇÃO: Exporta a função de parada para ser chamada em script.js
// durante a transição para o portfólio, evitando consumo desnecessário de CPU
window.stopMatrixAnimation = function () {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
};

// CORREÇÃO: Resize agora ajusta o array drops nos dois sentidos
// (adiciona se a tela cresceu, remove se encolheu)
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const newColumns = Math.floor(canvas.width / fontSize);

    // Remove colunas extras se a janela encolheu
    drops.length = newColumns;

    // Adiciona novas colunas se a janela cresceu
    for (let x = columns; x < newColumns; x++) {
        drops[x] = 1;
    }

    columns = newColumns;
});