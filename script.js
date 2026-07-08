/* script.js */

// CORREÇÃO: Todas as referências ao DOM são capturadas uma única vez no topo.
// Antes, algumas funções chamavam document.getElementById() repetidamente
// dentro de loops ou a cada clique, o que é desnecessário e mais lento.
const terminalHistory  = document.getElementById('terminal-history');
const terminalTyping   = document.getElementById('terminal-typing');
const promptLine       = document.getElementById('terminal-prompt-line');
const bootScreen       = document.getElementById('boot-screen');
const portfolioScreen  = document.getElementById('portfolio-screen');
const agentChat        = document.getElementById('agent-chat');
const agentOptionsArea = document.getElementById('agent-options-area');
// CORREÇÃO: Era "const window = ..." — nome que conflita com o objeto global do navegador!
// Renomeado para agentWindow para evitar o conflito.
const agentWindow      = document.getElementById('ai-agent-window');

const TYPING_SPEED = 40;
let currentLanguage = 'pt';

// --- Sistema de Idioma ---
function changeLanguage(lang) {
    currentLanguage = lang;

    document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    document.querySelectorAll('.lang-text').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });

    // Atualiza/Reseta o Chat do Bot se o idioma mudar
    // CORREÇÃO: usa a constante agentChat ao invés de re-selecionar o elemento
    agentChat.innerHTML = `<div class="bot-msg">${botData[lang].greeting}</div>`;

    if (!agentWindow.classList.contains('hidden-agent')) {
        renderBotOptions();
    } else {
        agentOptionsArea.innerHTML = '';
    }
}

// --- Funções do Terminal Boot ---
function getCurrentDateTime() {
    const now = new Date();
    return now.toString().replace(/\s*\(.*\)/, '');
}

async function runIntro() {
    await typeText(terminalTyping, "ssh portifolio@gustavo");
    appendLineToHistory(
        `<span class="prompt-user">user@linux</span><span class="prompt-separator">:</span><span class="prompt-dir">~$</span> ssh portifolio@gustavo`
    );

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

    // CORREÇÃO: E-mail montado via JavaScript para dificultar coleta por bots de spam.
    // Antes estava exposto como texto puro no HTML/JS.
    const emailUser   = 'ghstavo.henrique';
    const emailDomain = 'hotmail.com';
    const emailHref   = `mailto:${emailUser}@${emailDomain}`;
    const emailText   = `${emailUser}@${emailDomain}`;

    const motd = `
<br>Welcome to Portfolio (GHRA/Linux 5.15.0-XX-generic x86_64)<br><br>
&nbsp;* Documentation:&nbsp;&nbsp;<a href="https://linkedin.com/in/gustavo-ara%C3%BAjo-759592191" style="color:#729FCF; text-decoration:none;">linkedin.com/in/gustavo-araújo-759592191</a><br>
&nbsp;* Management:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="${emailHref}" style="color:#729FCF; text-decoration:none;">${emailText}</a><br><br>
Last login: ${loginTime}
<br><br>`;

    appendLineToHistory(motd);

    await delay(2500);
    transitionToPortfolio();
}

// CORREÇÃO: Torna a função global para ser chamada pelo botão skip e pelo ESC
window.transitionToPortfolio = function() {
    // Para a animação da matrix ao entrar no portfólio,
    // economizando CPU e bateria do usuário.
    if (typeof window.stopMatrixAnimation === 'function') {
        window.stopMatrixAnimation();
    }

    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.classList.add('hidden');
        portfolioScreen.classList.remove('hidden');
        setTimeout(() => {
            portfolioScreen.classList.add('visible');
        }, 50);
    }, 1000);
};

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

