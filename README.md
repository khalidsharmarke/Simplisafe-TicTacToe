# 4x4 Tic-Tac-Toe Solver

This repo has two independent solutions to the same exercise (the prompt is below), so the two approaches can be compared:

| Directory | What it is |
|---|---|
| [`self-driven/`](self-driven/) | Written by hand, without AI assistance. |
| [`ai-driven/`](ai-driven/) | Built test-first in a Claude Code session. It was written from scratch, without looking at `self-driven/`. |

Each directory is a standalone TypeScript project with its own README covering setup, how to run its tests, and how it works.

## AI session transcripts

As the prompt asks, the transcript of the AI session is included as plain text in [`ai-driven/transcripts/session.txt`](ai-driven/transcripts/session.txt). It is laid out the way the Claude Code terminal shows a session:

- `>` marks a user prompt.
- `●` marks a Claude reply or a tool call (`Bash(...)`, `Write(...)`, `Edit(...)`).
- `⎿` marks that tool call's output, cut off after 40 lines.

Each commit in the `ai-driven/` history corresponds to one step of that conversation, and includes the transcript up to that point. The transcript was generated from the raw Claude Code session log, with private account details (email, account IDs and personal Claude Code settings) redacted.

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
