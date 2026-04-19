import { useEffect, useState } from "react";
import { CATEGORIES } from "../../constants/categories.js";
import { playerTotal, upperBonus } from "../../engine/scoring.js";

const HIGH_SCORE_KEY = "dicetwist_highscore";

function ScoreTable({ players }) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden mb-6">
      <div className="px-3 py-2 bg-slate-900/50">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Final Scorecard</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-2 px-2 text-left text-slate-400 text-xs uppercase">Category</th>
              {players.map((p) => (
                <th key={p.id} className="py-2 px-2 text-center text-slate-400 text-xs">
                  {p.name.length > 6 ? p.name.slice(0, 6) + "…" : p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat.id} className="border-b border-slate-700/40">
                <td className="py-1.5 px-2 text-slate-300 text-sm">{cat.label}</td>
                {players.map((p) => (
                  <td key={p.id} className="text-center py-1.5 text-sm text-slate-300">
                    {p.scores[cat.id] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-slate-700/40 bg-slate-900/20">
              <td className="py-1.5 px-2 text-slate-400 text-sm">Upper Bonus</td>
              {players.map((p) => (
                <td key={p.id} className="text-center py-1.5 text-sm text-emerald-400">
                  {upperBonus(p.scores) > 0 ? `+${upperBonus(p.scores)}` : "—"}
                </td>
              ))}
            </tr>
            {players.some((p) => p.scores.yahtzeeBonus > 0) && (
              <tr className="border-b border-slate-700/40 bg-slate-900/20">
                <td className="py-1.5 px-2 text-slate-400 text-sm">Yahtzee Bonus</td>
                {players.map((p) => (
                  <td key={p.id} className="text-center py-1.5 text-sm text-emerald-400">
                    {p.scores.yahtzeeBonus > 0 ? `+${p.scores.yahtzeeBonus}` : "—"}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900/50">
              <td className="py-2 px-2 text-white font-bold">Total</td>
              {players.map((p) => (
                <td key={p.id} className="text-center py-2 text-white font-bold">
                  {playerTotal(p.scores)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SoloResult({ player, onRestart }) {
  const score = playerTotal(player.scores);
  const [prevHigh, setPrevHigh] = useState(null);
  const isNewHigh = prevHigh === null || score > prevHigh;

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0", 10);
    setPrevHigh(stored || null);
    if (score > stored) {
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  }, [score]);

  return (
    <div className="min-h-screen bg-slate-900 p-4 pb-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6 pt-6">
          <div className="text-6xl mb-3">{isNewHigh ? "🏆" : "🎲"}</div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {isNewHigh ? "New High Score!" : "Game Over"}
          </h1>
          <p className="text-slate-400 text-sm">{player.name}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6 text-center">
          <p className="text-slate-400 text-sm mb-1">Your Score</p>
          <p className={`text-5xl font-bold mb-4 ${isNewHigh ? "text-yellow-400" : "text-white"}`}>
            {score}
          </p>
          {prevHigh !== null && !isNewHigh && (
            <p className="text-slate-400 text-sm">
              High score: <span className="text-yellow-400 font-bold">{prevHigh}</span>
              <span className="text-slate-500 ml-2">(need {prevHigh - score + 1} more to beat it)</span>
            </p>
          )}
          {isNewHigh && prevHigh !== null && (
            <p className="text-emerald-400 text-sm">
              Previous best: {prevHigh} — you beat it by {score - prevHigh}!
            </p>
          )}
        </div>

        <ScoreTable players={[player]} />

        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl transition-colors shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default function WinnerScreen({ state, onRestart }) {
  const { players } = state;

  if (players.length === 1) {
    return <SoloResult player={players[0]} onRestart={onRestart} />;
  }

  const ranked = [...players]
    .map((p) => ({ ...p, total: playerTotal(p.scores) }))
    .sort((a, b) => b.total - a.total);

  const winner = ranked[0];
  const isTie = ranked.length > 1 && ranked[1].total === winner.total;

  return (
    <div className="min-h-screen bg-slate-900 p-4 pb-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="text-6xl mb-3">{isTie ? "🤝" : "🏆"}</div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {isTie ? "It's a Tie!" : `${winner.name} Wins!`}
          </h1>
          {!isTie && <p className="text-slate-400">{winner.total} points</p>}
        </div>

        <div className="mb-6 space-y-2">
          {ranked.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                i === 0 ? "bg-yellow-900/30 border border-yellow-700/50" : "bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-400 w-6">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <span className={`font-semibold ${i === 0 ? "text-yellow-300" : "text-white"}`}>
                  {player.name}
                </span>
              </div>
              <span className={`font-bold text-lg ${i === 0 ? "text-yellow-300" : "text-white"}`}>
                {player.total}
              </span>
            </div>
          ))}
        </div>

        <ScoreTable players={players} />

        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl transition-colors shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
