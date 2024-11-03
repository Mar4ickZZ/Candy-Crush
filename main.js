const SIZE = 11;
const EMPTY = 0;
const COLORS = [1, 2, 3, 4];

let matrix;

function generateRandomCandy() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function initializeMatrix() {
    matrix = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => generateRandomCandy()));
}

function printMatrix() {
    console.table(matrix);
}

function checkFormation() {
    let score = 0;

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (j <= SIZE - 3 && matrix[i][j] === matrix[i][j + 1] && matrix[i][j] === matrix[i][j + 2]) {
                score += 5;
                clearCandies(i, j, 0, 3);
            }
            if (j <= SIZE - 4 && matrix[i][j] === matrix[i][j + 1] && matrix[i][j] === matrix[i][j + 2] && matrix[i][j] === matrix[i][j + 3]) {
                score += 10;
                clearCandies(i, j, 0, 4);
            }
            if (j <= SIZE - 5 && matrix[i][j] === matrix[i][j + 1] && matrix[i][j] === matrix[i][j + 2] && matrix[i][j] === matrix[i][j + 3] && matrix[i][j] === matrix[i][j + 4]) {
                score += 50;
                clearCandies(i, j, 0, 5);
            }
            if (i <= SIZE - 3 && matrix[i][j] === matrix[i + 1][j] && matrix[i][j] === matrix[i + 2][j]) {
                score += 5;
                clearCandies(i, j, 1, 3);
            }
            if (i <= SIZE - 4 && matrix[i][j] === matrix[i + 1][j] && matrix[i][j] === matrix[i + 2][j] && matrix[i][j] === matrix[i + 3][j]) {
                score += 10;
                clearCandies(i, j, 1, 4);
            }
            if (i <= SIZE - 5 && matrix[i][j] === matrix[i + 1][j] && matrix[i][j] === matrix[i + 2][j] && matrix[i][j] === matrix[i + 3][j] && matrix[i][j] === matrix[i + 4][j]) {
                score += 50;
                clearCandies(i, j, 1, 5);
            }

            if (i <= SIZE - 3 && j <= SIZE - 2 && matrix[i][j] === matrix[i + 1][j] && matrix[i][j] === matrix[i + 2][j] && matrix[i][j] === matrix[i][j + 1]) {
                score += 15;
                clearCandies(i, j, 2);
            }
            if (i <= SIZE - 3 && j >= 1 && matrix[i][j] === matrix[i + 1][j] && matrix[i][j] === matrix[i + 2][j] && matrix[i][j] === matrix[i][j - 1]) {
                score += 15;
                clearCandies(i, j, 2);
            }
            if (i >= 2 && j <= SIZE - 2 && matrix[i][j] === matrix[i - 1][j] && matrix[i][j] === matrix[i - 2][j] && matrix[i][j] === matrix[i][j + 1]) {
                score += 15;
                clearCandies(i, j, 2);
            }
            if (i >= 2 && j >= 1 && matrix[i][j] === matrix[i - 1][j] && matrix[i][j] === matrix[i - 2][j] && matrix[i][j] === matrix[i][j - 1]) {
                score += 15;
                clearCandies(i, j, 2);
            }

            if (i <= SIZE - 2 && j <= SIZE - 3 && matrix[i][j] === matrix[i][j + 1] && matrix[i][j] === matrix[i][j + 2] && matrix[i][j] === matrix[i + 1][j + 1]) {
                score += 15;
                clearCandies(i, j, 2);
            }
            if (i >= 1 && j <= SIZE - 3 && matrix[i][j] === matrix[i][j + 1] && matrix[i][j] === matrix[i][j + 2] && matrix[i][j] === matrix[i - 1][j + 1]) {
                score += 15;
                clearCandies(i, j, 2);
            }
        }
    }
    return score;
}

function clearCandies(row, col, direction, length = 3) {
    if (direction === 0) {
        for (let j = col; j < col + length; j++) {
            matrix[row][j] = EMPTY;
        }
    } else if (direction === 1) {
        for (let i = row; i < row + length; i++) {
            matrix[i][col] = EMPTY;
        }
    } else if (direction === 2) {
        matrix[row][col] = EMPTY;
        if (matrix[row + 1] && matrix[row + 1][col] !== undefined) matrix[row + 1][col] = EMPTY;
        if (matrix[row - 1] && matrix[row - 1][col] !== undefined) matrix[row - 1][col] = EMPTY;
        if (matrix[row][col + 1] !== undefined) matrix[row][col + 1] = EMPTY;
        if (matrix[row][col - 1] !== undefined) matrix[row][col - 1] = EMPTY;
    }
    dropCandies();
}


function dropCandies() {
    for (let j = 0; j < SIZE; j++) {
        for (let i = SIZE - 1; i >= 0; i--) {
            if (matrix[i][j] === EMPTY) {
                for (let k = i; k > 0; k--) {
                    matrix[k][j] = matrix[k - 1][j];
                }
                matrix[0][j] = generateRandomCandy();
            }
        }
    }
}

function swapCandies(i1, j1, i2, j2) {
    let temp = matrix[i1][j1];
    matrix[i1][j1] = matrix[i2][j2];
    matrix[i2][j2] = temp;
}

function findSwap() {
    for (let i = 0; i < SIZE - 1; i++) {
        for (let j = 0; j < SIZE - 1; j++) {
            swapCandies(i, j, i, j + 1);
            if (checkFormation() > 0) return true;
            swapCandies(i, j, i, j + 1);

            swapCandies(i, j, i + 1, j);
            if (checkFormation() > 0) return true;
            swapCandies(i, j, i + 1, j);
        }
    }
    return false;
}

function playGame() {
    initializeMatrix();
    let score = 0;
    let swaps = 0;
    let newFormations;

    do {
        newFormations = checkFormation();
        score += newFormations;
        while (newFormations > 0) {
            dropCandies();
            newFormations = checkFormation();
            score += newFormations;
        }
        if (findSwap()) swaps++;
    } while (score < 10000 && findSwap());

    return { score, swaps };
}

function startGame() {
    let totalScore = 0;
    let totalSwaps = 0;
    let games = 100;

    for (let i = 0; i < games; i++) {
        let result = playGame();
        totalScore += result.score;
        totalSwaps += result.swaps;

        console.log(`Игра ${i + 1}: Очки = ${result.score}, Количество попыток = ${result.swaps}`);
    }

    let averageScore = totalScore / games;
    let averageSwaps = totalSwaps / games;

    document.getElementById("result").textContent = `Scor mediu: ${averageScore.toFixed(2)}, Schimbări medii: ${averageSwaps.toFixed(2)}`;
}