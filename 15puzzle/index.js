

let timer;
let seconds = 0;
let isPaused = false;

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            if (!isPaused) {
                seconds++;
                updateDisplay();
            }
        }, 1000);
    }
}


function updateDisplay() {
    let mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mins}:${secs}`;
}


function togglePause() {
    isPaused = !isPaused;

    const btn = document.getElementById("pauseBtn");
    if (isPaused) {
        btn.textContent = "Resume";
        // Optional: disable editing while paused
        colElements.forEach(col => col.removeEventListener("click", handleClick));

    } else {
        btn.textContent = "Pause";
        // Re-enable editing
        colElements.forEach(col => col.addEventListener("click", handleClick));

    }
}



const gridCon = document.getElementById("grid");
const rows = 4;
const cols = 4;


function generateGameGrid() {
    let numbers = Array.from({ length: 16 }, (_, i) => i);


    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }


    let matrix = [];
    let index = 0;

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push(numbers[index++]);
        }
        matrix.push(row);
    }
    return matrix;
}


function renderGrid(grid) {
    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {
            let col = document.createElement("div");
            col.classList.add("col");
            col.dataset.num = grid[i][j];
            col.style.top = `${i * 70 + i + 1}px`;
            col.style.left = `${j * 70 + j + 1}px`;

            if (grid[i][j] == 0) {
                col.classList.add("empty-col");
            } else {

                col.textContent = grid[i][j];
            }
            gridCon.appendChild(col);


        }
    }

}

function getIJ(grid, value) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === value) {
                return [i, j];
            }

        }
    }

    return [-1, -1];
}


function getEmptyColElement(nodeList) {
    for (const elem of nodeList) {
        if (elem.dataset.num == 0) {
            return elem;
        }
    }
    return null;
}


function checkWin(grid) {
    let expected = 1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if(i == 3 && j == 3){
                expected = 0;
            }
            if (grid[i][j] != expected) {
                return false;
            }
            expected++;

        }
    }

    return true;

}



const grid = generateGameGrid();
renderGrid(grid);

const colElements = document.querySelectorAll(".col");

function handleClick(e) {
    // for starting timer initially
    if(!timer){
        startTimer();
    }
    const [i, j] = getIJ(grid, parseInt(e.target.textContent));
    const [emptyI, emptyJ] = getIJ(grid, 0);

    const positions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ]

    for (p of positions) {
        if ((i + p[0]) == emptyI && (j + p[1]) == emptyJ) {
            [grid[i][j], grid[emptyI][emptyJ]] = [grid[emptyI][emptyJ], grid[i][j]];

            let emptyColElement = getEmptyColElement(colElements);


            let s1 = e.target.style.cssText;
            e.target.style.cssText = emptyColElement.style.cssText;
            emptyColElement.style.cssText = s1;


            break;
        }
    }


    if (checkWin(grid)) {
        colElements.forEach((col) => {
            col.removeEventListener("click", handleClick);
            document.getElementById("win").style.display = "flex";
        });
    }




}


colElements.forEach((col) => {
    col.addEventListener("click", handleClick);
});


