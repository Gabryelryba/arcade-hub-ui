// Textos em português do Brasil. Mesmas chaves de en.js; o que faltar aqui
// aparece em inglês.
export default {
  meta: {
    description: "Jogos em tempo real para jogar com os amigos no navegador. Sem cadastro: escolha um nome, mande o código da sala e jogue.",
  },

  common: {
    cancel: "Cancelar",
    connecting: "Conectando ao servidor…",
    waking: "Acordando o servidor. O plano gratuito dorme quando fica parado; isso pode levar até um minuto…",
    reconnecting: "Reconectando…",
    createRoom: "Criar Sala",
    joinWithCode: "Entrar com Código",
    joinRoom: "Entrar",
    roomCode: "Código da sala",
    roomCodeAria: "Código da sala {code}",
    roomCodeHelp: "O código de 5 caracteres na tela de quem criou a sala.",
    roomCodeLength: "O código da sala tem 5 caracteres.",
    joiningRoom: "Entrando na sala {code}…",
    copyInvite: "Copiar Link de Convite",
    linkCopied: "Link Copiado",
    playAgain: "Jogar de Novo",
    you: "Você",
    left: "saiu",
    someone: "Alguém",
  },

  app: {
    loadError: "Não foi possível carregar o jogo. Confira sua conexão e tente de novo.",
    loading: "Carregando o jogo",
  },

  landing: {
    howToPlay: "Como jogar",
  },

  language: {
    label: "Idioma",
  },

  chip: {
    caption: "Jogando como",
    label: "Jogando como {name}. Trocar nome",
    choose: "Escolher um nome de exibição",
    add: "Adicionar Nome",
  },

  name: {
    eyebrowFirst: "Antes de jogar",
    eyebrowEdit: "Seu nome",
    titleFirst: "Escolha um Nome de Exibição",
    titleEdit: "Trocar Seu Nome",
    label: "Nome de exibição",
    help: "Aparece para os outros jogadores.",
    helpFirst: "Aparece para os outros jogadores. Dá para trocar depois na tela inicial.",
    continue: "Continuar",
    save: "Salvar Nome",
    errors: {
      empty: "Digite um nome para os outros jogadores saberem quem é você.",
      tooLong: "Use no máximo {max} caracteres.",
    },
  },

  errors: {
    join: {
      "room-not-found": "Não existe sala com esse código. Confira com quem criou e tente de novo.",
      "own-room": "Essa sala é sua. Mande o código para outra pessoa.",
      "host-offline": "A conexão de quem criou a sala caiu. Tente de novo em instantes.",
      "room-full": "Essa sala está cheia.",
      "match-started": "Essa partida já começou. Peça uma sala nova.",
    },
    move: {
      "not-your-turn": "Não é a sua vez",
      "game-over": "A partida acabou",
      "invalid-row": "Essa fileira não existe",
      "no-sticks": "Risque pelo menos um palito",
      "stick-taken": "Esse palito já foi riscado",
      "not-adjacent": "Risque palitos vizinhos",
      "not-neighbours": "Ligue dois pontos vizinhos",
      "line-taken": "Essa linha já foi desenhada",
      "not-a-word": "Essa palavra não está no dicionário",
      "wrong-length": "Essa palavra tem o número errado de letras",
      "too-long": "Essa palavra passa do limite desta sala",
      "round-over": "Esta rodada acabou",
      "no-attempts-left": "Acabaram suas tentativas",
    },
  },

  lobby: {
    eyebrow: "Sala de espera",
    help: "Os amigos entram pelo link ou pelo código. Esta tela fica acesa enquanto você espera.",
    leave: "Sair da Sala",
    players: "Jogadores",
    host: "Anfitrião",
    away: "Ausente",
    ready: "Pronto",
    notReady: "Não está pronto",
    openSeat: "Lugar vago",
    start: "Iniciar Partida",
    everyoneReady: "Todo mundo está pronto.",
    cancelReady: "Cancelar Pronto",
    imReady: "Estou Pronto",
    waitingHost: "Esperando o anfitrião iniciar.",
    markReady: "Marque que está pronto quando estiver.",
    settings: {
      hostTitle: "Personalize a partida",
      hostNote: "Você é o anfitrião: ajuste as regras antes de iniciar. Todos veem as mudanças na hora.",
      guestTitle: "Regras da partida",
      guestNote: "Quem escolhe é o anfitrião. As mudanças aparecem aqui na hora.",
    },
    hints: {
      tooFew: { one: "Falta 1 jogador", other: "Faltam {count} jogadores" },
      notReadyOne: "Esperando {name} ficar pronto",
      notReadyTwo: "Esperando {a} e {b} ficarem prontos",
      notReadyMany: "Esperando {count} jogadores ficarem prontos",
      notHost: "Só o anfitrião pode iniciar",
    },
  },

  result: {
    kicker: "Fim da partida",
    youWin: "Você Venceu",
    theyWin: "{name} Venceu",
    everyoneLeft: "Todos os outros saíram da partida.",
    sharedWin: "Vitória Dividida",
    shareWith: "Você divide o topo com {names}.",
    tie: "Empate",
    shareTop: "{names} dividem o topo.",
    winner: "Vencedor",
    wantsAgain: "Quer jogar de novo",
    again: "de novo",
    waitingOthers: "Esperando os outros",
    waitingRoom: "Sala de Espera",
    menu: "Menu",
    alone: "Todos os outros saíram. Vá para a sala de espera para chamar mais jogadores.",
    votedNote: "{count} de {total} querem jogar de novo. Começa quando todos toparem.",
    voteNote: "{count} de {total} querem jogar de novo.",
  },

  // A barra de dois jogadores (Versus.svelte).
  versus: {
    players: "Jogadores",
    computer: "Computador",
    opponent: "Adversário",
    won: "Venceu",
    vs: "vs",
  },
};
