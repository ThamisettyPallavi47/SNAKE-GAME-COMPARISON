const GameOver = ({ restart }) => {
  return (
    <div className="game-over">
      <p>Game Over!</p>
      <button className="game-button" onClick={restart}>
        Restart
      </button>
    </div>
  );
};

export default GameOver;