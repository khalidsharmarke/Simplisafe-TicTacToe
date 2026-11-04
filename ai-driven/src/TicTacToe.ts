export type Player = 'X' | 'O';
export type Cell = Player | null;
type Row = [Cell, Cell, Cell, Cell];
// Tuple type makes the 4x4 shape a compile-time guarantee, so no runtime shape check.
export type Board = [Row, Row, Row, Row];

type Coord = [row: number, col: number];
const idx = [0, 1, 2, 3];
const at = (row: number, col: number): Coord => [row, col];

// Every winning pattern, built once at module load so each checkWinner call only reads cells.
const WIN_PATTERNS: Coord[][] = [
  ...idx.map((r) => idx.map((c) => at(r, c))), // 4 rows
  ...idx.map((c) => idx.map((r) => at(r, c))), // 4 columns
  idx.map((i) => at(i, i)), // main diagonal
  idx.map((i) => at(i, 3 - i)), // anti diagonal
  [at(0, 0), at(0, 3), at(3, 0), at(3, 3)], // four corners
  // 9 2x2 boxes, keyed by top-left corner
  ...[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => [at(r, c), at(r, c + 1), at(r + 1, c), at(r + 1, c + 1)])),
];

// Stateless: callers own the board, we only evaluate it.
export abstract class TicTacToe {
  public static checkWinner(board: Board): Player | null {
    for (const [[r0, c0], ...rest] of WIN_PATTERNS) {
      const first = board[r0][c0];
      if (first && rest.every(([r, c]) => board[r][c] === first)) return first;
    }
    return null;
  }

  public static anyMovesLeft(board: Board): boolean {
    return board.some((row) => row.includes(null));
  }

  public static isGameOver(board: Board): boolean {
    return TicTacToe.checkWinner(board) !== null || !TicTacToe.anyMovesLeft(board);
  }
}
