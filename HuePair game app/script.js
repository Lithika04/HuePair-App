let remainingMoves = 30;
let matchedPairs = 0;
let firstSelected = null;
let secondSelected = null;
let colors = [];
let currentLevel = 1;
let gridRows, gridCols;

const levelConfig = {
  1: { rows: 4, cols: 4, moves: 30 },  // 4x4
  2: { rows: 4, cols: 6, moves: 40 },  // 6x4 ✅ New Grid
  3: { rows: 6, cols: 6, moves: 50 }   // 6x6
};

function startGame(level) {
  currentLevel = level;
  const config = levelConfig[level];

  gridRows = config.rows;
  gridCols = config.cols;
  remainingMoves = config.moves;
  matchedPairs = 0;
  firstSelected = null;
  secondSelected = null;

  const totalCells = gridRows * gridCols;
  colors = generateColors(totalCells);

  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("main-menu").classList.add("hidden");

  document.getElementById("level-info").textContent = `Level ${level}`;
  updateMovesDisplay();
  generateGrid();
}

function generateColors(totalCells) {
  const numPairs = totalCells / 2;
  const baseColors = [
    "red", "blue", "green", "yellow", "orange", "purple",
    "pink", "brown", "cyan", "lime", "teal", "indigo",
    "gold", "magenta", "gray", "navy", "coral", "aqua",
    "violet", "olive", "chocolate", "maroon", "silver"
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

function generateGrid() {
  const grid = document.getElementById("game-grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${gridCols}, 60px)`;

  for (let i = 0; i < gridRows * gridCols; i++) {
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

    const totalPairs = (gridRows * gridCols) / 2;
    if (matchedPairs === totalPairs) {
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
  const totalPairs = (gridRows * gridCols) / 2;

  if (remainingMoves === 0 && matchedPairs < totalPairs) {
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
