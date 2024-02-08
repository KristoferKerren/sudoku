export default function SetNumber({ onSelect }) {
  return (
    <div className="number-options">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Clear'].map((number) => (
        <button
          key={number}
          onClick={() => onSelect(number === 'Clear' ? null : number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
}
