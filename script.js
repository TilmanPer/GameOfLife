
const gridContainer = document.getElementById('grid');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const clearButton = document.getElementById('clearBtn');
const randomButton = document.getElementById('randomBtn');
const showGridButton = document.getElementById('showGridBtn');
const genCounter = document.getElementById('generation');
const populationCounter = document.getElementById('population');
const showMoreBtn = document.getElementById('showMoreBtn');
const expandableContent = document.getElementById('expandable');
const speedSlider = document.getElementById('speedSlider');

const gliderBtn = document.getElementById('gliderBtn');
const pulsarBtn = document.getElementById('pulsarBtn');
const blinkerBtn = document.getElementById('blinkerBtn');

const toadBtn = document.getElementById('toadBtn');
const spaceshipBtn = document.getElementById('spaceshipBtn');
const gliderFactoryBtn = document.getElementById('gliderFactoryBtn');

let cells = [];
let timer;
let simulationRunning = false;
let fieldSize = 65;
let generation = 0;
let speed = 100;

document.addEventListener('DOMContentLoaded', () => {
    gridContainer.style.gridTemplateColumns = `repeat(${fieldSize}, 20px)`;
    gridContainer.style.gridTemplateRows = `repeat(${fieldSize}, 20px)`;
});

function fillRandom() {
    clearGrid();
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (Math.random() < 0.5) {
                cells[i][j].classList.add('alive');
            }
        }
    }
    updateCounters();
}

function createGrid() {
    for (let i = 0; i < fieldSize; i++) {
        let row = [];
        for (let j = 0; j < fieldSize; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('mousedown', toggleCellState);
            //drag and draw
            cell.addEventListener('mouseover', (event) => {
                if (event.buttons === 1) {
                    toggleCellState(event);
                }
            });
            row.push(cell);
        }
        cells.push(row);
    }

    // Append cells to the grid container
    cells.forEach(row => {
        row.forEach(cell => {
            gridContainer.appendChild(cell);
        });
    });
}

function toggleCellState(event) {
    const target = event.target;
    if (target.classList.contains('cell')) {
        target.classList.toggle('alive');
    }
    updateCounters();
}

function updateGrid() {
    generation++;
    const cellsToToggle = [];
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            const cell = cells[i][j];
            const neighbors = countAliveNeighbors(i, j);

            if (cell.classList.contains('alive')) {
                if (neighbors < 2 || neighbors > 3) {
                    cellsToToggle.push(cell);
                }
            } else {
                if (neighbors === 3) {
                    cellsToToggle.push(cell);
                }
            }
        }
    }
    cellsToToggle.forEach(cell => {
        cell.classList.toggle('alive');
    });

    updateCounters();
}


function countAliveNeighbors(x, y) {
    let count = 0;
    const offsets = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], /* cell */[1, 0],
        [-1, 1], [0, 1], [1, 1]
    ];

    for (const offset of offsets) {
        const offsetX = x + offset[0];
        const offsetY = y + offset[1];

        if (offsetX >= 0 && offsetX < cells.length && offsetY >= 0 && offsetY < cells[x].length) {
            if (cells[offsetX][offsetY].classList.contains('alive')) {
                count++;
            }
        }
    }
    return count;
}

function startSimulation() {
    if (!simulationRunning) {
        simulationRunning = true;
        timer = setInterval(updateGrid, speed);
        startButton.classList.add('active');
        stopButton.classList.remove('active');
    }
}

function stopSimulation() {
    if (simulationRunning) {
        simulationRunning = false;
        clearInterval(timer);
        startButton.classList.remove('active');
        stopButton.classList.add('active');
    }
}

function updateCounters() {
    genCounter.textContent = generation;
    populationCounter.textContent = document.querySelectorAll('.alive').length;
}

function clearGrid() {
    stopSimulation();
    gridContainer.querySelectorAll('.alive').forEach(cell => {
        cell.classList.remove('alive');
    });
    stopButton.classList.remove('active');
    generation = 0;
    updateCounters();
}

function toggleGrid() {
    showGridButton.classList.toggle('active');
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.toggle('grid__enabled');
    }
    );
}

function toggleExpandable() {
    showMoreBtn.innerText = showMoreBtn.innerText === 'show more' ? 'show less' : 'show more';
    expandableContent.classList.toggle('expanded');
}

function changeSpeed() {
    let inputValue = document.getElementById('speedSlider').value;
    let step;

    if (inputValue <= 125) {
        step = 50;
    } else if (inputValue <= 250) {
        step = 25;
    } else if (inputValue <= 375) {
        step = 10;
    } else {
        step = 5;
    }

    speed = 1 + 500 - (step * Math.ceil(inputValue / step));

    stopSimulation();
    startSimulation();
}



function spawnConstruct(construct) {
    construct.forEach(cell => {
        cells[cell[0]][cell[1]].classList.add('alive');
    });
}

// Event listeners for buttons
startButton.addEventListener('click', startSimulation);
stopButton.addEventListener('click', stopSimulation);
clearButton.addEventListener('click', clearGrid);
randomButton.addEventListener('click', fillRandom);
showGridButton.addEventListener('click', toggleGrid);
showMoreBtn.addEventListener('click', toggleExpandable);

gliderBtn.addEventListener('click', () => spawnConstruct(constructs.glider));
pulsarBtn.addEventListener('click', () => spawnConstruct(constructs.pulsar));
blinkerBtn.addEventListener('click', () => spawnConstruct(constructs.blinker));

toadBtn.addEventListener('click', () => spawnConstruct(constructs.toad));
spaceshipBtn.addEventListener('click', () => spawnConstruct(constructs.spaceship));
gliderFactoryBtn.addEventListener('click', () => spawnConstruct(constructs.gliderFactory));

// Event listeners for keys
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault();
        simulationRunning ? stopSimulation() : startSimulation();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'c') {
        clearGrid();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        fillRandom();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'g') {
        toggleGrid();
    }
});

// Initialize the grid
createGrid();
changeSpeed();
stopSimulation();