import PropTypes from "prop-types";
import { useRef, useEffect} from "react";
import soundEffect from '/start-sound-effect.mp3';

export default function GameOver({ winner, restart, players, vsAI }) {

  const player2Name = vsAI ? "AI" : players.O;
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(soundEffect);
  }, []);

  const playSound = () => {
    if (audioRef.current) {
        audioRef.current.play();
    }
  };

  return (
    <div id="game-over">
      <h2>🎮GAME❌OVER!🎮</h2>
      {winner && <p>{winner} won!</p>}
      {!winner && <p>It&#39;s a draw!</p>}
      <div className="loader">
        <div className="outer"></div>
        <div className="middle"></div>
        <div className="inner"></div>
      </div>
      <p>
        <button onClick={() => {
          playSound(); 
          restart(); 
        }}>
          Rematch!
        </button>
      </p>
      <div>
        <p>Player 1: {players.X}</p>
        <p>Player 2: {player2Name}</p>
      </div>
    </div>
  );
}

GameOver.propTypes = {
  winner: PropTypes.string,
  restart: PropTypes.func.isRequired,
  players: PropTypes.object.isRequired,
  vsAI: PropTypes.bool.isRequired,
};