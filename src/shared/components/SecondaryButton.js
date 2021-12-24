import * as images from './../../assets/images';

const SecondaryButton = ({ isLoading = false, disabled, className, children, isLink, ...rest }) => {
    const getClassname = () => {
        let classnames = ["secondary-btn"];
        if (className) classnames.push(className);
        return classnames.join(" ");
    }
    if (isLink) {
        return <a
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
        </a>
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

export default SecondaryButton;