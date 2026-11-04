export class TicTacToe<T> {
    winConditions = [
        this.checkVertical,
        this.checkHorizontal,
        this.checkDiagonals,
        this.checkCorners,
        this.checkBox,
    ];

    // first win found is returned; boards with two winners aren't expected in real play
    public checkWinner(board: FourbyFourBoard<T>): T | null {
        // Since this board could be used for connect four
        // we need to check the board from bottom up
        for (let row = board.length - 1; row >= 0; row--) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === null) continue; // only check cells with a player in it

                for (const condition of this.winConditions) {
                    if (condition(board, row, col)) return board[row][col];
                }
            }
        }

        return null;
    }

    public anyMovesLeft(board: FourbyFourBoard<T>): boolean {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === null) return true;
            }
        }

        return false;
    }

    public isGameOver(board: FourbyFourBoard<T>): boolean {
        if (this.checkWinner(board)) return true;
        if (!this.anyMovesLeft(board)) return true;

        return false;
    }

    checkVertical(
        board: FourbyFourBoard<T>,
        row: number,
        col: number,
    ): boolean {
        const player = board[row][col];
        for (let r = 0; r < board.length; r++) {
            // cell is either not filled in or occupied by the other player
            if (board[r][col] != player) return false;
        }

        return true;
    }

    checkHorizontal(
        board: FourbyFourBoard<T>,
        row: number,
        col: number,
    ): boolean {
        const player = board[row][col];
        for (let c = 0; c < board[row].length; c++) {
            // cell is either not filled in or occupied by the other player
            if (board[row][c] != player) return false;
        }

        return true;
    }

    checkDiagonals(
        board: FourbyFourBoard<T>,
        row: number,
        col: number,
    ): boolean {
        const player = board[row][col];
        const firstDiagonal = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
        ];
        const secondDiagonal = [
            [3, 0],
            [2, 1],
            [1, 2],
            [0, 3],
        ];

        if (firstDiagonal.some(([r, c]) => r == row && c == col)) {
            for (const [r, c] of firstDiagonal) {
                if (board[r][c] != player) return false;
            }

            return true;
        } else if (secondDiagonal.some(([r, c]) => r == row && c == col)) {
            for (const [r, c] of secondDiagonal) {
                if (board[r][c] != player) return false;
            }

            return true;
        } else return false; // we arent on a cell that is one of the diagonals
    }

    checkCorners(board: FourbyFourBoard<T>, row: number, col: number): boolean {
        const player = board[row][col];
        const corners = [
            [0, 0],
            [0, 3],
            [3, 3],
            [3, 0],
        ];

        if (!corners.some(([r, c]) => r == row && c == col)) return false;
        for (const [r, c] of corners) {
            if (board[r][c] != player) return false;
        }

        return true;
    }

    // (row, col) is the box's top-left corner, so all 9 boxes are each checked exactly once
    checkBox(board: FourbyFourBoard<T>, row: number, col: number): boolean {
        const [rows, cols] = [board.length, board[row].length];
        const player = board[row][col];

        const offsets = [
            [0, 1],
            [1, 1],
            [1, 0],
        ];

        for (const [rowOffset, colOffset] of offsets) {
            const [r, c] = [row + rowOffset, col + colOffset];
            if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
            if (board[r][c] != player) return false;
        }

        return true;
    }
}

type Cell<T> = null | T;

type Row<T> = [Cell<T>, Cell<T>, Cell<T>, Cell<T>];

type FourbyFourBoard<T> = [Row<T>, Row<T>, Row<T>, Row<T>];
