import { useState, useEffect, useCallback } from "react";
import GameBoard from "./components/GameBoard.jsx";
import GameOver from "./components/GameOver.jsx";
import Log from "./components/Log.jsx";
import Player from "./components/Player.jsx";
import RollDice from "./components/RollDice.jsx";
import AI from "./components/AI.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";
import soundEffect from '/start-sound-effect.mp3';

const initialPlayers = {
  X: 'Player 1',
  O: 'Player 2'
};

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const playSound = () => {
  const audio = new Audio(soundEffect); 
  audio.play();
};

function callWinner(gameBoard, players, vsAI) {
  for (const combo of WINNING_COMBINATIONS) {
    const { row: row1, column: col1 } = combo[0];
    const { row: row2, column: col2 } = combo[1];
    const { row: row3, column: col3 } = combo[2];

    if (
      gameBoard[row1]?.[col1] &&
      gameBoard[row1][col1] === gameBoard[row2]?.[col2] &&
      gameBoard[row1][col1] === gameBoard[row3]?.[col3]
    ) {
      const winner = players[gameBoard[row1][col1]];
      return vsAI && winner === players.O ? 'AI' : winner;
    }
  }
  return null;
}

function setGameBoard(gameTrns) {
  const gameBoard = initialGameBoard.map((row) => [...row]);
  gameTrns.forEach(({ square, player }) => {
    const { row, col } = square;
    gameBoard[row][col] = player;
  });
  return gameBoard;
}

function App() {
  const [gameTrns, setGameTrns] = useState([]);
  const [players, setPlayers] = useState(initialPlayers);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [vsAI, setVsAI] = useState(false);

  const activePlayer = startingPlayer === 'X'
    ? (gameTrns.length % 2 === 0 ? 'X' : 'O')
    : (gameTrns.length % 2 === 0 ? 'O' : 'X');

  const gameBoard = setGameBoard(gameTrns);
  const winner = callWinner(gameBoard, players, vsAI);
  const isDraw = gameTrns.length === 9 && !winner;

  const restart = () => {
    setGameTrns([]);
    setGameStarted(false);
    setVsAI(false);
  };

  const handlePlNameChange = (symbol, newName) => {
    setPlayers((prevPl) => ({
      ...prevPl,
      [symbol]: vsAI && symbol === 'O' ? 'AI' : newName,
    }));
  };  

  const handleSquareSelection = useCallback((rowIndex, colIndex) => {
    if (gameBoard[rowIndex][colIndex] || winner) return;

    setGameTrns((prevTrns) => [
      ...prevTrns,
      {
        square: { row: rowIndex, col: colIndex },
        player: activePlayer,
      },
    ]);
  }, [activePlayer, gameBoard, winner]);

  useEffect(() => {
    if (vsAI && activePlayer === 'O' && !winner && !isDraw) {
      //Delay AI move to simulate thinking
      setTimeout(() => {
        const availableSpots = gameBoard.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (cell === null ? { row: rowIndex, col: colIndex } : null))
        ).filter(Boolean);

        if (availableSpots.length > 0) {
          const randomMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
          handleSquareSelection(randomMove.row, randomMove.col);
        }
      }, 500);
    }
  }, [gameTrns, vsAI, activePlayer, winner, isDraw, gameBoard, handleSquareSelection]);

  return (
    <main>
      <div id="game-container">
        {!gameStarted ? (
          <>
            <RollDice
              setStartingPlayer={setStartingPlayer}
              setGameStarted={setGameStarted}
            />
            <button id="vs-ai-btn" onClick={() => { playSound(true); setVsAI(true); setGameStarted(true); }}>Play vs AI</button>
          </>
        ) : (
          <>
            <ol id="players" className="highlight-player">
              <Player
                initialName={players.X}
                symbol="X"
                isActivePl={activePlayer === "X"}
                nameChange={handlePlNameChange}
                disableEdit={false}
              />
              <div id="vite-div">
                <h1 className="logo">S</h1>
                <img src="vite.svg" alt="vite-logo" />
              </div>
              <Player
                initialName={vsAI ? "AI" : players.O}
                symbol="O"
                isActivePl={activePlayer === "O"}
                nameChange={handlePlNameChange}
                disableEdit={vsAI}
              />
            </ol>
            {(winner || isDraw) && (
              <GameOver winner={winner} restart={restart} players={players} vsAI={vsAI} />
            )}
            <GameBoard selectedSqr={handleSquareSelection} board={gameBoard} />
            {vsAI && activePlayer === 'O' && (
              <AI
                board={gameBoard}
                aiPlayer="O"
                humanPlayer="X"
                handleSquareSelection={handleSquareSelection}
              />
            )}
          </>
        )}
      </div>
      <Log turns={gameTrns} />
    </main>
  );
}

export default App;