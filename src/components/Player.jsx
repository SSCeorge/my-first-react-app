import { useState } from "react";
import PropTypes from "prop-types";

export default function Player({ initialName, symbol, isActivePl, nameChange, disableEdit }) {
  const [edit, setEdit] = useState(false);
  const [playersName, setPlayersName] = useState(initialName);

  function handleClick() {
    if (!disableEdit) {
      setEdit((editing) => !editing);
      if (edit) {
        nameChange(symbol, playersName);
      }
    }
  }

  function handleNameChange(e) {
    setPlayersName(e.target.value);
  }

  let playerName = <span className="player-name">{playersName}</span>;

  if (edit) {
    playerName = <input type="text" required value={playersName} onChange={handleNameChange} />;
  }

  return (
    <li className={isActivePl ? "active" : undefined}>
      <span className="player-symbol">{symbol}</span>
      <span className="player">
        {playerName}
      </span>
      <button onClick={handleClick} disabled={disableEdit}>{edit ? "SAVE" : "EDIT NAME"}</button>
    </li>
  );
}

Player.propTypes = {
  initialName: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  isActivePl: PropTypes.bool.isRequired,
  nameChange: PropTypes.func.isRequired,
  disableEdit: PropTypes.bool.isRequired,
};