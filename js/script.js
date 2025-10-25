// script.js

// Pegamos o formulário e a área onde os agendamentos serão exibidos
const formulario = document.getElementById('form-agendamento');
const listaAgendamentos = document.getElementById('lista-agendamentos');

// Lista de agendamentos (será carregada do localStorage se existir)
let agendamentos = [];

// ====== CARREGAR AGENDAMENTOS SALVOS AO ABRIR A PÁGINA ======
window.addEventListener('load', function() {
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
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    // Cria um objeto com os dados do cliente
    const novoAgendamento = {
        nome: nome,
        telefone: telefone,
        data: data,
        hora: hora
    };

    // Adiciona o objeto dentro da lista de agendamentos
    agendamentos.push(novoAgendamento);

    // Atualiza a exibição e salva no navegador
    mostrarAgendamentos();
    salvarAgendamentos();

    // Limpa os campos do formulário
    formulario.reset();
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
    salvarAgendamentos(); // Atualiza o localStorage também
}

// ====== SALVAR AGENDAMENTOS NO NAVEGADOR ======
function salvarAgendamentos() {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}
