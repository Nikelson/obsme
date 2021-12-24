import * as images from './../../assets/images';

const MainButton = ({ isLoading = false, isClear = false, disabled, className, children, ...rest }) => {
    const getClassname = () => {
        let classnames = ["btn"];
        if (className) classnames.push(className);
        if (!isClear) classnames.push("btn-main");
        if (isClear) classnames.push("btn-clear");
        return classnames.join(" ");
    }
    return (
        <button
            disabled={isLoading || disabled}
            className={getClassname()}
            type="button"
            {...rest}
        >
            {isLoading ?
                <img className="btn-spinner" src={images.Spinner} />
                :
                children
            }
        </button>
    )
}

export default MainButton;