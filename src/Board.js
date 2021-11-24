import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      initialBoard[y] = [];
      for (let x = 0; x < ncols; x++) {
        initialBoard[y][x] = Math.random() < chanceLightStartsOn;
      }
    }
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (board[y][x]) {
          return false;
        }
      }
    }
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // make a copy of the oldBoard
      const boardCopy = [...oldBoard];

      // in the copy, flip this cell and the cells around it
      // flipCell(y - 1, x - 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      // flipCell(y - 1, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      // flipCell(y + 1, x - 1, boardCopy);
      flipCell(y + 1, x, boardCopy);
      // flipCell(y + 1, x + 1, boardCopy);

      // return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div className="board">
        <p>You won!</p>
      </div>
    );
  }

  // TODO

  // make table board
  return (
    <div className="board">
      <table>
        <tbody>
          {board.map((row, y) => {
            return (
              <tr key={y}>
                {row.map((cell, x) => {
                  return (
                    <Cell
                      key={x}
                      isLit={cell}
                      flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
