import { useGameState } from "./hooks/useGameState.js";
import PlayerSetup from "./components/setup/PlayerSetup.jsx";
import GameBoard from "./components/game/GameBoard.jsx";
import WinnerScreen from "./components/endgame/WinnerScreen.jsx";

export default function App() {
  const gameState = useGameState();
  const { state } = gameState;

  if (state.screen === "setup") return <PlayerSetup onStart={gameState.startGame} />;
  if (state.screen === "game") return <GameBoard gameState={gameState} />;
  return <WinnerScreen state={state} onRestart={gameState.restartGame} />;
}
