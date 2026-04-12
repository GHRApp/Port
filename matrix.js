/* matrix.js */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Configura o tamanho do canvas para ocupar a tela inteira inicialmente
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Define os caracteres (apenas 0 e 1, como solicitado)
const characters = "01"; 

// Converte a string em um array de caracteres individuais
const charArray = characters.split('');

const fontSize = 16;
// Calcula quantas colunas de texto cabem na largura da tela
const columns = canvas.width / fontSize; 

// Array para controlar a posição 'y' (vertical) de cada coluna
// Inicializamos todas as colunas no topo (y=1)
const drops = [];
for(let x = 0; x < columns; x++) {
    drops[x] = 1; 
}

// Função principal que desenha a animação frame por frame
function draw() {
    // 1. Desenha um fundo preto semi-transparente sobre o frame anterior.
    // Isso cria o efeito de rastro (fading) dos caracteres.
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Define a cor e fonte dos caracteres
    ctx.fillStyle = "#0F0"; // Verde Matrix clássico
    ctx.font = fontSize + "px arial";

    // 3. Loop para desenhar os caracteres em cada coluna
    for(let i = 0; i < drops.length; i++) {
        // Escolhe um caractere aleatório (0 ou 1)
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Desenha o caractere na posição (x, y) correspondente
        // x = índice da coluna * tamanho da fonte
        // y = posição atual da 'gota' * tamanho da fonte
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 4. Incrementa a posição 'y' para o próximo frame
        // Se a gota passar do final da tela OU aleatoriamente (para variar o tamanho das colunas),
        // reinicia a gota no topo (y=0).
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        // Move a gota uma linha para baixo
        drops[i]++;
    }
}

// Executa a função draw a cada 33 milissegundos (aprox. 30 frames por segundo)
setInterval(draw, 33);

// Garante que o canvas seja redimensionado se a janela do navegador mudar de tamanho
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    // Recalcula o número de colunas necessário
    const newColumns = canvas.width / fontSize;
    // Ajusta o array drops (mantendo os existentes e adicionando novos se necessário)
    if (newColumns > drops.length) {
        for(let x = drops.length; x < newColumns; x++) {
            drops[x] = 1;
        }
    }
});