const FormItem = (props) => {
  const { label, id, isRequired, children } = props;

  return (
    <div className="form-item-wrapper">
      <label htmlFor={id}>
        {label}:{isRequired ? <span className="required">*</span> : <></>}{" "}
      </label>
      {children}
    </div>
  );
};

export default FormItem;
