import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe } from './TicTacToe.ts';

test('harness: TicTacToe can be constructed', () => {
  assert.ok(new TicTacToe([[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]));
});
