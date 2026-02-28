


import React, { useState, useEffect, useCallback } from "react";
import Snake from "./Snake";
import Food from "./Food";
import ScoreBoard from "./ScoreBoard";
import GameOver from "./GameOver";
import "../styles/board.css";

const GRID_SIZE = 20;

const generateFood = (snake) => {
  const emptyCells = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const isOnSnake = snake.some(
        (segment) => segment[0] === row && segment[1] === col
      );
      if (!isOnSnake) emptyCells.push([row, col]);
    }
  }

  if (emptyCells.length === 0) return [0, 0];

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

const Board = ({ algorithm, title }) => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState(generateFood([[5, 5]]));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState("RIGHT");

  const isManual = algorithm === "manual";

  const endpoint =
    algorithm === "astar"
      ? "https://snake-game-comparison.onrender.com/next-move-astar"
      : "https://snake-game-comparison.onrender.com/next-move-bfs";

  // 🎮 Keyboard Controls (Only for Manual)
  useEffect(() => {
    if (!isManual) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN")
        setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP")
        setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT")
        setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT")
        setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isManual]);

  const moveSnake = useCallback(async () => {
    if (gameOver) return;

    let move = direction;

    // 🤖 AI Mode → Call Backend
    if (!isManual) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snake, food }),
      });

      const data = await response.json();
      move = data.move;
    }

    let head = [...snake[0]];

    if (move === "UP") head[0]--;
    if (move === "DOWN") head[0]++;
    if (move === "LEFT") head[1]--;
    if (move === "RIGHT") head[1]++;

    // Collision detection (exclude tail)
    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= GRID_SIZE ||
      head[1] >= GRID_SIZE ||
      snake.slice(0, -1).some(
        (s) => s[0] === head[0] && s[1] === head[1]
      )
    ) {
      setGameOver(true);
      return;
    }

    setSnake((prevSnake) => {
      let newSnake = [head, ...prevSnake];

      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(generateFood(newSnake));
        setScore((prev) => prev + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [snake, food, gameOver, direction, endpoint, isManual]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const restartGame = () => {
    setSnake([[5, 5]]);
    setFood(generateFood([[5, 5]]));
    setGameOver(false);
    setScore(0);
    setDirection("RIGHT");
  };

  return (
    <div className="board-wrapper">
      <h2 className="board-title">{title}</h2>
      <ScoreBoard score={score} />
      <div className="board">
        <Snake snake={snake} />
        <Food food={food} />
        {gameOver && <GameOver restart={restartGame} />}
      </div>
    </div>
  );
};

export default Board;