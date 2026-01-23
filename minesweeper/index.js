// GAME CONSTANTS
const CELL_EMPTY = 0;
const CELL_BOMB = -1;

// GAME SETTINGS
const GRID_SIZE = 9;
const NUM_BOMB = 10;


const htmlGrid = document.getElementById("grid");
const gameGrid = Array.from({ length: 9 }, () =>
    Array(9).fill(CELL_EMPTY)
);

// HELPER FUNCTIONS

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getHtmlCell(grid, row, col) {
    return grid.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );
}

function getHtmlCellValue(grid, row, col) {
    return getHtmlCell(grid, row, col).textContent;
}

function isHtmlCellOpen(grid, row, col) {
    return !(getHtmlCell(grid, row, col).classList.contains('cell-closed'));
}


function setHtmlCell(grid, row, col, value) {
    const cell = getHtmlCell(grid, row, col);
    cell.classList.remove("cell-closed");
    if (cell) {
        if (value == CELL_BOMB) {
            const img = document.createElement('img');
            img.src = './img/grenade.png';
            cell.appendChild(img);
        }
        else if (value == CELL_EMPTY) {
            cell.textContent = ' ';

        }
        else {
            cell.textContent = value;
        }

    }
}

//  GAME FUNCTIONS

function createHtmlGrid(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.className = "cell cell-closed";
            cell.dataset.row = row;
            cell.dataset.col = col;


            // const img = document.createElement("img");
            // const items = ['question.png', 'flag.png', 'grenade.png', 'explosion.gif'];
            // const randomItem = items[Math.floor(Math.random() * items.length)];


            // img.src = './img/' + randomItem;

            // cell.appendChild(img);

            // cell.innerText = "1";

            grid.appendChild(cell);
        }
    }

}


function fillGameGrid(grid) {
    let bombsPlaced = 0;

    while (bombsPlaced < 10) {
        const row = getRandomNumber(0, GRID_SIZE - 1);
        const col = getRandomNumber(0, GRID_SIZE - 1);

        if (grid[row][col] == CELL_EMPTY) {
            grid[row][col] = CELL_BOMB;
            bombsPlaced += 1;
        }

    }


    const neighborPositons = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]

    ];

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            if (grid[i][j] == CELL_BOMB) {

                for (const pos of neighborPositons) {
                    if (
                        !(i + pos[0] < 0 || i + pos[0] >= GRID_SIZE || j + pos[1] < 0 || j + pos[1] >= GRID_SIZE)) {
                        if (grid[i + pos[0]][j + pos[1]] != CELL_BOMB) {

                            grid[i + pos[0]][j + pos[1]] = grid[i + pos[0]][j + pos[1]] + 1;
                        }

                    }
                }
            }

        }
    }



}

function fillHtmlGrid(htmlGrid, gameGrid) {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            setHtmlCell(htmlGrid, i, j, gameGrid[i][j]);
        }
    }
}


// FloodFill(x, y, targetColor, fillColor):
//     If the pixel at (x, y) is not targetColor or is already fillColor:
//         Return
//     Set the pixel at (x, y) to fillColor
//     FloodFill(x+1, y, targetColor, fillColor)  // Right
//     FloodFill(x-1, y, targetColor, fillColor)  // Left
//     FloodFill(x, y+1, targetColor, fillColor)  // Down
//     FloodFill(x, y-1, targetColor, fillColor)  // Up

function openElements(htmlGrid, gameGrid, i, j, isEmpty) {

    i = Number(i);
    j = Number(j);

    if (i < 0 || i >= GRID_SIZE || j < 0 || j >= GRID_SIZE) {
        return;
    }

    if ((gameGrid[i][j] != CELL_EMPTY && !isEmpty) || isHtmlCellOpen(htmlGrid, i, j)) {
        return;
    }

    setHtmlCell(htmlGrid, i, j, gameGrid[i][j]);




    openElements(htmlGrid, gameGrid, i + 1, j, gameGrid[i][j] == CELL_EMPTY);
    openElements(htmlGrid, gameGrid, i - 1, j, gameGrid[i][j] == CELL_EMPTY);
    openElements(htmlGrid, gameGrid, i, j + 1, gameGrid[i][j] == CELL_EMPTY);
    openElements(htmlGrid, gameGrid, i, j - 1, gameGrid[i][j] == CELL_EMPTY);

}


function openBombCells(htmlGrid, gameGrid) {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameGrid[i][j] == CELL_BOMB) {
                setHtmlCell(htmlGrid, i, j, CELL_BOMB);
            }
        }
    }
}

function setHtmlBombtoExplosion(htmlGrid, gameGrid) {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameGrid[i][j] == CELL_BOMB) {
                const cell = getHtmlCell(htmlGrid, i, j);
                const img = cell.querySelector("img");
                img.src = "./img/explosion.gif";
            }

        }
    }
}

function checkWin(htmlGrid, gameGrid) {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameGrid[i][j] != CELL_BOMB && !isHtmlCellOpen(htmlGrid, i, j))
                return false;

        }
    }

    return true;
}


function onCellClick(event) {
    const cell = event.currentTarget;
    cellClickHandle(cell);
}


function removeCellClickHandle() {
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.removeEventListener("click", onCellClick);
    });
}



function cellClickHandle(cell) {
    let i = Number(cell.dataset.row);
    let j = Number(cell.dataset.col);
    if (gameGrid[i][j] == CELL_BOMB) {
        openBombCells(htmlGrid, gameGrid);
        alert("You Loose!");
        removeCellClickHandle();


        setHtmlBombtoExplosion(htmlGrid, gameGrid);

        let sound = new Audio('./audio/bomb.mp3');
        sound.loop = true;
        sound.play();
    }
    else {
        openElements(htmlGrid, gameGrid, i, j, true);
        if (checkWin(htmlGrid, gameGrid)) {
            openBombCells(htmlGrid, gameGrid)
            alert("You Win!");
            removeCellClickHandle();


        }
    }
}



// FUNCTION CALL


createHtmlGrid(htmlGrid);
fillGameGrid(gameGrid);





// fillHtmlGrid(htmlGrid, gameGrid);


document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", onCellClick);
});


