export default function Square({ square, isActive, onSquareClick }) {
  return (
    <button
      className={`board-cell ${square.hasError ? 'has-error' : ''} ${
        isActive ? 'is-active' : ''
      }`}
      onClick={onSquareClick}
    >
      {square.val}
    </button>
  );
}
