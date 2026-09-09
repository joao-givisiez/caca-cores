# Caça-Cores

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/HTML5-E34F26.svg" alt="HTML5"></a>
  <a href="#"><img src="https://img.shields.io/badge/CSS3-1572B6.svg" alt="CSS3"></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg" alt="JavaScript"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licença-MIT-green.svg" alt="MIT"></a>
</p>

Jogo web desenvolvido para a **Atividade Prática 1** da disciplina **GAC116 - Programação Web** da Universidade Federal de Lavras (UFLA).

## Índice

* [Objetivo do Jogo](#objetivo-do-jogo)
* [Jogar Online](#jogar-online)
* [Regras do Jogo](#regras-do-jogo)
* [Pontuação](#pontuação)
* [Instruções de Instalação](#instruções-de-instalação)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Estrutura do Projeto](#estrutura-do-projeto)
* [Informações do Trabalho](#informações-do-trabalho)
* [Licença](#licença)

## Objetivo do Jogo

**Caça-Cores** é um jogo de memória visual. O computador acende uma sequência de cores e o jogador precisa repetir essa sequência clicando nos botões na mesma ordem. A cada rodada concluída, a sequência ganha uma cor a mais, exigindo cada vez mais atenção e memória.

O objetivo é **completar a rodada 10** sem perder as três vidas disponíveis, acumulando a maior pontuação possível.

## Jogar Online

O jogo está publicado no GitHub Pages e pode ser jogado diretamente no navegador:

**https://joao-givisiez.github.io/caca-cores/**

> O link fica ativo após o repositório ser publicado no GitHub Pages.

## Regras do Jogo

1. Clique no botão **Iniciar** para começar a partida.
2. Observe atentamente a sequência de cores acesa pelo jogo.
3. Repita a sequência clicando nos botões coloridos **na mesma ordem** (ou usando as teclas `1`, `2`, `3` e `4`).
4. A cada sequência repetida corretamente, o jogo avança de rodada e acrescenta **uma nova cor** ao final da sequência.
5. Cada cor errada custa **uma vida**. O jogador começa com **3 vidas** e, ao errar, a mesma sequência é reapresentada para nova tentativa.
6. A partida termina em **derrota** quando as três vidas acabam.
7. A partida termina em **vitória** quando o jogador completa a **rodada 10**.
8. O botão **Reiniciar** interrompe a partida atual a qualquer momento e devolve o jogo ao estado inicial.
9. A velocidade de exibição das cores pode ser ajustada no seletor de **dificuldade** (Fácil, Médio ou Difícil).

## Pontuação

| Situação | Pontos |
| --- | --- |
| Cada cor acertada | +10 |
| Bônus por rodada concluída | +5 × número da rodada |
| Bônus de vitória | +50 por vida restante |

O **recorde** e o **histórico das 10 últimas partidas** ficam salvos no navegador (`localStorage`), permanecendo disponíveis mesmo após fechar a página.

## Instruções de Instalação

O jogo não possui dependências e não exige instalação. Há duas formas de executá-lo localmente:

**1. Abrir diretamente o arquivo**

```bash
git clone https://github.com/joao-givisiez/caca-cores.git
cd caca-cores
```

Em seguida, abra o arquivo `code/index.html` com um navegador de sua preferência.

**2. Iniciar um servidor web local**

```bash
cd caca-cores/code
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador.

## Tecnologias Utilizadas

* **HTML5** — estruturação semântica da página (`header`, `main`, `section`, `article`, `footer`).
* **CSS3** — estilização, layout com *Flexbox* e *Grid*, transições, animações e responsividade.
* **JavaScript (puro)** — manipulação do DOM, tratamento de eventos, controle do estado da partida, temporizadores (`setTimeout` / `setInterval`) e persistência de dados com `localStorage`.

Nenhuma biblioteca ou framework externo foi utilizado.

## Estrutura do Projeto

```
caca-cores/
├── code/
│   ├── index.html      # estrutura da página e do tabuleiro
│   ├── styles.css      # estilos visuais e responsividade
│   └── script.js       # lógica do jogo, estado, placar e histórico
├── index.html          # redirecionamento para code/index.html (GitHub Pages)
├── LICENSE             # licença MIT
└── README.md           # este arquivo
```

## Informações do Trabalho

```json
{
    "nome": "Caça-Cores",
    "descricao": "Jogo de memória em que o jogador deve repetir sequências de cores cada vez maiores. Possui 3 vidas, 10 rodadas, níveis de dificuldade, pontuação com bônus, recorde e histórico de partidas salvos no navegador.",
    "autores": "João Lessa",
    "turma": "14A"
}
```

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
