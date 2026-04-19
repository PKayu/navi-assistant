export function transformDice(diceValues, activeCard) {
  if (!activeCard) return diceValues;

  switch (activeCard.effectKey) {
    case "wildThrees": {
      const nonThrees = diceValues.filter((v) => v !== 3);
      if (nonThrees.length === 0) return diceValues;
      const freq = {};
      for (const v of nonThrees) freq[v] = (freq[v] || 0) + 1;
      const best = Object.entries(freq).sort((a, b) => b[1] - a[1] || b[0] - a[0])[0][0];
      return diceValues.map((v) => (v === 3 ? Number(best) : v));
    }
    case "luckySevens":
      return diceValues.map((v) => (v === 1 ? 6 : v));
    case "mirrorImage": {
      const max = Math.max(...diceValues);
      return diceValues.map(() => max);
    }
    default:
      return diceValues;
  }
}

export function applyCardToState(state, card) {
  const updates = {};
  switch (card.effectKey) {
    case "extraRoll":
      updates.maxRolls = 4;
      break;
    case "doubleDown":
      updates.doubleThisTurn = true;
      break;
    case "freeHold":
      updates.freeHoldActive = true;
      break;
    case "fumble":
      updates.noHoldAllowed = true;
      break;
    case "halfScore":
      updates.halfScoreThisTurn = true;
      break;
    case "brokenDie":
      updates.lockedDieIndex = Math.floor(Math.random() * 5);
      break;
    case "forcedCategory": {
      const currentPlayer = state.players[state.currentPlayerIndex];
      const unfilled = Object.entries(currentPlayer.scores)
        .filter(([k, v]) => k !== "yahtzeeBonus" && v === null)
        .map(([k]) => k);
      if (unfilled.length > 0) {
        updates.forcedCategory = unfilled[Math.floor(Math.random() * unfilled.length)];
      }
      break;
    }
    // steal and swapDice are activated on-demand by the player, not auto-triggered on draw
  }
  return updates;
}
