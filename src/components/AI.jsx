import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { WINNING_COMBINATIONS } from "../winning-combinations.js";

export default function AI({ board, aiPlayer, humanPlayer, handleSquareSelection, isAITurn }) {
  
  const getAvailableSpots = useCallback((board) => {
    const availableSpots = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === null) {
          availableSpots.push({ row, col });
        }
      }
    }
    return availableSpots;
  }, []);

  const checkWinner = useCallback((board) => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a.row][a.col] && board[a.row][a.col] === board[b.row][b.col] && board[a.row][a.col] === board[c.row][c.col]) {
        return board[a.row][a.col];
      }
    }
    return null;
  }, []);

  //Minimax algorithm for AI decision-making
  const minimax = useCallback((newBoard, depth, isMaximizing) => {
    const winner = checkWinner(newBoard);
    if (winner === aiPlayer) return { score: 10 - depth };
    if (winner === humanPlayer) return { score: depth - 10 };
    if (getAvailableSpots(newBoard).length === 0) return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = null;

      getAvailableSpots(newBoard).forEach(spot => {
        newBoard[spot.row][spot.col] = aiPlayer;
        const { score } = minimax(newBoard, depth + 1, false);
        newBoard[spot.row][spot.col] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = spot;
        }
      });

      return { score: bestScore, move: bestMove };
    } else {
      let worstScore = Infinity;
      let worstMove = null;

      getAvailableSpots(newBoard).forEach(spot => {
        newBoard[spot.row][spot.col] = humanPlayer;
        const { score } = minimax(newBoard, depth + 1, true);
        newBoard[spot.row][spot.col] = null;

        if (score < worstScore) {
          worstScore = score;
          worstMove = spot;
        }
      });

      return { score: worstScore, move: worstMove };
    }
  }, [aiPlayer, humanPlayer, getAvailableSpots, checkWinner]);

  useEffect(() => {
    if (isAITurn) {
      const availableSpots = getAvailableSpots(board);
      const currentWinner = checkWinner(board);

      if (availableSpots.length > 0 && currentWinner === null) {
        const { move } = minimax(board, 0, true);
        if (move) {
          handleSquareSelection(move.row, move.col);
        }
      }
    }
  }, [board, isAITurn, checkWinner, getAvailableSpots, handleSquareSelection, minimax]);

  return null; 
}

AI.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  aiPlayer: PropTypes.string.isRequired,
  humanPlayer: PropTypes.string.isRequired,
  handleSquareSelection: PropTypes.func.isRequired,
  isAITurn: PropTypes.bool.isRequired,
};