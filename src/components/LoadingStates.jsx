import "../styles/loading-states.css";

export function LoadingSpinner({ label = "Loading" }) {
  return (
    <span className="loading-indicator" role="status" aria-label={label}>
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function TableSkeletonRows({ columns, rows = 5 }) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <tr
      className="skeleton-row"
      key={`skeleton-row-${rowIndex}`}
      aria-hidden="true"
    >
      {Array.from({ length: columns }, (_, columnIndex) => (
        <td key={`skeleton-cell-${rowIndex}-${columnIndex}`}>
          <span
            className={`skeleton-block skeleton-cell skeleton-width-${(rowIndex + columnIndex) % 3}`}
          />
        </td>
      ))}
    </tr>
  ));
}
