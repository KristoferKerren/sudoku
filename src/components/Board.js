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

  function clearAll() {
    setActiveSquare(null);
    setIsFinished(false);
    const newSquares = [...squares.map((row) => [...row])];
    newSquares.forEach((row) =>
      row.forEach((s) => {
        if (!s.isInitial) {
          s.val = null;
          s.possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
      })
    );
    validateSquares(newSquares);
    setSquares(newSquares);
  }

  function updatePossible() {
    const newSquares = [...squares.map((row) => [...row])];
    newSquares.forEach((row) =>
      row.forEach((s) => {
        if (s.val) return;
        const newPossible = [];
        s.possible.forEach((p) => {
          const { row, col, group } = getRowColGroup(squares, s.x, s.y);
          if (
            !row.map((_s) => _s.val).includes(p) &&
            !col.map((_s) => _s.val).includes(p) &&
            !group.map((_s) => _s.val).includes(p)
          ) {
            newPossible.push(p);
          }
        });
        s.possible = newPossible;
      })
    );
    validateSquares(newSquares);
    setSquares(newSquares);
  }

  function solveAll() {
    let hasHelped = true;
    while (hasHelped) {
      hasHelped = solveOne();
    }
  }

  function solveOne() {
    updatePossible();
    let hasHelped = false;
    const newSquares = [...squares.map((row) => [...row])];
    newSquares.forEach((row) =>
      row.forEach((s) => {
        let value = 0;
        if (s.val || hasHelped) {
          return;
        }
        if (s.possible.length === 1) {
          value = s.possible[0];
        } else if (s.possible.length > 1) {
          const { row, col, group } = getRowColGroup(squares, s.x, s.y);
          s.possible.forEach((p) => {
            if (
              row
                .filter((_s) => !_s.val)
                .map((_s) => _s.possible)
                .filter((_p) => _p?.length && _p.includes(p)).length === 1 ||
              col
                .filter((_s) => !_s.val)
                .map((_s) => _s.possible)
                .filter((_p) => _p?.length && _p.includes(p)).length === 1 ||
              group
                .filter((_s) => !_s.val)
                .map((_s) => _s.possible)
                .filter((_p) => _p?.length && _p.includes(p)).length === 1
            ) {
              value = p;
            }
          });
        }
        if (value) {
          s.val = value;
          s.possible = [value];
          hasHelped = true;
          validateSquares();
        }
      })
    );
    return hasHelped;
  }

  function handleClick(square) {
    console.log(square.possible);
    updatePossible();
    if (square.isInitial || isFinished) {
      setActiveSquare(null);
    } else {
      setActiveSquare(square);
    }
  }

  function handleNumberSelect(number) {
    const newSquares = [...squares.map((row) => [...row])];
    newSquares[activeSquare.y][activeSquare.x].val = number;
    updatePossible();
  }

  function getRowColGroup(squares, x, y) {
    const row = squares[y];
    const col = squares.map((r) => r[x]);
    const groupStartIndexX = 3 * Math.floor(x / 3);
    const groupStartIndexY = 3 * Math.floor(y / 3);
    const group = [];
    squares.forEach((_row, _y) =>
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

    return { row, col, group };
  }

  function validateSquares(squaresToValidate = squares) {
    squaresToValidate.forEach((row, y) => {
      row.forEach((s, x) => {
        squaresToValidate[y][x].hasError = false;
        const { row, col, group } = getRowColGroup(squaresToValidate, x, y);
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
        <button onClick={clearAll}>Start over</button>
      </div>
      {!isFinished && (
        <div>
          <button onClick={solveOne}>Help me!</button>
          <button onClick={solveAll}>Solve!</button>
        </div>
      )}
      {isFinished && (
        <div>
          <Finished></Finished>
        </div>
      )}
    </>
  );
}
