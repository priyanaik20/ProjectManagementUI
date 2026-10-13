const Back = (props) => {
  const { onBack } = props;

  return (
    <button
      className="header-back-button"
      type="button"
      aria-label="Go back to previous page"
      title="Go back"
      onClick={onBack}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5m0 0 7-7m-7 7 7 7" />
      </svg>
    </button>
  );
};

export default Back;
