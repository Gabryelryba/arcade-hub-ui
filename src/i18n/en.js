// English texts. Keys are shared with pt-BR.js; English is also the fallback
// for any key a translation is missing.
export default {
  meta: {
    description: "Real-time games to play with friends in the browser. No account: pick a name, share a room code, play.",
  },

  common: {
    cancel: "Cancel",
    connecting: "Connecting to the server…",
    waking: "Waking the server up. The free host sleeps when idle; this can take up to a minute…",
    reconnecting: "Reconnecting…",
    createRoom: "Create Room",
    joinWithCode: "Join With Code",
    joinRoom: "Join Room",
    roomCode: "Room code",
    roomCodeAria: "Room code {code}",
    roomCodeHelp: "The 5-character code on the host’s screen.",
    roomCodeLength: "Room codes have 5 characters.",
    joiningRoom: "Joining room {code}…",
    copyInvite: "Copy Invite Link",
    linkCopied: "Link Copied",
    playAgain: "Play Again",
    you: "You",
    left: "left",
    someone: "Someone",
  },

  app: {
    loadError: "Couldn’t load the game. Check your connection and try again.",
    loading: "Loading game",
  },

  language: {
    label: "Language",
  },

  chip: {
    caption: "Playing as",
    label: "Playing as {name}. Change name",
    choose: "Choose a display name",
    add: "Add Name",
  },

  name: {
    eyebrowFirst: "Before you play",
    eyebrowEdit: "Your name",
    titleFirst: "Choose a Display Name",
    titleEdit: "Change Your Name",
    label: "Display name",
    help: "Shown to the other players.",
    helpFirst: "Shown to the other players. You can change it later on the home screen.",
    continue: "Continue",
    save: "Save Name",
    errors: {
      empty: "Type a name so the other players know who you are.",
      tooLong: "Keep it to {max} characters or fewer.",
    },
  },

  // Server refusals, by the code the server sends.
  errors: {
    join: {
      "room-not-found": "No room with that code. Check it with the host and try again.",
      "own-room": "That is your own room. Share the code with someone else.",
      "host-offline": "The host’s connection dropped. Try again in a moment.",
      "room-full": "That room is full.",
      "match-started": "That match has already started. Ask for a new room.",
    },
    move: {
      "not-your-turn": "Not your turn",
      "game-over": "The game is over",
      "invalid-row": "That row doesn’t exist",
      "no-sticks": "Cross at least one stick",
      "stick-taken": "That stick is already crossed",
      "not-adjacent": "Cross sticks that are next to each other",
      "not-neighbours": "Join two dots next to each other",
      "line-taken": "That line is already drawn",
      "not-a-word": "That word isn’t in the dictionary",
      "wrong-length": "That word has the wrong number of letters",
      "too-long": "That word is longer than this room allows",
      "round-over": "This round is over",
      "no-attempts-left": "You have no tries left",
    },
  },

  lobby: {
    eyebrow: "Waiting room",
    help: "Send the link or read the code out loud. This screen stays awake while you wait.",
    leave: "Leave Room",
    players: "Players",
    host: "Host",
    away: "Away",
    ready: "Ready",
    notReady: "Not ready",
    openSeat: "Open seat",
    start: "Start Match",
    everyoneReady: "Everyone is ready.",
    cancelReady: "Cancel Ready",
    imReady: "I’m Ready",
    waitingHost: "Waiting for the host to start.",
    markReady: "Mark yourself ready when you are.",
    settings: {
      hostTitle: "Customize the match",
      hostNote: "You’re the host: set the rules before you start. Everyone sees changes right away.",
      guestTitle: "Match rules",
      guestNote: "The host picks these. Changes show up here right away.",
    },
    hints: {
      tooFew: { one: "Waiting for 1 more player", other: "Waiting for {count} more players" },
      notReadyOne: "Waiting for {name} to get ready",
      notReadyTwo: "Waiting for {a} and {b} to get ready",
      notReadyMany: "Waiting for {count} players to get ready",
      notHost: "Only the host can start",
    },
  },

  result: {
    kicker: "Match over",
    youWin: "You Win",
    theyWin: "{name} Wins",
    everyoneLeft: "Everyone else left the match.",
    sharedWin: "Shared Win",
    shareWith: "You share the top with {names}.",
    tie: "It’s a Tie",
    shareTop: "{names} share the top.",
    winner: "Winner",
    wantsAgain: "Wants to play again",
    again: "again",
    waitingOthers: "Waiting for others",
    waitingRoom: "Waiting Room",
    menu: "Menu",
    alone: "Everyone else left. Go to the waiting room to bring in more players.",
    votedNote: "{count} of {total} want to play again. It starts when everyone is in.",
    voteNote: "{count} of {total} want to play again.",
  },

  // The two-player bar (Versus.svelte).
  versus: {
    players: "Players",
    computer: "Computer",
    opponent: "Opponent",
    won: "Won",
    vs: "vs",
  },
};
