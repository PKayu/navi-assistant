import { useEffect, useRef, useState } from "react";

const PIP_LAYOUTS = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export default function Die({ die, isLocked, isRolling, onToggle, disabled }) {
  const [cycleValue, setCycleValue] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isRolling && !die.held && !isLocked) {
      setCycleValue(Math.ceil(Math.random() * 6));
      intervalRef.current = setInterval(() => {
        setCycleValue(Math.ceil(Math.random() * 6));
      }, 60);
      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        setCycleValue(null);
      }, 420);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isRolling]);

  const displayValue = cycleValue ?? die.value;
  const pips = displayValue ? PIP_LAYOUTS[displayValue] : [];

  let borderClass = "border-slate-600";
  if (isLocked) borderClass = "border-red-500 border-2";
  else if (die.held) borderClass = "border-yellow-400 border-2";

  let bgClass = "bg-slate-700";
  if (isLocked) bgClass = "bg-red-950/50";
  else if (die.held) bgClass = "bg-yellow-950/30";

  const isAnimating = isRolling && !die.held && !isLocked;

  return (
    <button
      onClick={() => !disabled && !isLocked && onToggle(die.id)}
      disabled={disabled || isLocked}
      aria-label={`Die showing ${displayValue ?? "not rolled"}${die.held ? ", held" : ""}${isLocked ? ", locked" : ""}`}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${bgClass} border ${borderClass}
        flex-shrink-0 transition-colors duration-150
        ${!disabled && !isLocked ? "hover:border-indigo-400 cursor-pointer active:scale-95" : "cursor-default"}
        ${isAnimating ? "dice-rolling" : ""}
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
        {displayValue ? (
          Array.from({ length: 9 }, (_, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            const hasPip = pips.some(([r, c]) => r === row && c === col);
            return (
              <div
                key={idx}
                className={`rounded-full transition-opacity duration-75 ${hasPip ? "bg-white" : "bg-transparent"}`}
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
