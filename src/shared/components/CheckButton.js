const CheckButton = ({ children, alignTop = false, className, ...rest }) => {
    const getClassname = () => {
        const classnames = ["check-btn"];

        if (alignTop) classnames.push("align-top");
        if (className) classnames.push("className");

        return classnames.join(" ");
    }

    return (
        <label className={getClassname()}>
            <input type="checkbox" {...rest} />
            <i />
            <span>{children}</span>
        </label>
    )
}

export default CheckButton;