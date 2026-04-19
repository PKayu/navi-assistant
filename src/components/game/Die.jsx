import { useEffect, useState } from "react";

const PIP_LAYOUTS = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export default function Die({ die, isLocked, isRolling, onToggle, disabled }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isRolling && !die.held && !isLocked) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 350);
      return () => clearTimeout(t);
    }
  }, [isRolling, die.held, isLocked]);

  const pips = die.value ? PIP_LAYOUTS[die.value] : [];

  let borderClass = "border-slate-600";
  if (isLocked) borderClass = "border-red-500 border-2";
  else if (die.held) borderClass = "border-yellow-400 border-2";

  let bgClass = "bg-slate-700";
  if (isLocked) bgClass = "bg-red-950/50";
  else if (die.held) bgClass = "bg-yellow-950/30";

  return (
    <button
      onClick={() => !disabled && !isLocked && onToggle(die.id)}
      disabled={disabled || isLocked}
      aria-label={`Die showing ${die.value ?? "not rolled"}${die.held ? ", held" : ""}${isLocked ? ", locked" : ""}`}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${bgClass} border ${borderClass}
        flex-shrink-0 transition-all duration-150
        ${!disabled && !isLocked ? "hover:border-indigo-400 cursor-pointer active:scale-95" : "cursor-default"}
        ${animating ? "dice-rolling" : ""}
      `}
    >
      {isLocked && (
        <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
          !
        </span>
      )}
      {die.held && !isLocked && (
        <span className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-slate-900 rounded-full px-1 font-bold leading-none py-0.5">
          H
        </span>
      )}

      <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1.5 gap-0.5">
        {die.value ? (
          Array.from({ length: 9 }, (_, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            const hasPip = pips.some(([r, c]) => r === row && c === col);
            return (
              <div
                key={idx}
                className={`rounded-full ${hasPip ? "bg-white" : "bg-transparent"}`}
              />
            );
          })
        ) : (
          <div className="col-span-3 row-span-3 flex items-center justify-center">
            <span className="text-slate-500 text-xs">?</span>
          </div>
        )}
      </div>
    </button>
  );
}