// --- Banco de Dados do Agente (Bilíngue) ---
const botData = {
    pt: {
        greeting: "Olá! Sou o assistente de IA do Gustavo. Escolha uma das opções abaixo para saber mais sobre ele:",
        more: "Posso ajudar com algo mais?",
        log_iam:   "[AWS-IAM] Validando permissão de leitura... OK",
        log_trail: "[CloudTrail] Consultando histórico do Gustavo...",
        log_s3:    "[S3] Recuperando informações de projetos...",
        log_lambda: "[Lambda] Executando função de consulta...",
        options: {
            "Quais são seus conhecimentos em Cloud?": "Tenho focado fortemente em AWS Cloud Security. Possuo a certificação AWS Certified Cloud Practitioner e estudo ativamente serviços de proteção e monitoramento, como AWS WAF, Shield e CloudWatch, para construir e proteger ambientes escaláveis.",
            "O que te motiva a estar na área de TI?":  "A inovação contínua e a capacidade de resolver problemas complexos. Comecei no Suporte resolvendo problemas técnicos e me apaixonei por entender como a tecnologia funciona por trás das cortinas.",
            "O que te fez migrar para Segurança?":     "A transição ocorreu porque a Segurança da Informação exige um nível de aprendizado contínuo que bate com o meu perfil. No suporte, eu via os problemas; na segurança, atuo proativamente com Gestão de Acessos e Blue/Red Team para evitar que as vulnerabilidades afetem as operações.",
            "Quais projetos você já desenvolveu?":    "Desenvolvi diversos projetos práticos: um AI Knowledge Agent para centralizar informações do time, um Security Audit Tool para AWS que identifica configurações inseguras em IAM/S3/EC2, automação de dashboards CloudWatch, e este próprio portfólio implementando CSP e proteções XSS. Todos focados em segurança e automação.",
            "Quais certificações você possui?":       "Atualmente sou AWS Certified Cloud Practitioner. Estou me preparando para as próximas: Solutions Architect Associate, Security Specialty, e futuramente DevOps Engineer Professional. O foco é construir uma base sólida em arquitetura e segurança AWS.",
            "Como posso entrar em contato?":          "Você pode me encontrar no LinkedIn (linkedin.com/in/gustavo-araújo-759592191) ou enviar um email para ghstavo.henrique@hotmail.com. Estou sempre aberto a conversas sobre Cloud Security, oportunidades profissionais e troca de conhecimento!",
            "Qual seu diferencial profissional?":     "Meu principal diferencial é a combinação de experiência prática em Segurança da Informação (Red Team, Blue Team, Gestão de Acessos) com conhecimento crescente em Cloud AWS. Além disso, tenho forte capacidade de aprendizado autodidata e gosto de documentar e automatizar processos para aumentar eficiência do time."
        }
    },
    en: {
        greeting: "Hello! I am Gustavo's AI assistant. Choose an option below to learn more about him:",
        more: "Can I help you with anything else?",
        log_iam:   "[AWS-IAM] Validating read permissions... OK",
        log_trail: "[CloudTrail] Querying Gustavo's history...",
        log_s3:    "[S3] Retrieving project information...",
        log_lambda: "[Lambda] Executing query function...",
        options: {
            "What is your knowledge in Cloud?":    "I am heavily focused on AWS Cloud Security. I hold the AWS Certified Cloud Practitioner certification and actively study protection and monitoring services like AWS WAF, Shield, and CloudWatch to build and protect scalable environments.",
            "What motivates you in the IT field?": "Continuous innovation and the ability to solve complex problems. I started in Support fixing technical issues and fell in love with understanding how technology works behind the scenes.",
            "Why did you transition to Security?": "The transition happened because Information Security requires continuous learning, which fits my profile. In support, I saw the problems; in security, I proactively act with Access Management and Blue/Red Teams to prevent vulnerabilities from affecting operations.",
            "What projects have you developed?":   "I've developed several practical projects: an AI Knowledge Agent to centralize team information, an AWS Security Audit Tool that identifies insecure configurations in IAM/S3/EC2, CloudWatch dashboard automation, and this portfolio itself implementing CSP and XSS protections. All focused on security and automation.",
            "What certifications do you have?":    "I'm currently AWS Certified Cloud Practitioner. I'm preparing for the next ones: Solutions Architect Associate, Security Specialty, and eventually DevOps Engineer Professional. The focus is to build a solid foundation in AWS architecture and security.",
            "How can I contact you?":              "You can find me on LinkedIn (linkedin.com/in/gustavo-araújo-759592191) or send an email to ghstavo.henrique@hotmail.com. I'm always open to conversations about Cloud Security, professional opportunities, and knowledge exchange!",
            "What is your professional edge?":     "My main edge is the combination of hands-on experience in Information Security (Red Team, Blue Team, Access Management) with growing knowledge in AWS Cloud. Additionally, I have strong self-learning capabilities and enjoy documenting and automating processes to increase team efficiency."
        }
    }
};

// --- Funções do Agente de IA ---
function toggleAgent() {
    // CORREÇÃO: Usa a constante agentWindow (antes era "const window = ..." — conflito com o global!)
    agentWindow.classList.toggle('hidden-agent');

    if (agentOptionsArea.children.length === 0) {
        agentChat.innerHTML = `<div class="bot-msg">${botData[currentLanguage].greeting}</div>`;
        renderBotOptions();
    }
}

function renderBotOptions() {
    // CORREÇÃO: Usa a constante agentOptionsArea ao invés de re-selecionar o elemento
    agentOptionsArea.innerHTML = '';

    const currentOptions = botData[currentLanguage].options;

    for (const question of Object.keys(currentOptions)) {
        const btn = document.createElement('button');
        btn.className = 'agent-option-btn';
        // CORREÇÃO: textContent ao invés de innerHTML para texto puro — evita risco de XSS
        btn.textContent = question;
        btn.onclick = () => handleOptionClick(question, currentOptions[question]);
        agentOptionsArea.appendChild(btn);
    }
}

async function handleOptionClick(question, answer) {
    agentOptionsArea.style.display = 'none';

    addChatMessage(question, 'user-msg');

    const botDiv = addChatMessage('...', 'bot-msg');
    await delay(400);

    // CORREÇÃO: Os logs do cloud são textos internos controlados (não vêm do usuário),
    // então innerHTML é aceitável aqui. Para mensagens de usuário, sempre use textContent.
    botDiv.innerHTML = `<div class="cloud-log">${botData[currentLanguage].log_iam}</div>`;
    await delay(600);
    botDiv.innerHTML += `<div class="cloud-log">${botData[currentLanguage].log_trail}</div>`;
    await delay(800);

    botDiv.innerHTML = answer;
    scrollToBottomChat();

    await delay(1000);

    addChatMessage(botData[currentLanguage].more, 'bot-msg');

    agentOptionsArea.style.display = 'flex';
    scrollToBottomChat();
}

function addChatMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    // CORREÇÃO: Usa textContent para mensagens de texto puro — previne XSS.
    // Se futuramente quiser HTML formatado nas respostas do bot, use DOMPurify
    // para sanitizar antes de usar innerHTML.
    msgDiv.textContent = text;
    agentChat.appendChild(msgDiv);
    scrollToBottomChat();
    return msgDiv;
}

function scrollToBottomChat() {
    // CORREÇÃO: Usa a constante agentChat ao invés de re-selecionar o elemento
    agentChat.scrollTop = agentChat.scrollHeight;
}

// Listener para pular animação com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !bootScreen.classList.contains('hidden')) {
        window.transitionToPortfolio();
    }
});

// Smooth scroll para navegação
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Inicia a sequência de animação
runIntro();