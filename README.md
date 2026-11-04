# 4x4 Tic-Tac-Toe Solver

This repo has two independent solutions to the same exercise (the prompt is below), so the two approaches can be compared:

| Directory | What it is |
|---|---|
| [`self-driven/`](self-driven/) | Written by hand, without AI assistance. |
| [`ai-driven/`](ai-driven/) | Built test-first in a Claude Code session. It was written from scratch, without looking at `self-driven/`. |

Each directory is a standalone TypeScript project with its own README covering setup, how to run its tests, and how it works.

## Running the AI-driven solution

```sh
cd ai-driven
npm install
npm test
```

Requires Node.js 22.18+ or 23.6+. See [`ai-driven/README.md`](ai-driven/README.md) for:
- the API;
- a walkthrough of how `checkWinner` works;
- time and space complexity, including the optimizations considered and not taken.

## AI session transcripts

As the prompt asks, the transcript of the AI session is included in [`ai-driven/transcripts/`](ai-driven/transcripts/). It is the raw Claude Code session log (JSON Lines, one event per line), and every commit in the `ai-driven/` history corresponds to one step of that conversation.

## The exercise prompt

Implement a 4x4 Tic-Tac-Toe/Connect Four solver. The program should take in a representation of a 4x4 board, and tell you the winner if any.
Victory is determined by one of five conditions:

- Vertical
- Horizontal
- Diagonal
- All Four Corner
- 2x2 box

Implementing a UI is not necessary: we are only interested in your implementation of the win condition.
Implement the below functions, and feel free to create any other types that you need, as well as unit tests (just tell us how to run them!). If you use AI please include your AI session transcripts.

```ts
class TicTacToe {
    public checkWinner(/* {{ params, if any }} */): /*{{ return type }}*/ {};

    public anyMovesLeft(/* {{ params, if any }} */): /*{{ return type }}*/ {};

    public isGameOver(/* {{ params, if any }} */): /*{{ return type }}*/ {};
}
```
