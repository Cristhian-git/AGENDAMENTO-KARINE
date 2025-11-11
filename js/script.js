// Pegamos o formulário e a área onde os agendamentos serão exibidos
const formulario = document.getElementById('form-agendamento');
const listaAgendamentos = document.getElementById('lista-agendamentos');

// Lista de agendamentos (será carregada do localStorage se existir)
let agendamentos = [];

// ====== CARREGAR AGENDAMENTOS SALVOS AO ABRIR A PÁGINA ======
window.addEventListener('load', function() {
    apagarAgendamentosAntigos();
    const agendamentosSalvos = localStorage.getItem('agendamentos');
    if (agendamentosSalvos) {
        agendamentos = JSON.parse(agendamentosSalvos);
        mostrarAgendamentos();
    }
});

// ====== CAPTURAR FORMULÁRIO ======
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Impede recarregar a página

    // Captura dos valores dos campos do formulário
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const data = document.getElementById('data').value.trim();
    const hora = document.getElementById('hora').value.trim();

    // ====== VALIDA SE A DATA INSERIDA JÁ PASSOU ======
    if (!validarDataAgendamento(data)) {
        document.getElementById('data').value = ""; // limpa o campo data
        return; // interrompe o processo de agendamento
    }

    // Normaliza a hora (garante sempre formato HH:MM)
    const horaNormalizada = hora.padStart(5, '0');
    const dataNormalizada = data;

    // ====== VERIFICAÇÃO DE CONFLITO ======
    const existeAgendamento = agendamentos.some((ag) => {
        console.log(`Comparando: ${ag.data} === ${dataNormalizada} e ${ag.hora} === ${horaNormalizada}`);
        return ag.data === dataNormalizada && ag.hora === horaNormalizada;
    });

    if (existeAgendamento) {
        alert("⚠️ Já existe um agendamento para essa data e horário! Escolha outro horário.");
        document.getElementById('hora').value = ""; // limpa campo hora
        return; // interrompe antes de adicionar
    }

    // ====== CRIAR NOVO AGENDAMENTO ======
    const novoAgendamento = { nome, telefone, data: dataNormalizada, hora: horaNormalizada };
    agendamentos.push(novoAgendamento);

    // Atualiza a exibição e salva no navegador
    mostrarAgendamentos();
    salvarAgendamentos();

    // Limpa os campos do formulário
    formulario.reset();

    console.log("Agendamentos atuais:", agendamentos);
});

// ====== EXIBIR AGENDAMENTOS NA TELA ======
function mostrarAgendamentos() {
    listaAgendamentos.innerHTML = '';

    agendamentos.forEach(function(agendamento, indice) {
        const div = document.createElement('div');
        div.classList.add('agendamento');

        div.innerHTML = `
            <strong>${agendamento.nome}</strong><br>
            📞 ${agendamento.telefone}<br>
            📅 ${agendamento.data} às ${agendamento.hora}<br>
            <button class="botao-excluir" onclick="excluirAgendamento(${indice})">Excluir</button>
        `;

        listaAgendamentos.appendChild(div);
    });
}

// ====== EXCLUIR AGENDAMENTO ======
function excluirAgendamento(indice) {
    agendamentos.splice(indice, 1);
    mostrarAgendamentos();
    salvarAgendamentos();
}

// ====== SALVAR AGENDAMENTOS NO NAVEGADOR ======
function salvarAgendamentos() {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// ====== APAGAR AGENDAMENTOS ANTIGOS AUTOMATICAMENTE ======
function apagarAgendamentosAntigos() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let agendamentosSalvos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    const agendamentosAtuais = agendamentosSalvos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.data);
        dataAgendamento.setHours(0, 0, 0, 0);
        return dataAgendamento >= hoje;
    });

    if (agendamentosAtuais.length !== agendamentosSalvos.length) {
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtuais));
        console.log('🧹 Agendamentos antigos foram removidos automaticamente.');
    }
}

// ====== VALIDA SE A DATA INSERIDA É PASSADA ======
function validarDataAgendamento(dataInserida) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataAgendada = new Date(dataInserida);
    dataAgendada.setHours(0, 0, 0, 0);

    if (dataAgendada < hoje) {
        alert('❌ Data inválida! A data inserida já passou.');
        return false;
    }

    return true;
}
