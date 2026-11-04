# 4x4 Tic-Tac-Toe Solver

A solver that takes a 4x4 board and reports the winner, if any.

## How it works

`solver.ts` exports a generic `TicTacToe<T>` class, where `T` is whatever you use to represent a player (e.g. `"a" | "b"`). A board is a 4x4 tuple of `T | null`, with `null` meaning an empty cell.

- **`checkWinner(board)`** returns the winning player, or `null` if there isn't one. It scans the board bottom-up (so it also suits Connect Four style play), skips empty cells, and runs each filled cell through the five win conditions:
  - **Vertical**: the cell's whole column belongs to one player
  - **Horizontal**: the cell's whole row belongs to one player
  - **Diagonal**: either full diagonal belongs to one player
  - **Four corners**: all four corners belong to one player
  - **2x2 box**: the cell is the top-left of a 2x2 square owned by one player (anchoring at the top-left covers all 9 possible boxes exactly once)
- **`anyMovesLeft(board)`** returns `true` if any cell is empty.
- **`isGameOver(board)`** returns `true` if there's a winner or the board is full.

If a board somehow has winning lines for both players, `checkWinner` returns whichever it finds first.

## Implementation notes

- **Typed board shape**: `Cell`, `Row` and `FourbyFourBoard` are tuple types, so passing a board that isn't 4x4 is a compile-time error.
- **Generic players**: the class doesn't care what a player is, so strings, numbers or enums all work.
- **Pluggable win conditions**: each condition is its own method with the same `(board, row, col) => boolean` signature, collected in a `winConditions` array. Adding a new rule means writing one method and adding it to the list.
- **Per-cell checks**: each condition asks "does the player in this cell win this way?". Rows and columns check the cell's own line; diagonals and corners first check that the cell is on them; boxes use offsets from the cell with a bounds check.
- **Early exit**: every check returns `false` on the first cell that doesn't match, and `checkWinner` returns on the first win it finds.
- **Valid Board Check**: We don't check if a board state makes sense. For exmaple in connect four, you'd need to check if any given board piece shouldn't have empty space beneath it

## Complexity

**Space**: O(1). The board is read in place and never copied. The only we store are the small fixed coordinate and offset lists inside the checks, which are rebuilt on each call.

**Time**:

Checking per cell does duplicate work: a full row gets checked once for each of its four cells, and the diagonals and corners are re-checked from every cell on them. That's a deliberate trade for simpler code. The board is fixed at 4x4, so the worst case is 16 cells × 5 conditions × at most 4 reads, about 320 cell reads, which is effectively constant time.

If the board were generalized to n×n, this approach would grow to roughly O(n³), and it would be worth checking each line once instead of once per cell.

## Running the tests

Requires Node.js.

```sh
npm install
npm test            # watch mode
npx vitest run      # single run
```

The tests in `solver.test.ts` build boards from strings (`"."` = empty) and cover each win condition, boards with no winner, and the move-left / game-over checks.
