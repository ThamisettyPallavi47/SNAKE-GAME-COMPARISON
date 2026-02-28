

import "./styles/App.css";
import Board from "./components/Board";

function App() {
  return (
    <div className="app-container">
      <h1 className="game-title">AI Snake Game Comparison 🐍</h1>

      <div className="boards-container">
        <Board algorithm="bfs" title="BFS Algorithm" />
        <Board algorithm="astar" title="A* Algorithm" />
        <Board algorithm="manual" title="Manual Snake" />
      </div>
    </div>
  );
}

export default App;