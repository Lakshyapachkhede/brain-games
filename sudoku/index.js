// HTML FUNCTIONS
function getCell(i, j) {
    const row = document.getElementsByTagName("tr")[i];
    const col = row.getElementsByTagName("td")[j];

    return col;
}

function setCellValue(i, j, value) {
    getCell(i, j).innerText = value;
}

function getCellValue(i, j) {
    return getCell(i, j).innerText;

}

function toogleCellAsActive(i, j) {
    getCell(i, j).classList.toggle("cell-active");
}

function addCellError(i, j) {
    getCell(i, j).classList.add("cell-error");

}

function removeCellError(i, j) {
    getCell(i, j).classList.remove("cell-error");

}

function setCellBackgroundGray(i, j) {
    getCell(i, j).classList.add("cell-grey");

}

function fillCells(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                setCellValue(i, j, grid[i][j]);
                setCellBackgroundGray(i, j);
            }

        }
    }
}



// HTML FUNCTIONS END



// SUDOKU GENERATOR FUNCTIONS

function unUsedInRow(grid, i, value) {

    for (let j = 0; j < 9; j++) {
        if (grid[i][j] == value) {
            return false;
        }
    }

    return true;
}


function unUsedInCol(grid, j, value) {

    for (let i = 0; i < 9; i++) {
        if (grid[i][j] == value) {
            return false;
        }
    }

    return true;

}

function unUsedInBox(grid, iStart, jStart, value) {

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            if (grid[iStart + i][jStart + j] == value) {
                return false;
            }
        }

    }

    return true;

}

function checkIfSafe(grid, i, j, value) {
    return unUsedInRow(grid, i, value) && unUsedInCol(grid, j, value) && unUsedInBox(grid, i - (i % 3), j - (j % 3), value)
}

function fillBoxRandomlyWithoutCheck(grid, row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!unUsedInBox(grid, row, col, num));
            grid[row + i][col + j] = num;
        }
    }
}

function fillDiagonal(grid) {
    for (let i = 0; i < 9; i += 3) {
        fillBoxRandomlyWithoutCheck(grid, i, i);
    }
}

function fillRemaining(grid, i, j) {
    if (i == 9) {
        return true;
    }

    if (j == 9) {
        return fillRemaining(grid, i + 1, 0);
    }

    if (grid[i][j] !== 0) {
        return fillRemaining(grid, i, j + 1);
    }


    for (let num = 1; num <= 9; num++) {
        if (checkIfSafe(grid, i, j, num)) {
            grid[i][j] = num;
            if (fillRemaining(grid, i, j + 1)) {
                return true;
            }

            grid[i][j] = 0;

        }

    }

    return false;

}

function removeKDigits(grid, k) {
    while (k > 0) {

        let cellId = Math.floor(Math.random() * 81);


        let i = Math.floor(cellId / 9);

        let j = cellId % 9;


        if (grid[i][j] !== 0) {
            grid[i][j] = 0;
            k--;
        }
    }

}



function sudokuGridGenerator(k) {
    let grid = Array(9).fill(0).map(() => new Array(9).fill(0));

    fillDiagonal(grid);

    fillRemaining(grid, 0, 0);

    let solvedGrid = grid.map(row => [...row]);

    removeKDigits(grid, k);

    return [solvedGrid, grid];

}


function checkWin(solvedGrid, sudokuGrid) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (solvedGrid[i][j] != sudokuGrid[i][j]) {
                return false;
            }
        }

    }


    return true;

}



// SUDOKU GENERATOR FUNCTIONS END


const [solvedGrid, sudokuGrid] = sudokuGridGenerator(40);

const initialEmptyPositions = []

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        if (sudokuGrid[i][j] == 0) {
            initialEmptyPositions.push((i * 9) + j)
        }
    }
}



let activeCellIndex = null;
let mistakes = 0;
const input = document.getElementsByTagName("input")[0];

fillCells(sudokuGrid);




document.querySelectorAll("td").forEach((td, index) => {
    td.addEventListener("click", () => {
        document.querySelectorAll("td").forEach((t) => {
            t.classList.remove("cell-active");
        })
        activeCellIndex = index;

        td.classList.add("cell-active");

        input.focus()


    })
});


input.addEventListener("input", (e) => {
    if (activeCellIndex !== null && activeCellIndex !== undefined) {
        const value = parseInt(e.target.value, 10);
        if ((value > 0 && value <= 9) && initialEmptyPositions.includes(activeCellIndex)) {
            const i = Math.floor(activeCellIndex / 9), j = activeCellIndex % 9;
            setCellValue(i, j, e.target.value);
            sudokuGrid[i][j] = value;

            if (sudokuGrid[i][j] !== solvedGrid[i][j]) {
                addCellError(i, j);
                mistakes++;
                document.getElementById("mistakes").innerText = mistakes;
                if (mistakes >= 5) {
                    window.alert("Game Over!");
                    document.getElementById("win").style.display = "flex";
                    document.querySelector("#win .win").innerText = "Game Over!";

 

                }
            } else {
                removeCellError(i, j);
            }


            if (checkWin(solvedGrid, sudokuGrid)) {
                document.getElementById("win").style.display = "flex";
                window.alert("You Win!");

  

            }



        }
    }

    input.value = null;
});

