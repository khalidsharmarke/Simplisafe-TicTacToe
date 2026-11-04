export type Player = 'X' | 'O';
export type Cell = Player | null;
type Row = [Cell, Cell, Cell, Cell];
// Tuple type makes the 4x4 shape a compile-time guarantee, so no runtime shape check.
export type Board = [Row, Row, Row, Row];

// Stateless: callers own the board, we only evaluate it.
export abstract class TicTacToe {
  public static checkWinner(board: Board): Player | null {
    throw new Error('not implemented');
  }

  public static anyMovesLeft(board: Board): boolean {
    return board.flat().includes(null);
  }

  public static isGameOver(board: Board): boolean {
    throw new Error('not implemented');
  }
}
