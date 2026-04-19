import { useState } from "react";

export default function PlayerSetup({ onStart }) {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(["", ""]);

  function setPlayerCount(n) {
    setCount(n);
    setNames((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
  }

  function setName(i, value) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? value : n)));
  }

  const canStart = names.every((n) => n.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">🎲 Dice Twist</h1>
        <p className="text-slate-400 text-center text-sm mb-8">
          Yahtzee with a card modifier twist
        </p>

        <div className="mb-6">
          <label className="text-slate-300 text-sm font-semibold mb-2 block">
            Number of Players
          </label>
          <div className="flex gap-2">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                className={`flex-1 py-2 rounded-lg font-bold text-lg transition-colors ${
                  count === n
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-3">
          {names.map((name, i) => (
            <div key={i}>
              <label className="text-slate-400 text-xs mb-1 block">Player {i + 1}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(i, e.target.value)}
                placeholder={`Player ${i + 1} name`}
                maxLength={16}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => canStart && onStart(names.map((n) => n.trim()))}
          disabled={!canStart}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            canStart
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/30"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
