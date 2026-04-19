import { CATEGORIES } from "../../constants/categories.js";
import TurnBanner from "./TurnBanner.jsx";
import CardDisplay from "./CardDisplay.jsx";
import DiceArea from "./DiceArea.jsx";
import ScoreCard from "./ScoreCard.jsx";

function StealModal({ players, currentPlayerIndex, onSelect, onCancel }) {
  const others = players.filter((_, i) => i !== currentPlayerIndex);
  const scoredCategories = (player) =>
    CATEGORIES.filter((c) => player.scores[c.id] !== null);

  const hasAnyScores = others.some((p) => scoredCategories(p).length > 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-1">Steal a Score</h3>
        <p className="text-slate-400 text-sm mb-4">
          Pick a category already scored by an opponent to copy it.
        </p>
        {!hasAnyScores ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No opponents have scored yet — nothing to steal!
          </p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {others.map((player) => {
              const scored = scoredCategories(player);
              if (scored.length === 0) return null;
              return (
                <div key={player.id}>
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-1">
                    {player.name}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {scored.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => onSelect(player.id, cat.id)}
                        className="bg-slate-700 hover:bg-purple-900/60 text-slate-200 rounded-lg px-3 py-2 text-sm text-left transition-colors"
                      >
                        <span className="block font-medium">{cat.label}</span>
                        <span className="text-slate-400 text-xs">{player.scores[cat.id]} pts</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button
          onClick={onCancel}
          className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm transition-colors"
        >
          Skip — score normally instead
        </button>
      </div>
    </div>
  );
}

function SwapModal({ players, currentPlayerIndex, onSelect, onCancel }) {
  const others = players.filter((_, i) => i !== currentPlayerIndex);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-1">Swap Dice</h3>
        <p className="text-slate-400 text-sm mb-4">
          Choose a player to swap your current dice with their last roll.
        </p>
        <div className="space-y-2">
          {others.map((player) => {
            const hasLastDice = player.lastDice && player.lastDice.length > 0;
            return (
              <button
                key={player.id}
                onClick={() => hasLastDice && onSelect(player.id)}
                disabled={!hasLastDice}
                className={`w-full py-3 px-4 rounded-xl text-left transition-colors ${
                  hasLastDice
                    ? "bg-slate-700 hover:bg-blue-900/60 text-slate-200"
                    : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span className="font-medium">{player.name}</span>
                {hasLastDice ? (
                  <span className="text-slate-400 text-sm ml-2">
                    [{player.lastDice.join(", ")}]
                  </span>
                ) : (
                  <span className="text-slate-500 text-sm ml-2">(no last roll yet)</span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm transition-colors"
        >
          Skip swap — keep my dice
        </button>
      </div>
    </div>
  );
}

function InteractionButtons({ state, activateSteal, activateSwap }) {
  const { activeCard, turnPhase, rollCount } = state;
  if (!activeCard) return null;

  const canAct = (turnPhase === "rolling" || turnPhase === "scoring") && rollCount >= 1;
  if (!canAct) return null;

  if (activeCard.effectKey === "steal") {
    return (
      <button
        onClick={activateSteal}
        className="w-full mb-3 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
      >
        👁 Use Steal Power
      </button>
    );
  }

  if (activeCard.effectKey === "swapDice") {
    return (
      <button
        onClick={activateSwap}
        className="w-full mb-3 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
      >
        🔀 Use Swap Dice Power
      </button>
    );
  }

  return null;
}

export default function GameBoard({ gameState }) {
  const {
    state,
    drawCard, rollDice, toggleHold, commitScore,
    selectStealTarget, selectSwapTarget,
    activateSteal, cancelSteal,
    activateSwap, cancelSwap,
  } = gameState;
  const currentPlayer = state.players[state.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-slate-900 p-3 pb-6">
      <div className="max-w-lg mx-auto">
        <TurnBanner
          playerName={currentPlayer.name}
          rollCount={state.rollCount}
          maxRolls={state.maxRolls}
          turnPhase={state.turnPhase}
          activeCard={state.activeCard}
        />

        <CardDisplay
          cardDrawn={state.cardDrawn}
          activeCard={state.activeCard}
          onDraw={drawCard}
          turnPhase={state.turnPhase}
        />

        <DiceArea
          state={state}
          onRoll={rollDice}
          onToggleHold={toggleHold}
        />

        <InteractionButtons
          state={state}
          activateSteal={activateSteal}
          activateSwap={activateSwap}
        />

        <ScoreCard
          state={state}
          onCommit={commitScore}
        />
      </div>

      {state.pendingSteal && (
        <StealModal
          players={state.players}
          currentPlayerIndex={state.currentPlayerIndex}
          onSelect={selectStealTarget}
          onCancel={cancelSteal}
        />
      )}

      {state.pendingSwap && (
        <SwapModal
          players={state.players}
          currentPlayerIndex={state.currentPlayerIndex}
          onSelect={selectSwapTarget}
          onCancel={cancelSwap}
        />
      )}
    </div>
  );
}
