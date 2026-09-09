// Caça-Cores - lógica do jogo
// Jogo de memória: o computador acende uma sequência de cores
// e o jogador precisa repeti-la na mesma ordem.

// Constantes
const TOTAL_CORES = 4;
const RODADA_FINAL = 10;   // completar esta rodada vence a partida
const VIDAS_INICIAIS = 3;
const CHAVE_HISTORICO = "cacaCores.historico";
const CHAVE_RECORDE = "cacaCores.recorde";

// Estado da partida
let sequencia = [];        // sequência gerada pelo computador
let posicaoJogador = 0;    // índice que o jogador deve acertar agora
let rodada = 0;
let pontos = 0;
let vidas = VIDAS_INICIAIS;
let emPartida = false;     // partida iniciada e ainda não encerrada
let aceitandoCliques = false;

// Elementos do DOM
const elRodada = document.getElementById("rodada");
const elPontos = document.getElementById("pontos");
const elRecorde = document.getElementById("recorde");
const elVidas = document.getElementById("vidas");
const elMensagem = document.getElementById("mensagem");
const elDificuldade = document.getElementById("dificuldade");
const elListaHistorico = document.getElementById("listaHistorico");
const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnLimpar = document.getElementById("btnLimpar");
const botoesCor = document.querySelectorAll(".cor");

// Funções de apoio

// Exibe uma mensagem para o jogador, com destaque opcional.
function mostrarMensagem(texto, tipo) {
    elMensagem.textContent = texto;
    elMensagem.className = "mensagem";
    if (tipo) {
        elMensagem.classList.add(tipo);
    }
}

// Atualiza os números do placar na tela.
function atualizarPlacar() {
    elRodada.textContent = rodada;
    elPontos.textContent = pontos;
    elVidas.textContent = vidas;
}

// Habilita ou desabilita os botões coloridos.
function liberarCores(liberar) {
    aceitandoCliques = liberar;
    botoesCor.forEach(function (botao) {
        botao.disabled = !liberar;
    });
}

// Tempo de exibição de cada cor, conforme a dificuldade escolhida.
function velocidade() {
    return Number(elDificuldade.value);
}

// Acende uma cor por um curto período.
function acenderCor(indice) {
    const botao = document.getElementById("cor-" + indice);
    botao.classList.add("aceso");
    setTimeout(function () {
        botao.classList.remove("aceso");
    }, velocidade() * 0.6);
}

// Fluxo da partida

// Sorteia uma nova cor, avança a rodada e reproduz a sequência.
function proximaRodada() {
    sequencia.push(Math.floor(Math.random() * TOTAL_CORES));
    posicaoJogador = 0;
    rodada = rodada + 1;
    atualizarPlacar();
    mostrarMensagem("Rodada " + rodada + ": observe a sequência...");
    reproduzirSequencia();
}

// Mostra a sequência atual, uma cor por vez.
function reproduzirSequencia() {
    liberarCores(false);
    let i = 0;
    const intervalo = setInterval(function () {
        acenderCor(sequencia[i]);
        i = i + 1;
        if (i >= sequencia.length) {
            clearInterval(intervalo);
            setTimeout(function () {
                liberarCores(true);
                mostrarMensagem("Sua vez! Repita a sequência de " + sequencia.length + " cor(es).");
            }, velocidade());
        }
    }, velocidade());
}

// Trata o clique do jogador em uma das cores.
function jogar(indice) {
    if (!aceitandoCliques) {
        return;
    }

    acenderCor(indice);

    if (indice === sequencia[posicaoJogador]) {
        // Acertou a cor da vez.
        posicaoJogador = posicaoJogador + 1;
        pontos = pontos + 10;
        atualizarPlacar();

        if (posicaoJogador === sequencia.length) {
            // Completou a sequência da rodada.
            liberarCores(false);
            if (rodada >= RODADA_FINAL) {
                encerrarPartida(true);
            } else {
                pontos = pontos + rodada * 5;   // bônus por rodada concluída
                atualizarPlacar();
                mostrarMensagem("Sequência correta! Prepare-se para a próxima rodada.", "acerto");
                setTimeout(proximaRodada, 1200);
            }
        }
    } else {
        // Errou a cor da vez.
        errar();
    }
}

// Desconta uma vida e decide se a partida continua.
function errar() {
    liberarCores(false);
    vidas = vidas - 1;
    atualizarPlacar();

    if (vidas <= 0) {
        encerrarPartida(false);
    } else {
        mostrarMensagem("Cor errada! Você perdeu uma vida. Restam " + vidas + ".", "erro");
        posicaoJogador = 0;
        setTimeout(function () {
            mostrarMensagem("Atenção: a sequência será repetida.");
            setTimeout(reproduzirSequencia, 800);
        }, 1200);
    }
}

