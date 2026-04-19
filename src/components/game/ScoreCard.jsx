import { CATEGORIES } from "../../constants/categories.js";
import { calculateScore, upperBonus, playerTotal } from "../../engine/scoring.js";
import { transformDice } from "../../engine/cardEffects.js";

function getPotentialScore(categoryId, state) {
  if (state.rollCount === 0) return null;
  const diceValues = state.dice.map((d) => d.value).filter((v) => v !== null);
  if (diceValues.length < 5) return null;
  const transformed = transformDice(diceValues, state.activeCard);
  return calculateScore(categoryId, transformed);
}

function ScoreCell({ score, potential, isCurrent, isForced, forcedCategory, categoryId, onCommit, canCommit }) {
  const isThisForced = forcedCategory === categoryId;
  const blockedByForced = forcedCategory && !isThisForced;

  if (score !== null) {
    return (
      <td className="text-center py-1.5 px-1 text-slate-400 text-sm font-medium">
        {score}
      </td>
    );
  }

  if (!isCurrent) {
    return <td className="text-center py-1.5 px-1 text-slate-600 text-sm">—</td>;
  }

  if (!canCommit || potential === null) {
    return <td className="text-center py-1.5 px-1 text-slate-600 text-sm">—</td>;
  }

  const isZero = potential === 0;

  return (
    <td className="text-center py-1.5 px-1">
      <button
        onClick={() => !blockedByForced && onCommit(categoryId)}
        disabled={!!blockedByForced}
        className={`w-full rounded-lg py-1 px-1 text-sm font-semibold transition-colors ${
          blockedByForced
            ? "text-slate-600 cursor-not-allowed"
            : isThisForced
            ? "bg-orange-900/60 text-orange-300 hover:bg-orange-800/60 ring-1 ring-orange-500"
            : isZero
            ? "bg-red-900/40 text-red-400 hover:bg-red-900/60"
            : "bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60"
        }`}
      >
        {isThisForced ? `${potential}*` : potential}
      </button>
    </td>
  );
}

export default function ScoreCard({ state, onCommit }) {
  const { players, currentPlayerIndex, turnPhase, rollCount, forcedCategory } = state;

  const canCommit = (turnPhase === "scoring" || turnPhase === "rolling") && rollCount >= 1;

  const upperCategories = CATEGORIES.filter((c) => c.section === "upper");
  const lowerCategories = CATEGORIES.filter((c) => c.section === "lower");

  function renderCategoryRow(cat) {
    return (
      <tr key={cat.id} className="border-b border-slate-700/50">
        <td className="py-1.5 px-2 text-slate-300 text-sm font-medium whitespace-nowrap">
          {cat.label}
        </td>
        {players.map((player, pi) => {
          const potential = getPotentialScore(cat.id, state);
          return (
            <ScoreCell
              key={player.id}
              score={player.scores[cat.id]}
              potential={potential}
              isCurrent={pi === currentPlayerIndex}
              forcedCategory={forcedCategory}
              categoryId={cat.id}
              onCommit={onCommit}
              canCommit={canCommit}
            />
          );
        })}
      </tr>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      {forcedCategory && (
        <div className="bg-orange-900/40 border-b border-orange-700 px-3 py-2 text-center">
          <span className="text-orange-300 text-xs font-semibold">
            🎯 Forced Category: You must score in{" "}
            <strong>{CATEGORIES.find((c) => c.id === forcedCategory)?.label}</strong>
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-2 px-2 text-left text-slate-400 text-xs uppercase tracking-wide font-semibold">
                Category
              </th>
              {players.map((p, i) => (
                <th
                  key={p.id}
                  className={`py-2 px-1 text-center text-xs font-semibold uppercase tracking-wide ${
                    i === currentPlayerIndex ? "text-indigo-400" : "text-slate-400"
                  }`}
                >
                  {p.name.length > 6 ? p.name.slice(0, 6) + "…" : p.name}
                  {i === currentPlayerIndex && " ▾"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={players.length + 1} className="py-1 px-2 bg-slate-900/40">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Upper Section
                </span>
              </td>
            </tr>
            {upperCategories.map(renderCategoryRow)}
            <tr className="border-b border-slate-700 bg-slate-900/20">
              <td className="py-1.5 px-2 text-slate-400 text-xs">Bonus (+35 if ≥63)</td>
              {players.map((p) => (
                <td key={p.id} className="text-center text-xs text-slate-400 py-1.5">
                  {(() => {
                    const upperIds = ["ones", "twos", "threes", "fours", "fives", "sixes"];
                    const sum = upperIds.reduce((s, id) => s + (p.scores[id] ?? 0), 0);
                    return `${sum}/63`;
                  })()}
                </td>
              ))}
            </tr>
            <tr>
              <td colSpan={players.length + 1} className="py-1 px-2 bg-slate-900/40">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Lower Section
                </span>
              </td>
            </tr>
            {lowerCategories.map(renderCategoryRow)}
            {players.some((p) => p.scores.yahtzeeBonus > 0) && (
              <tr className="border-b border-slate-700/50">
                <td className="py-1.5 px-2 text-slate-300 text-sm">Yahtzee Bonus</td>
                {players.map((p) => (
                  <td key={p.id} className="text-center py-1.5 text-sm text-emerald-400 font-medium">
                    {p.scores.yahtzeeBonus > 0 ? `+${p.scores.yahtzeeBonus}` : "—"}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900/50 border-t border-slate-600">
              <td className="py-2 px-2 text-white font-bold text-sm">Total</td>
              {players.map((p) => (
                <td key={p.id} className="text-center py-2 text-white font-bold text-sm">
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
