export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][]; // 4 rows x 4 columns

export class TicTacToe {
  private readonly board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  public checkWinner(): Player | null {
    throw new Error('not implemented');
  }

  public anyMovesLeft(): boolean {
    throw new Error('not implemented');
  }

  public isGameOver(): boolean {
    throw new Error('not implemented');
  }
}
