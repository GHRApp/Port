/* script.js */
const terminalHistory = document.getElementById('terminal-history');
const terminalTyping = document.getElementById('terminal-typing');
const promptLine = document.getElementById('terminal-prompt-line');
const bootScreen = document.getElementById('boot-screen');
const portfolioScreen = document.getElementById('portfolio-screen');

const TYPING_SPEED = 40;

function getCurrentDateTime() {
    const now = new Date();
    return now.toString().replace(/\s*\(.*\)/, ''); 
}

async function runIntro() {
    await typeText(terminalTyping, "ssh portifolio@gustavo");
    appendLineToHistory(`<span class="prompt-user">user@linux</span><span class="prompt-separator">:</span><span class="prompt-dir">~$</span> ssh portifolio@gustavo`);
    
    terminalTyping.innerHTML = "";
    promptLine.style.display = 'none'; 
    
    await delay(300);
    
    const passwordLine = document.createElement('div');
    passwordLine.innerHTML = `portifolio@gustavo's password: <span class="cursor">_</span>`;
    terminalHistory.appendChild(passwordLine);
    
    await delay(1200); 
    passwordLine.querySelector('.cursor').remove();
    
    appendLineToHistory(`...`);
    await delay(600);
    
    const loginTime = getCurrentDateTime();
    const motd = `
<br>Welcome to Portfolio (GHRA/Linux 5.15.0-XX-generic x86_64)<br><br>
&nbsp;* Documentation:&nbsp;&nbsp;<a href="https://linkedin.com/in/gustavo-araújo-759592191" style="color:#729FCF; text-decoration:none;">linkedin.com/in/gustavo-araújo-759592191</a><br>
&nbsp;* Management:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="mailto:ghstavo.henrique@hotmail.com" style="color:#729FCF; text-decoration:none;">ghstavo.henrique@hotmail.com</a><br><br>
Last login: ${loginTime}
<br><br>`;
    
    appendLineToHistory(motd);
    
    await delay(2500); 
    
    transitionToPortfolio();
}

function transitionToPortfolio() {
    bootScreen.style.opacity = '0';
    
    setTimeout(() => {
        bootScreen.classList.add('hidden');
        portfolioScreen.classList.remove('hidden');
        
        setTimeout(() => {
            portfolioScreen.classList.add('visible');
        }, 50);
        
    }, 1000); 
}

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

// --- Banco de Dados do Agente ---
const botData = {
    "Quais são seus conhecimentos em Cloud?": "Tenho focado fortemente em AWS Cloud Security. Possuo a certificação AWS Certified Cloud Practitioner e estudo ativamente serviços de proteção e monitoramento, como AWS WAF, Shield e CloudWatch, para construir e proteger ambientes escaláveis.",
    "O que te motiva a estar na área de TI?": "A inovação contínua e a capacidade de resolver problemas complexos. Comecei no Suporte resolvendo problemas técnicos e me apaixonei por entender como a tecnologia funciona por trás das cortinas. Evoluir a cada commit e usar a IA para ir mais longe é o que me move diariamente.",
    "O que te fez migrar para Segurança?": "A transição ocorreu porque a Segurança da Informação exige um nível de aprendizado contínuo que bate com o meu perfil. No suporte, eu via os problemas; na segurança, atuo proativamente com Gestão de Acessos e Blue/Red Team para evitar que as vulnerabilidades afetem as operações."
};

// --- Funções do Agente de IA ---
function toggleAgent() {
    const window = document.getElementById('ai-agent-window');
    window.classList.toggle('hidden-agent');
    
    const optionsArea = document.getElementById('agent-options-area');
    if (optionsArea.children.length === 0) {
        renderBotOptions();
    }
}

function renderBotOptions() {
    const optionsArea = document.getElementById('agent-options-area');
    optionsArea.innerHTML = ''; 
    
    for (const question of Object.keys(botData)) {
        const btn = document.createElement('button');
        btn.className = 'agent-option-btn';
        btn.textContent = question;
        btn.onclick = () => handleOptionClick(question);
        optionsArea.appendChild(btn);
    }
}

async function handleOptionClick(question) {
    const optionsArea = document.getElementById('agent-options-area');
    
    optionsArea.style.display = 'none'; 

    addChatMessage(question, 'user-msg');

    const botDiv = addChatMessage('...', 'bot-msg');
    await delay(400);
    botDiv.innerHTML = `<div class="cloud-log">[AWS-IAM] Validando permissão de leitura... OK</div>`;
    await delay(600);
    botDiv.innerHTML += `<div class="cloud-log">[CloudTrail] Consultando histórico do Gustavo...</div>`;
    await delay(800);

    botDiv.innerHTML = botData[question];
    scrollToBottomChat();

    await delay(1000); 
    
    addChatMessage("Ajudo com algo mais?", 'bot-msg');
    
    optionsArea.style.display = 'flex'; 
    scrollToBottomChat();
}

function addChatMessage(text, className) {
    const chat = document.getElementById('agent-chat');
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerHTML = text;
    chat.appendChild(msgDiv);
    scrollToBottomChat();
    return msgDiv;
}

function scrollToBottomChat() {
    const chat = document.getElementById('agent-chat');
    chat.scrollTop = chat.scrollHeight;
}

// Inicia a sequência de animação
runIntro();