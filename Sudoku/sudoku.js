var arr = [];

// Populate arr with references to each cell element based on their IDs
for (var i = 0; i < 9; i++) {
    arr[i] = [];
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = [];

// Function to fill the HTML grid with the current state of the Sudoku board
function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
            }
        }
    }
}

// GetPuzzle button click handler
document.getElementById('GetPuzzle').onclick = function () {
    var xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        if (xhrRequest.status === 200) {
            var response = JSON.parse(xhrRequest.response);
            console.log(response);
            board = response.board; // Update the board with the fetched puzzle
            FillBoard(board); // Fill the HTML grid with the fetched puzzle
        } else {
            console.error('Failed to fetch puzzle:', xhrRequest.status);
        }
    };
    xhrRequest.onerror = function () {
        console.error('Network error occurred while fetching puzzle.');
    };
    xhrRequest.open('GET', 'https://sugoku.onrender.com/board?difficulty=easy');
    xhrRequest.send();
};

// SolvePuzzle button click handler
document.getElementById('SolvePuzzle').onclick = function () {
    // Copy the board to avoid modifying the original fetched board
    var copyBoard = JSON.parse(JSON.stringify(board));
    if (SudokuSolver(copyBoard, 0, 0, 9)) {
        board = copyBoard; // Update the original board with the solved puzzle
        FillBoard(board); // Update HTML grid with solved puzzle
    } else {
        console.log("No solution exists for the given puzzle.");
    }
};

// Sudoku solving algorithm (Backtracking)
function SudokuSolver(board, i, j, n) {
    // Base case: If all cells are filled, puzzle is solved
    if (i == n - 1 && j == n) {
        return true;
    }

    // Move to the next row if current column exceeds the grid size
    if (j == n) {
        i++;
        j = 0;
    }

    // Skip if the cell is already filled
    if (board[i][j] != 0) {
        return SudokuSolver(board, i, j + 1, n);
    }

    // Try numbers 1-9
    for (let num = 1; num <= n; num++) {
        if (isSafe(board, i, j, num)) {
            board[i][j] = num; // Place the number

            // Recursively attempt to solve the rest of the puzzle
            if (SudokuSolver(board, i, j + 1, n)) {
                return true; // If recursion successful, puzzle solved
            }

            board[i][j] = 0; // Backtrack: Reset the cell
        }
    }

    return false; // No number found to solve this cell, backtrack
}

// Helper function to check if a number can be placed in a specific cell
function isSafe(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] == num) {
            return false;
        }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] == num) {
            return false;
        }
    }

    // Check 3x3 box
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (board[startRow + x][startCol + y] == num) {
                return false;
            }
        }
    }

    return true;
}
