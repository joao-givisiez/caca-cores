const TOTAL_CORES = 4;
const RODADA_FINAL = 10;
const VIDAS_INICIAIS = 3;
const CHAVE_HISTORICO = "cacaCores.historico";
const CHAVE_RECORDE = "cacaCores.recorde";

let sequencia = [];
let posicaoJogador = 0;
let rodada = 0;
let pontos = 0;
let vidas = VIDAS_INICIAIS;
let emPartida = false;
let aceitandoCliques = false;

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

function mostrarMensagem(texto, tipo) {
    elMensagem.textContent = texto;
    elMensagem.className = "mensagem";
    if (tipo) {
        elMensagem.classList.add(tipo);
    }
}

function atualizarPlacar() {
    elRodada.textContent = rodada;
    elPontos.textContent = pontos;
    elVidas.textContent = vidas;
}

function liberarCores(liberar) {
    aceitandoCliques = liberar;
    botoesCor.forEach(function (botao) {
        botao.disabled = !liberar;
    });
}

function velocidade() {
    return Number(elDificuldade.value);
}

function acenderCor(indice) {
    const botao = document.getElementById("cor-" + indice);
    botao.classList.add("aceso");
    setTimeout(function () {
        botao.classList.remove("aceso");
    }, velocidade() * 0.6);
}

function proximaRodada() {
    sequencia.push(Math.floor(Math.random() * TOTAL_CORES));
    posicaoJogador = 0;
    rodada = rodada + 1;
    atualizarPlacar();
    mostrarMensagem("Rodada " + rodada + ": observe a sequência...");
    reproduzirSequencia();
}

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

function jogar(indice) {
    if (!aceitandoCliques) {
        return;
    }

    acenderCor(indice);

    if (indice === sequencia[posicaoJogador]) {
        posicaoJogador = posicaoJogador + 1;
        pontos = pontos + 10;
        atualizarPlacar();

        if (posicaoJogador === sequencia.length) {
            liberarCores(false);
            if (rodada >= RODADA_FINAL) {
                encerrarPartida(true);
            } else {
                pontos = pontos + rodada * 5;
                atualizarPlacar();
                mostrarMensagem("Sequência correta! Prepare-se para a próxima rodada.", "acerto");
                setTimeout(proximaRodada, 1200);
            }
        }
    } else {
        errar();
    }
}

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

function encerrarPartida(venceu) {
    emPartida = false;
    liberarCores(false);
    btnIniciar.disabled = false;

    if (venceu) {
        pontos = pontos + vidas * 50;
        atualizarPlacar();
        mostrarMensagem("Parabéns! Você venceu com " + pontos + " pontos!", "vitoria");
    } else {
        mostrarMensagem("Fim de jogo! Você chegou à rodada " + rodada + " com " + pontos + " pontos.", "erro");
    }

    salvarRecorde();
    registrarHistorico(venceu);
}

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

botoesCor.forEach(function (botao) {
    botao.addEventListener("click", function () {
        jogar(Number(botao.dataset.cor));
    });
});

btnIniciar.addEventListener("click", iniciarPartida);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnLimpar.addEventListener("click", limparHistorico);

document.addEventListener("keydown", function (evento) {
    const tecla = Number(evento.key);
    if (tecla >= 1 && tecla <= TOTAL_CORES) {
        jogar(tecla - 1);
    }
});

carregarRecorde();
exibirHistorico();
atualizarPlacar();
