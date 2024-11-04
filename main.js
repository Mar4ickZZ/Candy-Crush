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
    const toClear = [];

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            score += checkMatch(i, j, 5, 'horizontal', toClear);
            score += checkMatch(i, j, 5, 'vertical', toClear);
            score += checkMatch(i, j, 4, 'horizontal', toClear);
            score += checkMatch(i, j, 4, 'vertical', toClear);
            score += checkMatch(i, j, 3, 'horizontal', toClear);
            score += checkMatch(i, j, 3, 'vertical', toClear);
            score += checkSpecialFormations(i, j, toClear);
        }
    }

    toClear.forEach(([row, col]) => matrix[row][col] = EMPTY);
    return score;
}

function checkMatch(row, col, length, direction, toClear) {
    if (direction === 'horizontal' && col <= SIZE - length) {
        if (matrix[row].slice(col, col + length).every(cell => cell === matrix[row][col])) {
            for (let j = col; j < col + length; j++) {
                toClear.push([row, j]);
            }
            return length === 5 ? 50 : length === 4 ? 10 : 5;
        }
    } else if (direction === 'vertical' && row <= SIZE - length) {
        if (Array.from({ length }, (_, k) => matrix[row + k][col]).every(cell => cell === matrix[row][col])) {
            for (let i = row; i < row + length; i++) {
                toClear.push([i, col]);
            }
            return length === 5 ? 50 : length === 4 ? 10 : 5;
        }
    }
    return 0;
}

function checkSpecialFormations(row, col, toClear) {
    let score = 0;
    if (row <= SIZE - 3 && col <= SIZE - 2 && matrix[row][col] === matrix[row + 1][col] && matrix[row][col] === matrix[row + 2][col] && matrix[row][col] === matrix[row][col + 1]) {
        toClear.push([row, col], [row + 1, col], [row + 2, col], [row, col + 1]);
        score += 15;
    }
    if (row <= SIZE - 3 && col >= 1 && matrix[row][col] === matrix[row + 1][col] && matrix[row][col] === matrix[row + 2][col] && matrix[row][col] === matrix[row][col - 1]) {
        toClear.push([row, col], [row + 1, col], [row + 2, col], [row, col - 1]);
        score += 15;
    }

    return score;
}

function dropCandies() {
    for (let j = 0; j < SIZE; j++) {
        let emptyCount = 0;
        for (let i = SIZE - 1; i >= 0; i--) {
            if (matrix[i][j] === EMPTY) {
                emptyCount++;
            } else if (emptyCount > 0) {
                matrix[i + emptyCount][j] = matrix[i][j];
                matrix[i][j] = EMPTY;
            }
        }
        for (let i = 0; i < emptyCount; i++) {
            matrix[i][j] = generateRandomCandy();
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

        console.log(`Jocul ${i + 1}: Score = ${result.score}, Schimbări = ${result.swaps}`);
    }

    let averageScore = totalScore / games;
    let averageSwaps = totalSwaps / games;

    document.getElementById("result").textContent = `Medie score: ${averageScore.toFixed(2)}, Medie schimbări: ${averageSwaps.toFixed(2)}`;
}
