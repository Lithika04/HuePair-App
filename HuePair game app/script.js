
let gridSize = 4;
let remainingMoves = 30;
let matchedPairs = 0;
let firstSelected = null;
let secondSelected = null;
let colors = [];
let currentLevel = 1;

const levelConfig = {
  1: { size: 4, moves: 30 },
  2: { size: 5, moves: 40 },
  3: { size: 6, moves: 50 }
};

function startGame(level) {
  currentLevel = level;
  const config = levelConfig[level];
  gridSize = config.size;
  remainingMoves = config.moves;
  matchedPairs = 0;
  firstSelected = null;
  secondSelected = null;
  colors = generateColors(gridSize);

  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("main-menu").classList.add("hidden");

  document.getElementById("level-info").textContent = `Level ${level}`;
  updateMovesDisplay();
  generateGrid(gridSize);
}

function generateColors(size) {
  const numPairs = (size * size) / 2;
  const baseColors = [
    "red", "blue", "green", "yellow", "orange", "purple",
    "pink", "brown", "cyan", "lime", "teal", "indigo",
    "gold", "magenta", "gray", "navy"
  ];
  const selectedColors = shuffle(baseColors).slice(0, numPairs);
  return shuffle([...selectedColors, ...selectedColors]);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateGrid(size) {
  const grid = document.getElementById("game-grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.color = colors[i];
    cell.addEventListener("click", () => handleClick(cell));
    grid.appendChild(cell);
  }
}

function handleClick(cell) {
  if (cell.classList.contains("matched") || cell === firstSelected) return;
  if (remainingMoves <= 0) return;

  cell.style.backgroundColor = cell.dataset.color;
  cell.classList.add("selected");

  if (!firstSelected) {
    firstSelected = cell;
  } else {
    secondSelected = cell;
    remainingMoves--;
    updateMovesDisplay();
    checkMatch();
  }
}

function checkMatch() {
  if (firstSelected.dataset.color === secondSelected.dataset.color) {
    firstSelected.classList.add("matched");
    secondSelected.classList.add("matched");
    matchedPairs++;

    if (matchedPairs === (gridSize * gridSize) / 2) {
      setTimeout(() => alert(`🎉 Level ${currentLevel} Completed!`), 200);
    }

    firstSelected = null;
    secondSelected = null;
  } else {
    setTimeout(() => {
      firstSelected.style.backgroundColor = "#ccc";
      secondSelected.style.backgroundColor = "#ccc";
      firstSelected.classList.remove("selected");
      secondSelected.classList.remove("selected");
      firstSelected = null;
      secondSelected = null;
    }, 600);
  }
}

function updateMovesDisplay() {
  document.getElementById("moves").textContent = `Moves Left: ${remainingMoves}`;
  if (remainingMoves === 0 && matchedPairs < (gridSize * gridSize) / 2) {
    setTimeout(() => alert("❌ Out of moves! Try again."), 100);
  }
}

function restartGame() {
  startGame(currentLevel);
}

function goToMenu() {
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}
