import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe, type Board, type Player } from './TicTacToe.ts';

// Build a board from 4 strings of 'X' / 'O' / '.' (empty).
const parse = (...rows: string[]): Board =>
  rows.map((r) => [...r].map((c) => (c === '.' ? null : c))) as Board;

// Empty board with `player` placed on the given [row, col] cells.
const place = (player: Player, cells: [number, number][]): Board => {
  const board = parse('....', '....', '....', '....');
  for (const [r, c] of cells) board[r][c] = player;
  return board;
};

const range = [0, 1, 2, 3];
const EMPTY = parse('....', '....', '....', '....');
// Full board with no winning pattern: adjacent rows are complements, so every line/box/corner set is mixed.
const DRAW = parse('XXOO', 'OOXX', 'XXOO', 'OOXX');

const winningLines: [string, [number, number][]][] = [
  ...range.map((r) => [`row ${r}`, range.map((c) => [r, c])] as [string, [number, number][]]),
  ...range.map((c) => [`column ${c}`, range.map((r) => [r, c])] as [string, [number, number][]]),
  ['main diagonal', range.map((i) => [i, i])],
  ['anti diagonal', range.map((i) => [i, 3 - i])],
  ['four corners', [[0, 0], [0, 3], [3, 0], [3, 3]]],
  ...[0, 1, 2].flatMap((r) =>
    [0, 1, 2].map((c) => [`2x2 box at ${r},${c}`, [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]]] as [string, [number, number][]]),
  ),
];

describe('checkWinner', () => {
  test('empty board has no winner', () => {
    assert.equal(TicTacToe.checkWinner(EMPTY), null);
  });

  for (const player of ['X', 'O'] as Player[]) {
    for (const [name, cells] of winningLines) {
      test(`${player} wins by ${name}`, () => {
        assert.equal(TicTacToe.checkWinner(place(player, cells)), player);
      });
    }
  }

  test('a line containing both players is not a win', () => {
    assert.equal(TicTacToe.checkWinner(parse('XXXO', '....', '....', '....')), null);
  });

  test('three in a line with the fourth empty is not a win', () => {
    assert.equal(TicTacToe.checkWinner(parse('XXX.', '....', '....', '....')), null);
  });

  test('full board with no winning pattern has no winner', () => {
    assert.equal(TicTacToe.checkWinner(DRAW), null);
  });
});

describe('anyMovesLeft', () => {
  test('empty board has moves left', () => {
    assert.equal(TicTacToe.anyMovesLeft(EMPTY), true);
  });

  test('board with one empty cell has moves left', () => {
    assert.equal(TicTacToe.anyMovesLeft(parse('XXOO', 'OOXX', 'XXOO', 'OOX.')), true);
  });

  test('full board has no moves left', () => {
    assert.equal(TicTacToe.anyMovesLeft(DRAW), false);
  });
});

describe('isGameOver', () => {
  test('game is over when there is a winner', () => {
    assert.equal(TicTacToe.isGameOver(parse('XXXX', '....', '....', '....')), true);
  });

  test('game is over when the board is full with no winner', () => {
    assert.equal(TicTacToe.isGameOver(DRAW), true);
  });

  test('game is not over with no winner and moves left', () => {
    assert.equal(TicTacToe.isGameOver(parse('XO..', '....', '....', '....')), false);
  });
});
