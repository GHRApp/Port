/* script.js */
const terminalHistory = document.getElementById('terminal-history');
const terminalTyping = document.getElementById('terminal-typing');

// Conteúdo fictício das seções. SUBSTITUA PELOS SEUS DADOS:
const portfolioData = {
    'Dados_do_Usuario': '[Nome: Gustavo Henrique], [Cargo: Desenvolvedor], [Local: Hortolândia - SP]',
    'Formacao': '[Análise e Desenvolvimento de Sistemas (FATEC) - 2020-2023]',
    'Experiencias_Profissionais': '[Dev Jr. @ Tech Solutions (2023-Atual)], [Estagiário Backend @ StartUp XYZ (2022-2023)]',
    'Competencias': '[JS, React, Node.js], [Linux, Docker, Python], [SQL, NoSQL]'
};

// Configurações da simulação
const TYPING_SPEED = 70; // Velocidade da digitação em ms
let animationComplete = false;

// Fase 1: Simulação automática
async function runAutoSimulation() {
    // 1. Simula digitação de SSH
    await typeText("ssh gustavo@henrique");
    appendLineToHistory(`gustavo@debian:~$ ssh gustavo@henrique`);
    terminalTyping.innerHTML = ""; // Limpa a linha de digitação

    // Delay de conexão (0.5s)
    await delay(500);

    // 2. Atualiza o prompt para o novo host
    appendLineToHistory(`gustavo@henrique:~$ `);

    // 3. Simula digitação de LS
    await typeText("ls");
    appendLineToHistory(`gustavo@henrique:~$ ls`);
    terminalTyping.innerHTML = ""; // Limpa a linha de digitação

    // 4. Exibe as pastas (ls output)
    appendDirectoriesToHistory();

    // 5. Finaliza a fase automática
    animationComplete = true;
    appendLineToHistory(`<span class="prompt-user">gustavo@henrique</span><span class="prompt-separator">:</span><span class="prompt-dir">~$</span> <span class="cursor">_</span>`);
    
    // Mostra o prompt final interativo
    document.getElementById('terminal-prompt-line').style.display = 'none';
}

// Fase 2: Interação do Usuário (Monitora o ENTER)
window.addEventListener('keydown', (event) => {
    // Se a animação acabou e a pessoa apertou Enter
    if (animationComplete && event.key === 'Enter') {
        runEnterAction();
    }
});

function runEnterAction() {
    // Remove o prompt provisório da animação
    terminalHistory.lastElementChild.remove();
    
    // Simula a saída do comando LS
    let outputHtml = '';
    for (const [section, content] of Object.entries(portfolioData)) {
        outputHtml += `<div class="directory">${section}:</div> ${content}\n`;
    }
    appendLineToHistory(outputHtml);
    
    // Mostra o prompt final interativo
    appendLineToHistory(`<span class="prompt-user">gustavo@henrique</span><span class="prompt-separator">:</span><span class="prompt-dir">~$</span> `);
    
    // Impede o Enter de ser processado novamente
    animationComplete = false;
}


// --- Funções Auxiliares (Não altere abaixo) ---

// Digita texto caractere por caractere
function typeText(text) {
    return new Promise((resolve) => {
        let currentText = '';
        let index = 0;
        const intervalId = setInterval(() => {
            currentText += text[index];
            terminalTyping.textContent = currentText;
            index++;
            if (index === text.length) {
                clearInterval(intervalId);
                resolve();
            }
        }, TYPING_SPEED);
    });
}

// Adiciona uma linha ao histórico
function appendLineToHistory(htmlContent) {
    const line = document.createElement('div');
    line.innerHTML = htmlContent;
    terminalHistory.appendChild(line);
}

// Formata e adiciona os diretórios (ls)
function appendDirectoriesToHistory() {
    let dirHtml = '';
    for (const sectionName of Object.keys(portfolioData)) {
        dirHtml += `<span class="directory">${sectionName}</span>`;
    }
    appendLineToHistory(dirHtml);
}

// Cria um delay (pausa)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicia a animação quando a página carregar
runAutoSimulation();