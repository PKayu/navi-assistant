export default function TurnBanner({ playerName, rollCount, maxRolls, turnPhase, activeCard }) {
  const rollsLeft = maxRolls - rollCount;

  return (
    <div className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3 mb-3">
      <div>
        <span className="text-slate-400 text-xs uppercase tracking-wide">Current Turn</span>
        <h2 className="text-white font-bold text-lg leading-tight">{playerName}</h2>
      </div>
      <div className="flex items-center gap-3">
        {activeCard && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              activeCard.type === "negative"
                ? "bg-red-900/60 text-red-300"
                : "bg-emerald-900/60 text-emerald-300"
            }`}
          >
            {activeCard.name}
          </span>
        )}
        <div className="text-right">
          <span className="text-slate-400 text-xs block">Rolls left</span>
          <span className={`font-bold text-lg ${rollsLeft === 0 ? "text-red-400" : "text-white"}`}>
            {turnPhase === "draw" ? "—" : rollsLeft}
          </span>
        </div>
      </div>
    </div>
  );
}
