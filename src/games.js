const game1 = [
  { x: 1, y: 0, val: 2 },
  { x: 2, y: 0, val: 3 },
  { x: 3, y: 0, val: 4 },
  { x: 5, y: 0, val: 9 },
  { x: 8, y: 0, val: 6 },
  { x: 5, y: 1, val: 2 },
  { x: 7, y: 1, val: 3 },
  { x: 8, y: 1, val: 7 },
  { x: 0, y: 2, val: 7 },
  { x: 3, y: 2, val: 5 },
  { x: 4, y: 2, val: 3 },
  { x: 1, y: 3, val: 6 },
  { x: 2, y: 3, val: 5 },
  { x: 8, y: 3, val: 4 },
  { x: 0, y: 4, val: 3 },
  { x: 1, y: 4, val: 9 },
  { x: 2, y: 4, val: 4 },
  { x: 3, y: 4, val: 7 },
  { x: 5, y: 4, val: 6 },
  { x: 7, y: 4, val: 5 },
  { x: 1, y: 5, val: 1 },
  { x: 2, y: 5, val: 7 },
  { x: 5, y: 5, val: 5 },
  { x: 7, y: 5, val: 2 },
  { x: 8, y: 5, val: 9 },
  { x: 0, y: 6, val: 4 },
  { x: 1, y: 6, val: 7 },
  { x: 4, y: 6, val: 1 },
  { x: 5, y: 6, val: 3 },
  { x: 0, y: 7, val: 6 },
  { x: 1, y: 7, val: 3 },
  { x: 2, y: 7, val: 8 },
  { x: 4, y: 7, val: 5 },
  { x: 0, y: 8, val: 9 },
  { x: 1, y: 8, val: 5 },
  { x: 4, y: 8, val: 8 },
  { x: 5, y: 8, val: 7 },
  { x: 7, y: 8, val: 4 },
];

const games = [game1].map((game) => {
  const squares = Array.from({ length: 9 }, () => new Array(9).fill(null));
  squares.forEach((row, y) =>
    row.forEach((_, x) => {
      squares[y][x] = { x: x, y: y, hasError: false };
    })
  );
  game.forEach((s) => {
    squares[s.y][s.x] = { x: s.x, y: s.y, val: s.val, isInitial: true };
  });
  return squares;
});
const nbrOfGames = games.length;
export { games, nbrOfGames };
