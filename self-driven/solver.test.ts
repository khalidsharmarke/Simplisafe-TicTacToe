import { describe, expect, it } from "vitest";
import { TicTacToe } from "./solver";

type Board = Parameters<TicTacToe<string>["checkWinner"]>[0];

// Build a board from 4 strings, "." = empty, e.g. ["a...", ".b..", "....", "...."]
const parseStringToBoard = (rows: string[]): Board =>
    rows.map((r) => [...r].map((c) => (c === "." ? null : c))) as Board;

const solver = new TicTacToe<string>();

const EMPTY = [
    "....",
    "....",
    "....",
    "....",
];
// Full board with no winning line of any kind.
const DRAW = [
    "aabb",
    "bbaa",
    "aabb",
    "bbaa",
];

describe("checkWinner", function () {
    it("returns null for an empty board", function () {
        expect(solver.checkWinner(parseStringToBoard(EMPTY))).toBeNull();
    });

    it("returns null for a full board with no winner", function () {
        expect(solver.checkWinner(parseStringToBoard(DRAW))).toBeNull();
    });

    it("returns null for three in a row", function () {
        expect(
            solver.checkWinner(
                parseStringToBoard(["aaa.", "....", "....", "...."]),
            ),
        )
            .toBeNull();
    });

    it.each([
        ["top row", ["aaaa", "....", "....", "...."], "a"],
        ["bottom row", ["....", "....", "....", "bbbb"], "b"],
        ["first column", ["a...", "a...", "a...", "a..."], "a"],
        ["last column", ["...b", "...b", "...b", "...b"], "b"],
        ["first diagonal", ["a...", ".a..", "..a.", "...a"], "a"],
        ["second diagonal", ["...b", "..b.", ".b..", "b..."], "b"],
        ["four corners", ["a..a", "....", "....", "a..a"], "a"],
        ["2x2 box top-left", ["bb..", "bb..", "....", "...."], "b"],
        ["2x2 box center", ["....", ".aa.", ".aa.", "...."], "a"],
        ["2x2 box bottom-right", ["....", "....", "..bb", "..bb"], "b"],
    ])("detects %s", (_name, rows, winner) => {
        expect(solver.checkWinner(parseStringToBoard(rows))).toBe(winner);
    });
});

describe("anyMovesLeft", function () {
    it("is true for an empty board", function () {
        expect(solver.anyMovesLeft(parseStringToBoard(EMPTY))).toBe(true);
    });

    it("is true with one empty cell", function () {
        expect(
            solver.anyMovesLeft(
                parseStringToBoard(["aabb", "bbaa", "aabb", "bba."]),
            ),
        )
            .toBe(true);
    });

    it("is false for a full board", function () {
        expect(solver.anyMovesLeft(parseStringToBoard(DRAW))).toBe(false);
    });
});

describe("isGameOver", function () {
    it("is false for an empty board", function () {
        expect(solver.isGameOver(parseStringToBoard(EMPTY))).toBe(false);
    });

    it("is true when someone has won", function () {
        expect(
            solver.isGameOver(
                parseStringToBoard(["aaaa", "....", "....", "...."]),
            ),
        ).toBe(
            true,
        );
    });

    it("is true for a full board with no winner", function () {
        expect(solver.isGameOver(parseStringToBoard(DRAW))).toBe(true);
    });
});
