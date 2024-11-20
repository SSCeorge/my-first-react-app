import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import soundEffect from '/start-sound-effect.mp3';

export default function RollDice({ setStartingPlayer, setGameStarted }) {
  const [startingPlayer, setStartingPlayerState] = useState(null);
  const [animate, setAnimate] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(soundEffect);
  }, []);

  const playSound = () => {
    if (audioRef.current) {
        audioRef.current.play();
    }
  };

  const handleClick = () => {
    playSound();
    setAnimate(true);
    setTimeout(() => {
      const player = Math.random() < 0.5 ? 'X' : 'O';
      setStartingPlayerState(player);
      setStartingPlayer(player);
      setAnimate(false);
      setGameStarted(true); 
    }, 3000);
  };

  return (
    <div id='roll-dice'>
      <button id='roll-btn' onClick={handleClick}>Roll to Start</button>
      {startingPlayer && <p>{startingPlayer === 'X' ? 'Player 1' : 'Player 2'} will start!</p>}
      <div className="container">
        <div className="wrap">
          <div className={`cube ${animate ? 'animate' : ''}`}>
            <div className="front side">
              <h2>1</h2>
            </div>
            <div className="back side">
              <h2>2</h2>
            </div>
            <div className="top side">
              <h2>3</h2>
            </div>
            <div className="bottom side">
              <h2>4</h2>
            </div>
            <div className="left side">
              <h2>5</h2>
            </div>
            <div className="right side">
              <h2>6</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RollDice.propTypes = {
  setStartingPlayer: PropTypes.func.isRequired,
  setGameStarted: PropTypes.func.isRequired
}