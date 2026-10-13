import "./EmptyState.css";

function EmptyState({ title, message, variant = "empty", action }) {
  return (
    <div className={`empty-state empty-state-${variant}`} role="status">
      <svg
        className="empty-state-illustration"
        viewBox="0 0 120 96"
        role="img"
        aria-label={variant === "error" ? "Unable to load data" : "No data"}
      >
        <path
          className="empty-state-shadow"
          d="M16 79c0-5 19-9 44-9s44 4 44 9-19 9-44 9-44-4-44-9Z"
        />
        <path
          className="empty-state-folder"
          d="M23 27a7 7 0 0 1 7-7h20l9 9h31a7 7 0 0 1 7 7v31a7 7 0 0 1-7 7H30a7 7 0 0 1-7-7V27Z"
        />
        <path
          className="empty-state-paper"
          d="M40 39h40a5 5 0 0 1 5 5v25H35V44a5 5 0 0 1 5-5Z"
        />
        <path className="empty-state-line" d="M45 50h27M45 58h19" />
        <circle className="empty-state-accent" cx="88" cy="29" r="12" />
        <path className="empty-state-check" d="m83 29 3.5 3.5L93 26" />
      </svg>
      <h2>{title}</h2>
      <p>{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
