const FormItem=(payload)=>{
    const {label,id,fullWidth, children }=payload;

    return(
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: fullWidth ? "100%" : "auto" }}>
            <label htmlFor={id}>{label}:</label>
            {children}
        </div>)}

export default FormItem;