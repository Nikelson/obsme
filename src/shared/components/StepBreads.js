const StepBreads = ({ activeStep = 2, stepCount = 7, className, }) => {
    const getClassname = () => {
        const classnames = ["step-breads"];

        if (className) {
            classnames.push(className)
        }
        return classnames.join(" ");
    }
    
    const getItemClassname = (index) => {
        const classnames = [];

        if (index < activeStep) {
            classnames.push("done")
        } else if (index == activeStep) {
            classnames.push("active")
        }

        return classnames.join(" ");
    }

    return <div className={getClassname()}>
        {[...Array(stepCount).keys()].map((item, index) => {
            return <div key={index}
                className={getItemClassname(index + 1)}
            >
                <span />
            </div>
        })}
    </div>
}

export default StepBreads;