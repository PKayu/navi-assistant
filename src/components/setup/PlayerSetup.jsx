import { useState } from "react";

export default function PlayerSetup({ onStart }) {
  const [mode, setMode] = useState(null); // "solo" | "multi"
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

  if (!mode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-bold text-white text-center mb-2">🎲 Dice Twist</h1>
          <p className="text-slate-400 text-center text-sm mb-10">
            Yahtzee with a card modifier twist
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setMode("solo")}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-colors active:scale-95 flex flex-col items-center gap-1"
            >
              <span>🎯 Single Player</span>
              <span className="text-indigo-300 text-sm font-normal">Go for the highest score</span>
            </button>
            <button
              onClick={() => setMode("multi")}
              className="w-full py-5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-lg transition-colors active:scale-95 flex flex-col items-center gap-1"
            >
              <span>👥 Pass & Play</span>
              <span className="text-slate-400 text-sm font-normal">2–4 players, one device</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "solo") {
    const name = names[0];
    const canStart = name.trim().length > 0;
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <button onClick={() => setMode(null)} className="text-slate-400 text-sm mb-6 flex items-center gap-1 hover:text-white transition-colors">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">Single Player</h2>
          <p className="text-slate-400 text-sm mb-8">Fill all 13 categories. Beat your high score!</p>
          <div className="mb-8">
            <label className="text-slate-400 text-xs mb-1 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(0, e.target.value)}
              placeholder="Enter your name"
              maxLength={16}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>
          <button
            onClick={() => canStart && onStart([name.trim()])}
            disabled={!canStart}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              canStart
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // Multiplayer
  const canStart = names.every((n) => n.trim().length > 0);
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <button onClick={() => setMode(null)} className="text-slate-400 text-sm mb-6 flex items-center gap-1 hover:text-white transition-colors">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-white mb-8">Pass & Play</h2>

        <div className="mb-6">
          <label className="text-slate-300 text-sm font-semibold mb-2 block">Number of Players</label>
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
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
