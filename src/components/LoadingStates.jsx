import "./LoadingStates.css";

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

// export function KanbanSkeleton({ columns = 5 }) {
//   return (
//     <div className="kanban-skeleton" aria-label="Loading tasks" role="status">
//       {Array.from({ length: columns }, (_, columnIndex) => (
//         <div className="kanban-skeleton-column" key={`skeleton-column-${columnIndex}`}>
//           <div className="skeleton-block kanban-skeleton-heading" />
//           {[0, 1, 2].map((cardIndex) => (
//             <div
//               className="kanban-skeleton-card"
//               key={`skeleton-card-${columnIndex}-${cardIndex}`}
//             >
//               <span className="skeleton-block kanban-skeleton-badge" />
//               <span className="skeleton-block kanban-skeleton-title" />
//               <span className="skeleton-block kanban-skeleton-line" />
//               <span className="skeleton-block kanban-skeleton-meta" />
//             </div>
//           ))}
//         </div>
//       ))}
//       <span className="visually-hidden">Loading tasks</span>
//     </div>
//   );
// }
