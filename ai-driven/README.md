# 4x4 Tic-Tac-Toe Solver (AI-driven)

A solver for the exercise in the [root README](../README.md): given a 4x4 board, report the winner (if any), whether moves remain, and whether the game is over.

## Running the tests

Requires **Node.js 22.18+ or 23.6+** (Node runs the `.ts` files directly; there is no build step).

```sh
cd ai-driven
npm install        # installs typescript + @types/node, used only for type checking
npm test           # runs the test suite with Node's built-in test runner
npm run typecheck  # runs the TypeScript compiler without emitting files
```

Tests live in `src/TicTacToe.test.ts`. AI session transcripts are in `transcripts/`.

## Usage

The class holds no state, so you pass the board to each call. Each cell is `'X'`, `'O'` or `null` (empty).

```ts
import { TicTacToe, type Board } from './src/TicTacToe.ts';

const board: Board = [
  ['X', 'X', null, null],
  ['X', 'X', 'O', null],
  [null, 'O', null, null],
  [null, null, 'O', null],
];

TicTacToe.checkWinner(board);  // 'X'  (2x2 box in the top-left)
TicTacToe.anyMovesLeft(board); // true
TicTacToe.isGameOver(board);   // true (someone won)
```

| Method | Returns |
|---|---|
| `checkWinner(board)` | `'X'`, `'O'`, or `null` if nobody has won. If both players have a winning pattern, it returns whichever it finds first. |
| `anyMovesLeft(board)` | `true` if at least one cell is empty |
| `isGameOver(board)` | `true` if someone has won or the board is full |

The `Board` type is a fixed 4x4 grid (four rows of four cells), so TypeScript rejects a board of the wrong size before the code runs. Board *legality* (e.g. X having ten more pieces than O) is not checked.

## How `checkWinner` works

The idea: **write down every set of 4 cells that wins, then look at each set and ask "do all four cells hold the same player?"**

### Step 1: list the winning patterns (lines 7-20)

A cell's position is written as `[row, col]`, with both numbered 0-3 from the top-left. Each winning pattern is just a list of four positions.

- **Line 7**: `Coord` is the type for one position, a pair `[row, col]`.
- **Line 8**: `idx = [0, 1, 2, 3]` is the list of row/column numbers, reused to build the patterns.
- **Line 9**: `at(row, col)` makes a position. It only exists so the patterns below read clearly.
- **Line 12**: `WIN_PATTERNS` is the list of all 19 winning patterns. It is built **once**, when the file is loaded, not every time `checkWinner` is called.

Each following line adds one kind of win:

- **Line 13, rows (4)**: for each row `r`, take columns 0-3 → `[r,0] [r,1] [r,2] [r,3]`.
- **Line 14, columns (4)**: the same with rows and columns swapped → `[0,c] [1,c] [2,c] [3,c]`.
- **Line 15, main diagonal (1)**: row equals column → `[0,0] [1,1] [2,2] [3,3]`.
- **Line 16, anti diagonal (1)**: column is `3 - row` → `[0,3] [1,2] [2,1] [3,0]`.
- **Line 17, four corners (1)**: written out by hand, since there is only one.
- **Line 19, 2x2 boxes (9)**: a 2x2 box is a square of four neighbouring cells. Name each box by its **top-left** cell. That cell can only be in rows 0-2 and columns 0-2 (a box starting in row 3 or column 3 would hang off the board), giving 3 × 3 = 9 boxes. For each top-left `[r, c]`, the box is:

  ```
  [r, c]    [r, c+1]      ← top-left,    top-right
  [r+1, c]  [r+1, c+1]    ← bottom-left, bottom-right
  ```

  In the code, `[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ...))` is a nested loop: "for every row r in 0-2, for every column c in 0-2, build that box". `flatMap` joins the three rows of results into one list of 9 boxes, and the leading `...` adds them to `WIN_PATTERNS` one by one.

  For example, with top-left `r = 1, c = 2` the box is `[1,2] [1,3] [2,2] [2,3]`:

  ```
  . . . .
  . . ■ ■
  . . ■ ■
  . . . .
  ```

### Step 2: check each pattern (lines 24-30)

```ts
for (const [[r0, c0], ...rest] of WIN_PATTERNS) {
  const first = board[r0][c0];
  if (first && rest.every(([r, c]) => board[r][c] === first)) return first;
}
return null;
```

- **Line 25**: go through the patterns one at a time. Each pattern is split into its first position `[r0, c0]` and the other three, `rest`.
- **Line 26**: read the player in the first cell (`'X'`, `'O'`, or `null`).
- **Line 27**: it's a win if the first cell is **not empty** and **every** other cell holds that **same** player. If so, return that player.
- **Line 29**: no pattern matched, so nobody has won: return `null`.

### Why it's efficient

- The patterns are built once, so each call only reads cells.
- Taking the player from the first cell means one pass checks for both X and O, not one pass per player.
- It stops as soon as it can:
  - an empty first cell skips that pattern after one read;
  - `every` stops at the first cell that doesn't match;
  - the loop stops at the first winning pattern.
- Worst case (no winner): 19 patterns × 4 cells = 76 cell reads.

### The other two methods

- `anyMovesLeft`: `board.flat()` lays the 4 rows out as one list of 16 cells, and `.includes(null)` asks "is any of them empty?"
- `isGameOver`: the game is over if `checkWinner` found a winner, **or** there are no moves left. If there's a winner, the `||` skips the second check.

## Time and space complexity

The board is always 4x4, so strictly every method is **O(1)**: the work never grows. To compare approaches, it helps to also ask how the code would scale on an **n×n** board, with the same win conditions: full-length rows, columns and diagonals, the 4 corners, and 2x2 boxes.

### Concrete cost on the 4x4 board

| | Work per call (worst case) | Extra memory |
|---|---|---|
| `WIN_PATTERNS` (built once at load) | 19 patterns, 76 positions | 76 stored positions, held for the program's lifetime |
| `checkWinner` | 76 cell reads | none (a few loop variables) |
| `anyMovesLeft` | 16 cell reads | one 16-cell list from `flat()` |
| `isGameOver` | 76 + 16 = 92 cell reads | same as `anyMovesLeft` |

### Scaling to an n×n board

| Pattern | How many | Cells each | Total cells |
|---|---|---|---|
| Rows | n | n | n² |
| Columns | n | n | n² |
| Diagonals | 2 | n | 2n |
| Corners | 1 | 4 | 4 |
| 2x2 boxes | (n−1)² | 4 | 4(n−1)² |

Adding it up gives about **6n² cell reads**, so:

| | Time | Space |
|---|---|---|
| `WIN_PATTERNS` | O(n²) once | O(n²) |
| `checkWinner` | O(n²) | O(1) extra |
| `anyMovesLeft` | O(n²) | O(n²) for the `flat()` copy |
| `isGameOver` | O(n²) | O(n²), from `anyMovesLeft` |

O(n²) time is the best possible: a board with no winner has n² cells, and you can't confirm nobody won without looking at every one.

Trade-offs, neither worth changing at 4x4:

- **`anyMovesLeft` memory**: `board.some((row) => row.includes(null))` would avoid the copy (O(1) extra space). `flat()` was kept because it reads more simply, and the copy is only 16 cells.
- **Fewer reads**: each cell is read up to about 6 times (once per pattern it belongs to). A single pass that counts each player per row, column and diagonal would read each cell once. It would still be O(n²) and the code would be harder to follow.
