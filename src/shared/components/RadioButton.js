const RadioButton = ({ children, ...rest }) => {
    return (
        <label className="radio-btn">
            <input type="radio" {...rest} />
            <i />
            <span>{children}</span>
        </label>
    )
}

export default RadioButton;