// Finaliza a partida por vitória ou derrota.
function encerrarPartida(venceu) {
    emPartida = false;
    liberarCores(false);
    btnIniciar.disabled = false;

    if (venceu) {
        pontos = pontos + vidas * 50;   // bônus pelas vidas restantes
        atualizarPlacar();
        mostrarMensagem("Parabéns! Você venceu com " + pontos + " pontos!", "vitoria");
    } else {
        mostrarMensagem("Fim de jogo! Você chegou à rodada " + rodada + " com " + pontos + " pontos.", "erro");
    }

    salvarRecorde();
    registrarHistorico(venceu);
}

// Prepara todos os valores para uma nova partida.
function iniciarPartida() {
    sequencia = [];
    posicaoJogador = 0;
    rodada = 0;
    pontos = 0;
    vidas = VIDAS_INICIAIS;
    emPartida = true;
    btnIniciar.disabled = true;
    atualizarPlacar();
    mostrarMensagem("Partida iniciada. Preste atenção!");
    setTimeout(proximaRodada, 900);
}

// Interrompe a partida atual e volta ao estado inicial.
function reiniciarJogo() {
    if (emPartida) {
        registrarHistorico(false, true);
    }
    sequencia = [];
    posicaoJogador = 0;
    rodada = 0;
    pontos = 0;
    vidas = VIDAS_INICIAIS;
    emPartida = false;
    liberarCores(false);
    btnIniciar.disabled = false;
    atualizarPlacar();
    mostrarMensagem("Jogo reiniciado. Pressione Iniciar para jogar novamente.");
}

// Recorde e histórico (armazenados no navegador)

function carregarRecorde() {
    const salvo = localStorage.getItem(CHAVE_RECORDE);
    elRecorde.textContent = salvo === null ? 0 : salvo;
}

function salvarRecorde() {
    const atual = Number(localStorage.getItem(CHAVE_RECORDE) || 0);
    if (pontos > atual) {
        localStorage.setItem(CHAVE_RECORDE, pontos);
        elRecorde.textContent = pontos;
    }
}

function lerHistorico() {
    const dados = localStorage.getItem(CHAVE_HISTORICO);
    return dados === null ? [] : JSON.parse(dados);
}

// Guarda o resultado da partida encerrada.
function registrarHistorico(venceu, abandonada) {
    const lista = lerHistorico();
    lista.unshift({
        data: new Date().toLocaleString("pt-BR"),
        rodada: rodada,
        pontos: pontos,
        venceu: venceu === true,
        abandonada: abandonada === true
    });
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(lista.slice(0, 10)));
    exibirHistorico();
}

// Redesenha a lista de partidas anteriores.
function exibirHistorico() {
    const lista = lerHistorico();
    elListaHistorico.innerHTML = "";

    if (lista.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "vazio";
        vazio.textContent = "Nenhuma partida registrada.";
        elListaHistorico.appendChild(vazio);
        return;
    }

    lista.forEach(function (partida) {
        const item = document.createElement("li");
        let situacao;

        if (partida.abandonada) {
            situacao = "Abandonada";
            item.className = "perdeu";
        } else if (partida.venceu) {
            situacao = "Vitória";
            item.className = "venceu";
        } else {
            situacao = "Derrota";
            item.className = "perdeu";
        }

        item.textContent = situacao + " - rodada " + partida.rodada +
            " - " + partida.pontos + " pts (" + partida.data + ")";
        elListaHistorico.appendChild(item);
    });
}

function limparHistorico() {
    localStorage.removeItem(CHAVE_HISTORICO);
    exibirHistorico();
    mostrarMensagem("Histórico apagado.");
}

// Eventos
botoesCor.forEach(function (botao) {
    botao.addEventListener("click", function () {
        jogar(Number(botao.dataset.cor));
    });
});

btnIniciar.addEventListener("click", iniciarPartida);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnLimpar.addEventListener("click", limparHistorico);

// Atalho de teclado: teclas 1 a 4 acionam as cores.
document.addEventListener("keydown", function (evento) {
    const tecla = Number(evento.key);
    if (tecla >= 1 && tecla <= TOTAL_CORES) {
        jogar(tecla - 1);
    }
});

// Inicialização
carregarRecorde();
exibirHistorico();
atualizarPlacar();
