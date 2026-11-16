// The end of a match played from a waiting room (Dotz, Guess Word): who ranks
// where, what the result says, and the Play Again vote.

import { t, joinNames } from "./i18n/index.svelte.js";

// Highest score first; equal scores keep the order of play.
// game: { order, scores, winners }. -> [{ index, name, color, left?, again?, score, winner }]
export function ranking(game, players) {
  const winners = game.winners ?? [];
  return game.order
    .map((index) => ({ ...players[index], score: game.scores?.[index] ?? 0, winner: winners.includes(index) }))
    .sort((a, b) => b.score - a.score);
}

// Play Again after the end is a vote of everyone still in the room.
// -> { count, total, mine, alone, note }
export function rematchVote(players, me) {
  const here = players.filter((p) => !p.left);
  const count = here.filter((p) => p.again).length;
  const total = here.length;
  const mine = Boolean(players[me]?.again);
  const alone = total < 2;
  let note = "";
  if (alone) note = t("result.alone");
  else if (mine) note = t("result.votedNote", { count, total });
  else if (count > 0) note = t("result.voteNote", { count, total });
  return { count, total, mine, alone, note };
}

// forfeit: everyone else left. soloDetail(score): the line under a single winner.
// -> { title, detail, won }
export function headline({ winners = [], scores = {}, players, me, forfeit = false, soloDetail = () => "" }) {
  const won = winners.includes(me);
  const nameOf = (index) => (index === me ? t("common.you") : (players[index]?.name ?? t("common.someone")));
  const winnerTitle = () => (won ? t("result.youWin") : t("result.theyWin", { name: nameOf(winners[0]) }));
  if (forfeit) return { title: winnerTitle(), detail: t("result.everyoneLeft"), won };
  if (winners.length === 1) return { title: winnerTitle(), detail: soloDetail(scores[winners[0]] ?? 0), won };
  if (won) {
    const others = joinNames(winners.filter((index) => index !== me).map(nameOf));
    return { title: t("result.sharedWin"), detail: t("result.shareWith", { names: others }), won };
  }
  return { title: t("result.tie"), detail: t("result.shareTop", { names: joinNames(winners.map(nameOf)) }), won };
}
