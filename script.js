document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const formScreen = document.getElementById("form-screen");
    const resultScreen = document.getElementById("result-screen");
    const steps = Array.from(document.querySelectorAll(".step"));
    const progressBar = document.getElementById("progress");
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");
    const btnSubmit = document.getElementById("btn-submit");
    
    let currentStep = 1;
    let bancoProdutosGlobal = [];
    let metaAgua = 2000;
    let aguaConsumida = 0;

    btnNext.addEventListener("click", () => { if (validarEtapa()) { currentStep++; updateProgress(); } });
    btnPrev.addEventListener("click", () => { currentStep--; updateProgress(); });
    document.getElementById("btn-start").addEventListener("click", () => { welcomeScreen.classList.add("hidden"); formScreen.classList.remove("hidden"); });

    function updateProgress() {
        steps.forEach((s, idx) => s.classList.toggle("active", idx === (currentStep - 1)));
        progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
        btnPrev.classList.toggle("hidden", currentStep === 1);
        if (currentStep === steps.length) {
            btnNext.classList.add("hidden"); btnSubmit.classList.remove("hidden");
        } else {
            btnNext.classList.remove("hidden"); btnSubmit.classList.add("hidden");
        }
    }

    function validarEtapa() {
        if (currentStep === 1) {
            const n = document.getElementById("user-name").value.trim();
            const a = document.getElementById("user-age").value;
            const w = document.getElementById("user-weight").value;
            if(!n || !a || !w) { alert("Preencha todos os campos da etapa atual 🌸"); return false; }
        }
        if (currentStep === 2 && !document.getElementById("skin-type").value) {
            alert("Selecione seu tipo de pele 🔬"); return false;
        }
        return true;
    }

    document.querySelectorAll(".option-card").forEach(card => {
        card.addEventListener("click", function() {
            this.parentElement.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
            this.classList.add("selected");
            document.getElementById(this.getAttribute("data-target")).value = this.getAttribute("data-value");
        });
    });

    document.getElementById("skincare-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const dados = {
            name: document.getElementById("user-name").value,
            weight: parseInt(document.getElementById("user-weight").value),
            skinType: document.getElementById("skin-type").value,
            goal: document.getElementById("main-goal").value,
            sensitive: document.getElementById("skin-sensitive").value,
            makeup: document.getElementById("user-makeup").value,
            time: document.getElementById("routine-time").value
        };
        
        metaAgua = dados.weight * 35;
        document.getElementById("water-target").innerText = `${metaAgua}ml`;
        aguaConsumida = 0;
        atualizarPainelAgua();
        montarResultados(dados);
        formScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
    });

    document.getElementById("btn-add-water").addEventListener("click", () => { aguaConsumida += 250; atualizarPainelAgua(); });
    document.getElementById("btn-reset-water").addEventListener("click", () => { aguaConsumida = 0; atualizarPainelAgua(); });

    function atualizarPainelAgua() {
        document.getElementById("water-current").innerText = aguaConsumida;
        let pct = (aguaConsumida / metaAgua) * 100;
        if(pct > 100) pct = 100;
        document.getElementById("water-bar").style.width = `${pct}%`;
    }

    // NOVA FUNÇÃO: Adicionar Produtos do Próprio Usuário dinamicamente na lista
    document.getElementById("btn-add-my-product").addEventListener("click", () => {
        const inputName = document.getElementById("my-prod-name");
        const selectCat = document.getElementById("my-prod-cat");
        const listContainer = document.getElementById("my-products-list");

        if(!inputName.value.trim()) {
            alert("Por favor, digite o nome do seu produto! 💄");
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
            <div><strong>[${selectCat.value}]</strong> ${inputName.value}</div>
            <button class="remove-prod-btn" type="button">✖</button>
        `;

        // Evento para remover o produto se clicar no X
        li.querySelector(".remove-prod-btn").addEventListener("click", function() {
            li.remove();
        });

        listContainer.appendChild(li);
        inputName.value = ""; // Limpa o campo
    });

    function montarResultados(dados) {
        document.getElementById("user-diagnostic-title").innerText = `Espaço de ${dados.name}`;
        document.getElementById("skin-status-badge").innerText = `Pele ${dados.skinType.toUpperCase()}`;

        let sabonete = dados.skinType === "oleosa" || dados.skinType === "mista" ? "Gel de Limpeza Normaderm/Actine" : "Creme de Limpeza CeraVe";
        let hidratante = dados.skinType === "oleosa" || dados.skinType === "mista" ? "Hidratante Hydro Boost FPS/Matte" : "Creme Fisiológico Concentrado";
        let ativo = dados.goal === "acne" ? "Sérum de Ácido Salicílico" : dados.goal === "manchas" ? "Sérum de Vitamina C Pura" : "Sérum de Ácido Hialurônico";

        // Timelines
        document.getElementById("morning-timeline").innerHTML = `
            <div class="timeline-item"><h4>Passo 1: Higienizar</h4><p>Lavar com <strong>${sabonete}</strong>.</p></div>
            <div class="timeline-item"><h4>Passo 2: Nutrir</h4><p>Passar o <strong>${hidratante}</strong>.</p></div>
            <div class="timeline-item"><h4>Passo 3: Proteger</h4><p>Protetor solar fluido FPS 50.</p></div>
        `;

        document.getElementById("night-timeline").innerHTML = `
            ${dados.makeup === "sim" ? '<div class="timeline-item"><h4>Passo 0: Demaquilar</h4><p>Usar micelar ou óleo.</p></div>' : ''}
            <div class="timeline-item"><h4>Passo 1: Limpar</h4><p>Lavar com <strong>${sabonete}</strong>.</p></div>
            <div class="timeline-item"><h4>Passo 2: Tratar</h4><p>Aplicar 3 gotas de <strong>${ativo}</strong>.</p></div>
            <div class="timeline-item"><h4>Passo 3: Blindar</h4><p>Selar com o <strong>${hidratante}</strong>.</p></div>
        `;

        // Lógica de Manuais Escritos
        const instrBox = document.getElementById("application-instructions");
        let txtLimpeza = "", txtHidratacao = "", txtTratamento = "";

        if (dados.skinType === "oleosa" || dados.skinType === "mista") {
            txtLimpeza = "Lave o rosto utilizando <strong>água fria a morna</strong> (nunca quente para evitar o efeito rebote). Massageie o gel de limpeza em movimentos circulares por 60 segundos, focando na Zona T.";
            txtHidratacao = "Aplique uma quantidade equivalente a uma ervilha do hidratante em gel. Espalhe de dentro para fora com batidinhas suaves.";
        } else {
            txtLimpeza = "Lave o rosto suavemente usando as pontas dos dedos e <strong>água fria</strong>. Não esfregue excessivamente com toalhas.";
            txtHidratacao = "Aqueça o creme nas mãos e pressione suavemente sobre as áreas secas da pele.";
        }

        if (dados.goal === "acne") {
            txtTratamento = "À noite, aplique o Sérum de Ácido Salicílico <strong>apenas nas áreas com espinhas e cravos</strong>. Espere 3 minutos antes do próximo passo.";
        } else if (dados.goal === "manchas") {
            txtTratamento = "Espalhe 3 gotas uniformemente. Faça movimentos ascendentes para estimular a circulação e o clareamento uniformizado.";
        } else {
            txtTratamento = "Aplique o sérum de hialurônico com a <strong>pele levemente úmida</strong> para máxima retenção de água.";
        }

        instrBox.innerHTML = `
            <p class="instruction-step-desc">🧼 <strong>Como Limpar:</strong> ${txtLimpeza}</p>
            <p class="instruction-step-desc">🎯 <strong>Como Tratar:</strong> ${txtTratamento}</p>
            <p class="instruction-step-desc">🧴 <strong>Como Hidratar:</strong> ${txtHidratacao}</p>
        `;

        // NOVA FUNÇÃO: Geração dos Links e Cards de Vídeos baseados nas necessidades do usuário
        const videoContainer = document.getElementById("video-links-container");
        let termoVideoPele = dados.skinType === "oleosa" ? "pele+oleosa" : "pele+seca";
        let termoVideoFoco = dados.goal === "acne" ? "combater+acne" : "clarear+manchas";

        videoContainer.innerHTML = `
            <a class="video-card" href="https://www.youtube.com/results?search_query=rotina+skincare+passo+a+passo+${termoVideoPele}" target="_blank">
                <span>Passo a Passo</span>
                <h4>Como Fazer Skincare Perfeito para Pele ${dados.skinType.toUpperCase()} ↗</h4>
            </a>
            <a class="video-card" href="https://www.youtube.com/results?search_query=como+aplicar+serum+${termoVideoFoco}" target="_blank">
                <span>Dermatologia</span>
                <h4>Forma Correta de Aplicar Ativos e Tratar ${dados.goal.toUpperCase()} ↗</h4>
            </a>
        `;

        // Cronograma Semanal
        const weeklySchedule = document.getElementById("weekly-schedule");
        weeklySchedule.innerHTML = `
            <div class="weekly-day"><strong>Terça-Feira</strong><p>🌟 Aplicação de Máscara Cuidada</p></div>
            <div class="weekly-day"><strong>Quinta-Feira</strong><p>🧼 Renovação Celular com Esfoliante</p></div>
            <div class="weekly-day"><strong>Outros Dias</strong><p>Rotina Básica de Proteção</p></div>
        `;

        // Recomendações de Compras
        bancoProdutosGlobal = [
            { tipo: "econ", cat: "Sabonete", nome: "Needs Controle de Oleosidade", preco: "R$ 24,00", link: "https://www.amazon.com.br/s?k=needs+controle+oleosidade" },
            { tipo: "prem", cat: "Sabonete", nome: "La Roche-Posay Effaclar Gel", preco: "R$ 79,00", link: "https://www.amazon.com.br/s?k=effaclar+gel+sabonete" },
            { tipo: "econ", cat: "Hidratante", nome: "Nivea Creme Gel Facial", preco: "R$ 29,00", link: "https://www.amazon.com.br/s?k=nivea+creme+gel+facial" },
            { tipo: "prem", cat: "Hidratante", nome: "Neutrogena Hydro Boost Water Gel", preco: "R$ 68,00", link: "https://www.amazon.com.br/s?k=neutrogena+hydro+boost" },
            { tipo: "econ", cat: "Protetor", nome: "Anasol Facial FPS 50", preco: "R$ 38,00", link: "https://www.amazon.com.br/s?k=anasol+facial+fps+50" },
            { tipo: "prem", cat: "Protetor", nome: "Isdin Fusion Water FPS 60", preco: "R$ 94,00", link: "https://www.amazon.com.br/s?k=isdin+fusion+water" }
        ];
        renderProdutos("all");

        const listTools = document.getElementById("list-tools");
        listTools.innerHTML = "<li>✨ Toalha facial de microfibra</li><li>✨ Discos reutilizáveis</li>";
    }

    function renderProdutos(filtro) {
        const lista = document.getElementById("list-actives");
        lista.innerHTML = "";
        const filtrados = bancoProdutosGlobal.filter(p => filtro === "all" || p.tipo === filtro);
        filtrados.forEach(p => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span style="font-size:0.75rem; color:var(--accent); font-weight:700;">${p.cat}</span>
                <h5 style="font-size:1rem; margin:2px 0;">${p.nome}</h5>
                <p style="font-size:0.85rem; color:var(--primary-dark); font-weight:600;">Est.: ${p.preco}</p>
                <a href="${p.link}" target="_blank" style="font-size:0.8rem; color:var(--accent); text-decoration:underline; font-weight:bold;">Checar Preço ↗</a>
            `;
            lista.appendChild(li);
        });
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            this.parentElement.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderProdutos(this.getAttribute("data-budget"));
        });
    });

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            document.getElementById(this.getAttribute("data-tab")).classList.add("active");
        });
    });

    const timerClock = document.getElementById("timer-clock");
    const btnTimer = document.getElementById("btn-timer");
    let timerInterval = null;
    btnTimer.addEventListener("click", () => {
        if(timerInterval) { clearInterval(timerInterval); timerInterval = null; timerClock.innerText = "01:00"; btnTimer.innerText = "Iniciar 60s"; return; }
        let t = 60; btnTimer.innerText = "Parar";
        timerInterval = setInterval(() => {
            t--; timerClock.innerText = `00:${t < 10 ? '0'+t : t}`;
            if(t <= 0) { clearInterval(timerInterval); timerInterval = null; timerClock.innerText = "Pronto! ✨"; btnTimer.innerText = "Reiniciar"; }
        }, 1000);
    });

    document.getElementById("btn-restart").addEventListener("click", () => {
        currentStep = 1;
        document.getElementById("skincare-form").reset();
        document.getElementById("my-products-list").innerHTML = ""; // Reseta os produtos inseridos
        document.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
        resultScreen.classList.add("hidden");
        welcomeScreen.classList.remove("hidden");
    });
});