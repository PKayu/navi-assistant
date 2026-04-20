import { CARDS } from "../constants/cards.js";
import { CATEGORY_IDS } from "../constants/categories.js";
import { calculateScore } from "./scoring.js";
import { applyCardToState, transformDice } from "./cardEffects.js";

const INITIAL_SCORES = () =>
  Object.fromEntries([...CATEGORY_IDS.map((id) => [id, null]), ["yahtzeeBonus", 0]]);

const INITIAL_DICE = () =>
  Array.from({ length: 5 }, (_, i) => ({ id: i, value: null, held: false }));

const TURN_DEFAULTS = {
  rollCount: 0,
  maxRolls: 3,
  activeCard: null,
  cardDrawn: false,
  turnPhase: "draw",
  doubleThisTurn: false,
  noHoldAllowed: false,
  halfScoreThisTurn: false,
  lockedDieIndex: null,
  forcedCategory: null,
  pendingSteal: false,
  pendingSwap: false,
};

export const initialState = {
  screen: "setup",
  players: [],
  currentPlayerIndex: 0,
  dice: INITIAL_DICE(),
  ...TURN_DEFAULTS,
};

function allCategoriesFilled(players) {
  return players.every((p) =>
    CATEGORY_IDS.every((id) => p.scores[id] !== null)
  );
}

function advanceTurn(state) {
  const updatedPlayers = state.players.map((p, i) =>
    i === state.currentPlayerIndex
      ? { ...p, lastDice: state.dice.map((d) => d.value) }
      : p
  );

  if (allCategoriesFilled(updatedPlayers)) {
    return { ...state, players: updatedPlayers, screen: "end" };
  }

  const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
  return {
    ...state,
    players: updatedPlayers,
    currentPlayerIndex: nextIndex,
    dice: INITIAL_DICE(),
    ...TURN_DEFAULTS,
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const players = action.players.map((name, i) => ({
        id: i,
        name,
        scores: INITIAL_SCORES(),
        lastDice: [],
      }));
      return { ...initialState, screen: "game", players, currentPlayerIndex: 0 };
    }

    case "DRAW_CARD": {
      if (state.cardDrawn || state.turnPhase !== "draw") return state;
      const isSinglePlayer = state.players.length === 1;
      const pool = isSinglePlayer
        ? CARDS.filter((c) => !["steal", "swapDice"].includes(c.effectKey))
        : CARDS;
      const card = pool[Math.floor(Math.random() * pool.length)];
      const cardUpdates = applyCardToState(state, card);
      return {
        ...state,
        activeCard: card,
        cardDrawn: true,
        turnPhase: "rolling",
        ...cardUpdates,
      };
    }

    case "ROLL_DICE": {
      if (state.turnPhase !== "rolling" || state.rollCount >= state.maxRolls) return state;

      const newDice = state.dice.map((die, i) => {
        if (i === state.lockedDieIndex) {
          // Lock to first rolled value; keep it on subsequent rolls
          if (die.value !== null) return { ...die, held: false };
          return { ...die, value: Math.ceil(Math.random() * 6), held: false };
        }
        if (die.held) return die;
        return { ...die, value: Math.ceil(Math.random() * 6) };
      });

      const newRollCount = state.rollCount + 1;
      const nextPhase = newRollCount >= state.maxRolls ? "scoring" : "rolling";
      return { ...state, dice: newDice, rollCount: newRollCount, turnPhase: nextPhase };
    }

    case "TOGGLE_HOLD": {
      if (
        state.noHoldAllowed ||
        state.rollCount < 1 ||
        state.turnPhase !== "rolling" ||
        action.dieId === state.lockedDieIndex
      ) return state;

      const newDice = state.dice.map((d) =>
        d.id === action.dieId ? { ...d, held: !d.held } : d
      );
      return { ...state, dice: newDice };
    }

    case "COMMIT_SCORE": {
      if (state.turnPhase !== "scoring" && state.turnPhase !== "rolling") return state;
      if (state.rollCount < 1) return state;

      const { categoryId } = action;
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (currentPlayer.scores[categoryId] !== null && categoryId !== "yahtzee") return state;
      if (state.forcedCategory && categoryId !== state.forcedCategory) return state;

      const diceValues = state.dice.map((d) => d.value);
      const transformed = transformDice(diceValues, state.activeCard);
      let score = calculateScore(categoryId, transformed);

      let updatedScores = { ...currentPlayer.scores };

      if (categoryId === "yahtzee" && updatedScores.yahtzee !== null) {
        // Second+ Yahtzee — add bonus if it's a real Yahtzee
        if (score === 50) {
          updatedScores.yahtzeeBonus = (updatedScores.yahtzeeBonus || 0) + 100;
          score = 0; // no additional category score needed
        } else {
          // Not actually a Yahtzee this roll — can't score here twice
          return state;
        }
      } else {
        if (state.halfScoreThisTurn) score = Math.floor(score / 2);
        if (state.doubleThisTurn) score = score * 2;
        updatedScores[categoryId] = score;
      }

      const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? { ...p, scores: updatedScores } : p
      );

      return advanceTurn({ ...state, players: updatedPlayers });
    }

    case "SELECT_STEAL_TARGET": {
      const { playerId, categoryId } = action;
      const targetScore = state.players[playerId].scores[categoryId];
      if (targetScore === null) return state;

      const currentPlayer = state.players[state.currentPlayerIndex];
      if (currentPlayer.scores[categoryId] !== null) return state;

      const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex
          ? { ...p, scores: { ...p.scores, [categoryId]: targetScore } }
          : p
      );
      return advanceTurn({ ...state, players: updatedPlayers, pendingSteal: false });
    }

    case "SELECT_SWAP_TARGET": {
      const { playerId } = action;
      const targetLastDice = state.players[playerId].lastDice;
      if (!targetLastDice || targetLastDice.length === 0) {
        // No-op: target has no dice yet
        return { ...state, pendingSwap: false };
      }
      const swappedDice = state.dice.map((d, i) => ({
        ...d,
        value: targetLastDice[i] ?? d.value,
        held: false,
      }));
      return { ...state, dice: swappedDice, pendingSwap: false, turnPhase: "scoring" };
    }

    case "ACTIVATE_STEAL":
      if (state.activeCard?.effectKey !== "steal") return state;
      return { ...state, pendingSteal: true };

    case "CANCEL_STEAL":
      return { ...state, pendingSteal: false };

    case "ACTIVATE_SWAP":
      if (state.activeCard?.effectKey !== "swapDice") return state;
      return { ...state, pendingSwap: true };

    case "CANCEL_SWAP":
      return { ...state, pendingSwap: false };

    case "RESTART_GAME":
      return { ...initialState };

    default:
      return state;
  }
}
