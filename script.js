/* script.js */
const terminalHistory = document.getElementById('terminal-history');
const terminalTyping = document.getElementById('terminal-typing');
const promptLine = document.getElementById('terminal-prompt-line');
const bootScreen = document.getElementById('boot-screen');
const portfolioScreen = document.getElementById('portfolio-screen');

const TYPING_SPEED = 40;

// Pega a data e hora atual do sistema no formato Linux
function getCurrentDateTime() {
    const now = new Date();
    // Gera um formato parecido com: "Sat Apr 11 23:29:05 -03 2026"
    return now.toString().replace(/\s*\(.*\)/, ''); 
}

async function runIntro() {
    // 1. Comando SSH
    await typeText(terminalTyping, "ssh portifolio@gustavo");
    appendLineToHistory(`<span class="prompt-user">user@linux</span><span class="prompt-separator">:</span><span class="prompt-dir">~$</span> ssh portifolio@gustavo`);
    
    // Limpa a linha atual e esconde para simular pedido de senha
    terminalTyping.innerHTML = "";
    promptLine.style.display = 'none'; 
    
    await delay(300);
    
    // 2. Pedido de senha
    const passwordLine = document.createElement('div');
    passwordLine.innerHTML = `portifolio@gustavo's password: <span class="cursor">_</span>`;
    terminalHistory.appendChild(passwordLine);
    
    // Finge que está esperando a digitação da senha
    await delay(1200); 
    passwordLine.querySelector('.cursor').remove();
    
    // 3. Processando login (...)
    appendLineToHistory(`...`);
    await delay(600);
    
    // 4. Exibe a mensagem de boas vindas (MOTD)
    const loginTime = getCurrentDateTime();
    const motd = `
<br>Welcome to Portfolio (GHRA/Linux 5.15.0-XX-generic x86_64)<br><br>
&nbsp;* Documentation:&nbsp;&nbsp;<a href="https://linkedin.com/in/gustavo-araújo-759592191" style="color:#729FCF; text-decoration:none;">linkedin.com/in/gustavo-araújo-759592191</a><br>
&nbsp;* Management:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="mailto:ghstavo.henrique@hotmail.com" style="color:#729FCF; text-decoration:none;">ghstavo.henrique@hotmail.com</a><br><br>
Last login: ${loginTime}
<br><br>`;
    
    appendLineToHistory(motd);
    
    // Deixa a tela visível tempo suficiente para a pessoa ler
    await delay(2500); 
    
    // 5. Inicia a transição para a tela final
    transitionToPortfolio();
}

function transitionToPortfolio() {
    // Aplica opacidade 0 no terminal (fade out)
    bootScreen.style.opacity = '0';
    
    // Aguarda o fade out terminar (1 segundo definido no CSS)
    setTimeout(() => {
        // Esconde o terminal completamente
        bootScreen.classList.add('hidden');
        
        // Remove o display:none da tela do portfólio
        portfolioScreen.classList.remove('hidden');
        
        // Um pequeno delay para o navegador registrar a mudança antes do fade in
        setTimeout(() => {
            portfolioScreen.classList.add('visible');
        }, 50);
        
    }, 1000); 
}

// Funções Auxiliares
function typeText(element, text) {
    return new Promise((resolve) => {
        let currentText = '';
        let index = 0;
        const intervalId = setInterval(() => {
            currentText += text[index];
            element.textContent = currentText;
            index++;
            if (index === text.length) {
                clearInterval(intervalId);
                resolve();
            }
        }, TYPING_SPEED);
    });
}

function appendLineToHistory(htmlContent) {
    const line = document.createElement('div');
    line.innerHTML = htmlContent;
    line.style.marginBottom = "3px";
    terminalHistory.appendChild(line);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicia a sequência de animação
runIntro();