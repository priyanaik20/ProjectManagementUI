const FormItem = (payload) => {
  const { label, id, isRequired, fullWidth, children } = payload;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      <label htmlFor={id}>
        {label}:{isRequired ? <span className="required">*</span> : <></>}{" "}
      </label>
      {children}
    </div>
  );
};

export default FormItem;
