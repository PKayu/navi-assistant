import { useState } from "react";
import Die from "./Die.jsx";

export default function DiceArea({ state, onRoll, onToggleHold }) {
  const { dice, rollCount, maxRolls, turnPhase, noHoldAllowed, lockedDieIndex } = state;
  const [rolling, setRolling] = useState(false);

  const canRoll = turnPhase === "rolling" && rollCount < maxRolls;

  function handleRoll() {
    if (!canRoll) return;
    setRolling(true);
    onRoll();
    setTimeout(() => setRolling(false), 450);
  }

  const rollsLeft = maxRolls - rollCount;

  return (
    <div className="bg-slate-800 rounded-xl p-4 mb-3">
      {noHoldAllowed && (
        <p className="text-red-400 text-xs text-center mb-2 font-semibold">
          Fumble! You cannot hold dice this turn.
        </p>
      )}
      <div className="flex justify-center gap-2 sm:gap-3 mb-4">
        {dice.map((die) => (
          <Die
            key={die.id}
            die={die}
            isLocked={die.id === lockedDieIndex}
            isRolling={rolling}
            onToggle={onToggleHold}
            disabled={turnPhase !== "rolling" || rollCount < 1 || noHoldAllowed}
          />
        ))}
      </div>

      <button
        onClick={handleRoll}
        disabled={!canRoll}
        className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
          canRoll
            ? "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95"
            : "bg-slate-700 text-slate-500 cursor-not-allowed"
        }`}
      >
        {rollCount === 0
          ? "Roll Dice"
          : rollsLeft > 0
          ? `Re-roll (${rollsLeft} left)`
          : "No rolls left"}
      </button>

      {rollCount > 0 && turnPhase === "rolling" && !noHoldAllowed && (
        <p className="text-slate-500 text-xs text-center mt-2">
          Tap dice to hold them between rolls
        </p>
      )}
    </div>
  );
}
