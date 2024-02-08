import { useEffect, useState } from 'react';
import { games, nbrOfGames } from '../games';
import Square from './Square';
import SetNumber from './SetNumber';
import Finished from './Finished';

const initialSquares = games[Math.floor(Math.random() * nbrOfGames)];

export default function Board() {
  const [squares, setSquares] = useState(initialSquares);
  const [activeSquare, setActiveSquare] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  function handleClick(square) {
    if (square.isInitial || isFinished) {
      setActiveSquare(null);
    } else {
      setActiveSquare(square);
    }
  }

  function handleNumberSelect(number) {
    const newSquares = [...squares.map((row) => [...row])];
    newSquares[activeSquare.y][activeSquare.x].val = number;
    validateSquares(newSquares);
    setSquares(newSquares);
  }

  function validateSquares(squaresToValidate) {
    squaresToValidate.forEach((row, y) => {
      row.forEach((s, x) => {
        squaresToValidate[y][x].hasError = false;
        const row = squaresToValidate[y];
        const col = squaresToValidate.map((r) => r[x]);
        const groupStartIndexX = 3 * Math.floor(x / 3);
        const groupStartIndexY = 3 * Math.floor(y / 3);
        const group = [];
        squaresToValidate.forEach((_row, _y) =>
          _row.forEach((_s, _x) => {
            const _groupStartIndexX = 3 * Math.floor(_x / 3);
            const _groupStartIndexY = 3 * Math.floor(_y / 3);
            if (
              groupStartIndexX === _groupStartIndexX &&
              groupStartIndexY === _groupStartIndexY
            ) {
              group.push(_s);
            }
          })
        );
        if (row.filter((_s) => _s.val && _s.val === s.val).length > 1) {
          squaresToValidate[y][x].hasError = true;
        }
        if (col.filter((_s) => _s.val && _s.val === s.val).length > 1) {
          squaresToValidate[y][x].hasError = true;
        }
        if (group.filter((_s) => _s.val && _s.val === s.val).length > 1) {
          squaresToValidate[y][x].hasError = true;
        }
      });
    });
    if (
      squaresToValidate.every((row) => row.every((s) => !!s.val && !s.hasError))
    ) {
      setIsFinished(true);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const numberTyped = parseInt(event.key);
      if (
        activeSquare &&
        !Number.isNaN(numberTyped) &&
        numberTyped >= 1 &&
        numberTyped <= 9
      ) {
        handleNumberSelect(numberTyped);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSquare]);

  return (
    <>
      <div className="board-container">
        {squares.map((row) => {
          return row.map((s) => {
            return (
              <Square
                key={`${s.x},${s.y}`}
                square={s}
                isActive={
                  activeSquare &&
                  s.x === activeSquare.x &&
                  s.y === activeSquare.y
                }
                onSquareClick={() => handleClick(s)}
              ></Square>
            );
          });
        })}
      </div>
      <div>
        {activeSquare && <SetNumber onSelect={handleNumberSelect}></SetNumber>}
      </div>
      <div>
        {isFinished && <Finished onSelect={handleNumberSelect}></Finished>}
      </div>
    </>
  );
}
