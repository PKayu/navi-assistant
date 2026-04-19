const COLOR_MAP = {
  emerald: { border: "border-emerald-500", bg: "bg-emerald-900/30", text: "text-emerald-400", badge: "bg-emerald-900 text-emerald-300" },
  blue:    { border: "border-blue-500",    bg: "bg-blue-900/30",    text: "text-blue-400",    badge: "bg-blue-900 text-blue-300" },
  yellow:  { border: "border-yellow-500",  bg: "bg-yellow-900/30",  text: "text-yellow-400",  badge: "bg-yellow-900 text-yellow-300" },
  purple:  { border: "border-purple-500",  bg: "bg-purple-900/30",  text: "text-purple-400",  badge: "bg-purple-900 text-purple-300" },
  red:     { border: "border-red-500",     bg: "bg-red-900/30",     text: "text-red-400",     badge: "bg-red-900 text-red-300" },
  orange:  { border: "border-orange-500",  bg: "bg-orange-900/30",  text: "text-orange-400",  badge: "bg-orange-900 text-orange-300" },
};

export default function CardDisplay({ cardDrawn, activeCard, onDraw, turnPhase }) {
  if (!cardDrawn) {
    return (
      <div className="bg-slate-800 rounded-xl p-4 mb-3 flex flex-col items-center gap-3">
        <div className="w-24 h-32 rounded-xl bg-indigo-900/50 border-2 border-indigo-700 flex items-center justify-center">
          <span className="text-4xl">🃏</span>
        </div>
        <button
          onClick={onDraw}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors active:scale-95"
        >
          Draw Card
        </button>
      </div>
    );
  }

  const colors = COLOR_MAP[activeCard.color] || COLOR_MAP.blue;

  return (
    <div className={`rounded-xl p-4 mb-3 border ${colors.border} ${colors.bg} card-reveal`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${colors.badge}`}>
              {activeCard.type === "negative" ? "Penalty" : "Bonus"}
            </span>
          </div>
          <h3 className={`font-bold text-lg ${colors.text}`}>{activeCard.name}</h3>
          <p className="text-slate-300 text-sm mt-1">{activeCard.description}</p>
        </div>
        <div className="text-3xl">{activeCard.type === "negative" ? "💀" : "✨"}</div>
      </div>
    </div>
  );
}
