import { useReducer } from "react";
import { gameReducer, initialState } from "../engine/gameReducer.js";

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const actions = {
    startGame: (players) => dispatch({ type: "START_GAME", players }),
    drawCard: () => dispatch({ type: "DRAW_CARD" }),
    rollDice: () => dispatch({ type: "ROLL_DICE" }),
    toggleHold: (dieId) => dispatch({ type: "TOGGLE_HOLD", dieId }),
    commitScore: (categoryId) => dispatch({ type: "COMMIT_SCORE", categoryId }),
    selectStealTarget: (playerId, categoryId) =>
      dispatch({ type: "SELECT_STEAL_TARGET", playerId, categoryId }),
    selectSwapTarget: (playerId) => dispatch({ type: "SELECT_SWAP_TARGET", playerId }),
    activateSteal: () => dispatch({ type: "ACTIVATE_STEAL" }),
    cancelSteal: () => dispatch({ type: "CANCEL_STEAL" }),
    activateSwap: () => dispatch({ type: "ACTIVATE_SWAP" }),
    cancelSwap: () => dispatch({ type: "CANCEL_SWAP" }),
    restartGame: () => dispatch({ type: "RESTART_GAME" }),
  };

  return { state, ...actions };
}
