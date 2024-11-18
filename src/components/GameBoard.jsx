import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

export default function GameBoard({ selectedSqr, board }) {
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('./src/assets/button-push-chunky.mp3');
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return (
        <ol id="game-board">
            {board.map((row, rowIndex) => (
                <li key={rowIndex}>
                    <ol>
                        {row.map((playerSymbol, colIndex) => (
                            <li key={colIndex}>
                                <button
                                    onClick={() => {
                                        playSound(); 
                                        selectedSqr(rowIndex, colIndex); 
                                    }}
                                    disabled={playerSymbol !== null}
                                >
                                    {playerSymbol}
                                </button>
                            </li>
                        ))}
                    </ol>
                </li>
            ))}
        </ol>
    );
}

GameBoard.propTypes = {
    selectedSqr: PropTypes.func.isRequired,
    board: PropTypes.array.isRequired,
};