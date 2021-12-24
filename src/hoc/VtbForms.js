/* eslint-disable */
import React, { Component, useEffect, useState, } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';

class ValidatedValueModel {
    constructor({ value, isValid, message, validations }) {
        this.value = (value === null || value === undefined || value === '') ? '' : value;
        this.isValid = isValid || true;
        this.message = message || '';
        this.class = '';
        this.validations = validations || [];
    }
}

const VtbForm = (WrappedComponent, formObject, formValidationObject) => {
    class Form extends Component {
        constructor(props) {
            super(props);

            if (!formObject || !formValidationObject) {
                throw 'Please provide formObject or formValidationObject to use Form HOC';
            }

            this.formObjectname = WrappedComponent.name;
            this.resetEvent = new Event(this.formObjectname + '_RESET_EV');
            this.formValidationObjectname = formValidationObject.name;

            this.formObject = typeof formObject === 'function' ? formObject() : formObject;
            this.formValidationObject = typeof formValidationObject === 'function' ? formValidationObject() : formValidationObject;
            try {
                this.isValid = this.isFormValid;
                WrappedComponent.prototype.getData = this.getData;
                WrappedComponent.prototype.isValid = this.isFormValid;
                WrappedComponent.prototype.reset = this.reset;
                WrappedComponent.prototype.fillForm = this.fillForm;
            } catch (error) {
                // debugger
            }

            this.state = this.generateForm();
        }

        generateForm = () => {
            let stateObj = {};
            for (let item in this.formObject) {
                if (!this.formObject.hasOwnProperty(item))
                    continue;

                let validationKeys = this.formValidationObject[item] && typeof this.formValidationObject[item] == "object" ? Object.keys(this.formValidationObject[item]) : [];

                if (this.formObject[item] != null && typeof this.formObject[item] === 'object') {

                    let nestedObject = this.formObject[item];

                    const isNestedObjectArray = Array.isArray(nestedObject);

                    if (isNestedObjectArray) {
                        stateObj[item] = new ValidatedValueModel({ value: [], validations: validationKeys });
                    } else {
                        stateObj[item] = {};
                        for (let nestedItem in nestedObject) {
                            if (!nestedObject.hasOwnProperty(nestedItem))
                                continue;

                            let value = this.setValueToType(nestedObject[nestedItem], this.formValidationObject[item] ? this.formValidationObject[item].type : undefined);
                            stateObj[item][nestedItem] = new ValidatedValueModel({ value, validations: validationKeys });
                        }
                    }
                }
                else {
                    let value = this.setValueToType(this.formObject[item], this.formValidationObject[item] ? this.formValidationObject[item].type : undefined);
                    stateObj[item] = new ValidatedValueModel({ value, validations: validationKeys });
                }
                // const value = this.setValueToType(this.formObject[item], this.formValidationObject[item] ? this.formValidationObject[item].type : undefined);
                // stateObj[item] = new ValidatedValueModel({ value });
            }
            return stateObj;
        }

        setValueToType = (value, type) => {
            if (type == undefined || value == null) {
                return value;
            }

            if (type == 'string') {
                return value.toString();
            }

            if (type == 'date') {
                if (!value)
                    return '';
                const time = moment().format('HH:mm:ss')
                let date = moment(value, ["DD/MM/YYYY", moment.ISO_8601]).format("DD/MM/YYYY");
                date = moment(`${date} ${time}`, "DD/MM/YYYY HH:mm:ss").format();
                return date;
            }

            if (type == 'date') {
                if (!value)
                    return moment();
                const time = moment().format('HH:mm:ss')
                let date = moment(value, ["DD/MM/YYYY", moment.ISO_8601]);
                date = moment(`${date} ${time}`, "DD/MM/YYYY HH:mm:ss");
                return date;
            }

            if (type == 'number') {
                let v = value.toString();

                if (!v.length)
                    return null;

                if (v == 'true')
                    v = 1;
                else if (v == 'false')
                    v = 0;

                if (Validation.rules.number(v)) {
                    return Number(v);
                }

                return v;
            }

            if (type == 'boolean') {
                //return ;
            }

            return value;
        }

        reset = (callback) => {
            const cleanObj = this.generateForm();
            this.setState({ ...cleanObj }, () => {
                document.dispatchEvent(this.resetEvent);
            });
        }

        isFormValid = (options = { ignore: [], getInvalidProps: false, }) => {
            const { ignore, getInvalidProps } = options;
            let newStateObj = {};

            for (let stateitem in this.state) {
                if (ignore && ignore.length && ignore.some(item => item === stateitem))
                    continue;

                const stateItemAsOriginal = {};
                stateItemAsOriginal[stateitem] = this.state[stateitem].value;

                newStateObj[stateitem] = this.validate(stateItemAsOriginal)[stateitem];
            }

            this.setState({ ...newStateObj });

            const isValid = !Object.keys(newStateObj).some(item => {
                const isValueValid = !newStateObj[item].isValid;
                // console.log('Form >>>', `Value: ${item} is valid: ${!isValueValid}`);
                return isValueValid;
            });

            if (getInvalidProps) {
                return {
                    isValid,
                    props: Object.keys(newStateObj).filter(item => {
                        return !newStateObj[item].isValid;
                    })
                }
            }

            // Boolean.prototype.which = () => {
            //     debugger;
            //     return Object.keys(newStateObj).filter(item => {
            //         return !newStateObj[item].isValid;
            //     })
            // }

            return isValid;
        }

        validate = (valueObject) => {
            const valueName = Object.getOwnPropertyNames(valueObject)[0];
            const value = this.setValueToType(valueObject[valueName], this.formValidationObject[valueName] ? this.formValidationObject[valueName].type : undefined);
            let validationKeys = this.formValidationObject[valueName] && typeof this.formValidationObject[valueName] == "object" ? Object.keys(this.formValidationObject[valueName]) : [];

            const valueExtended = {};
            valueExtended[valueName] = new ValidatedValueModel({ value, validations: validationKeys });

            const rules = this.formValidationObject[valueName];

            for (let ruleItem in rules) {
                const selectedRule = rules[ruleItem];

                if (ruleItem === 'type')
                    continue;

                if (typeof selectedRule === 'undefined')
                    continue;

                if (typeof selectedRule === 'boolean' && !selectedRule)
                    continue;

                let optionToPass;
                if (typeof selectedRule === 'object') {
                    optionToPass = selectedRule.option;
                } else {
                    optionToPass = selectedRule;
                }

                if (typeof optionToPass === 'string') {
                    const splitValues = optionToPass.split('.');
                    if (splitValues.length > 1 && splitValues[0] === this.formObjectname) {
                        optionToPass = this.state[splitValues[1]].value;
                    }
                    else {
                        optionToPass = splitValues[0];
                    }
                }

                let isValid;

                if ((!rules['required'] && ruleItem != 'required') && this.isValueEmpty(value)) {
                    isValid = true;
                } else {
                    try {
                        isValid = Validation.rules[ruleItem](value, optionToPass);
                    } catch (error) {
                        debugger;
                    }
                }

                if (!isValid) {
                    valueExtended[valueName].class = 'invalid';
                    valueExtended[valueName].isValid = isValid;
                    valueExtended[valueName].message = selectedRule.message ? selectedRule.message : Validation.messages[ruleItem](value, selectedRule);
                    break;
                }
            }

            return valueExtended;
        }

        isValueEmpty = value => {
            if (value === null || value === undefined) {
                return true;
            }
            return !Boolean(value.toString().length);
        }

        setValue = (prop, value, callback, validate = false) => {
            const state = {};
            state[prop] = this.setValueToType(value, this.formValidationObject[prop] ? this.formValidationObject[prop].type : undefined);

            const validatedValueObject = this.validate(state);
            if (!validate) {
                validatedValueObject[prop].isValid = true;
                validatedValueObject[prop].class = '';
            }
            this.setState({
                ...validatedValueObject
            }, () => {
                callback && callback(validatedValueObject);
            });
            return validatedValueObject;
        }

        setValidation = (prop, options, validate = false) => {
            this.formValidationObject[prop] = options;

            if (validate) {
                const state = {};
                state[prop] = this.state[prop]
                this.validate(state);
            }
        }

        fillForm = (data, options = { ignore: [], validate: false, }, callback) => {
            const { ignore, validate } = options || { ignore: [] };
            let filledObjects = {};
            for (let property in data) {

                if (ignore && ignore.length && ignore.some(item => item === property))
                    continue;

                if (this.formObject.hasOwnProperty(property)) {
                    let value = data[property];
                    // if (typeof value == 'boolean')
                    //     value = value.toString();
                    filledObjects[property] = this.setValue(property, value, null, validate)[property];
                }
            }
            callback && callback(filledObjects);
            return filledObjects;
        }


        //Todo: think of better handling
        handleInputUpdate = (e, callback) => {
            const { target } = e;
            const { value, maxLength } = target;
            //ios fix
            if (maxLength > 0 && value.length > maxLength) {
                return
            }

            const valueObj = this.inputToObj(target);
            const validatedValueObject = this.validate(valueObj);

            //Todo: pass validatedValueObject to the state without spreading;
            return this.setState({ ...validatedValueObject }, () => {
                const propName = Object.keys(validatedValueObject)[0];
                const valueObject = validatedValueObject[propName];
                callback && callback(valueObject)
                this.props.onInputChange && this.props.onInputChange({
                    ...valueObject,
                    inputName: propName,
                })
            });
        }

        handleInputUpdateWithValue = (name, value, callback) => {
            const valueObj = {};
            valueObj[name] = value;
            const validatedValueObject = this.validate(valueObj);
            return this.setState({ ...validatedValueObject }, () => {
                if (callback) callback();
            });
        }

        getCorrectType = value => {
            if (typeof value === 'string' && !value)
                value = null;

            if (typeof value === 'string' && (value === 'true' || value === 'false'))
                value = value === 'true' ? true : false;

            return value;
        }

        getData = () => {
            const $parent = this;

            const formData = function () { };

            formData.prototype.generate = function () {
                for (let stateItem in $parent.state) {
                    this[stateItem] = "";
                    const value = $parent.getCorrectType($parent.state[stateItem].value);
                    this[stateItem] = $parent.setValueToType(value, $parent.formValidationObject[stateItem] ? $parent.formValidationObject[stateItem].type : undefined);
                }
                return this;
            }

            formData.prototype.json = function () {
                return JSON.stringify(this);
            }

            return new formData().generate();
        }

        inputToObj = element => {
            const { name, type, value, checked, id } = element;
            if (name) {
                const stateObj = {};
                stateObj[name] = type === 'checkbox' ? checked : value;
                return stateObj;
            }
            console.warn(`Please set #${id} - ${type} input name attribute!!!`);
        }

        render() {
            const { forwardedRef, ...rest } = this.props;

            return (
                <WrappedComponent ref={forwardedRef} {...rest} form={{
                    setValue: this.setValue,
                    state: this.state,
                    getData: this.getData,
                    isValid: this.isFormValid,
                    updateInput: this.handleInputUpdate,
                    setSelectedValue: this.handleInputUpdateWithValue,
                    fillForm: this.fillForm,
                    setValidation: this.setValidation,
                    reset: this.reset,
                }} />
            );
        }
    }

    return Form;

    return React.forwardRef((props, ref) => {
        return <Form {...props} forwardedRef={ref} />;
    });
}

export default VtbForm;

export const FormValidationMessage = ({ for: input, className, message, isValid, ...rest }) => {
    const msg = input ? input.message : message;
    const msgBlock = <div {...rest} className={className ? className : 'error-message'}>{msg}</div>;

    if (input && !input.isValid)
        return msgBlock;
    else if (!isValid && message)
        return msgBlock;

    return null;
}

export const Validation = {
    rules: {
        required: value => {
            if (typeof value === 'string') {
                value = value.trim();
            }

            if (typeof value === 'boolean') {
                return value;
            }

            if (typeof value === 'undefined') {
                return false;
            }

            if (value === null) {
                return false;
            }

            return value.toString().length ? true : false
        },
        max: (value, param) => Number(value) <= param,
        min: (value, param) => Number(value) >= param,
        maxLength: (value, param) => {
            if (typeof value === 'string') {
                return value.length <= param;
            } else {
                return value.toString().length <= param;
            }
        },
        minLength: (value, param) => {
            if (typeof value === 'string') {
                return value.length >= param;
            } else {
                return value.toString().length >= param;
            }
        },
        exactLength: (value, param) => value.length === param,
        pattern: (value, param) => {
            const isMatch = value.toString().match(param) != null;
            return isMatch;
        },
        noLetters: (value, param) => {
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?(?:\/\d+)?(?:[-]\d+)?$/.test(value);
        },
        email: (value) => {
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value)
        },
        date: (value, param) => {
            let isValid;
            if (typeof param === 'string') {
                isValid = moment(value, param).isValid();
            }

            if (typeof param === 'boolean') {
                isValid = moment(value).isValid();
            }
            return isValid;
        },
        number: (value) => /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value),
        digit: (value) => /^\d+$/.test(value),
        equal: (value, param) => value === param,
        notEqual: (value, param) => value !== param,
        minArrayLength: (array, param) => array.length >= param,
        onlyLettersAndSpaces: (value, props) => {
            return /^[ა-ჰa-zA-Zа-яА-Я\s]*$/.test(value);
        },
        geoMobile: (value, props) => {
            return /^5/.test(value);
        },
    },
    messages: {
        required: (value, param) => `სავალდებულო ველი`,
        min: (value, param) => `მინიმალური მნიშვნელობა უნდა იყოს ${param}`,
        max: (value, param) => `მაქსიმალური მნიშვნელობა უნდა იყოს ${param}`,
        minLength: (value, param) => `შეიყვანეთ მინიმუმ ${param} სიმბოლო`,
        maxLength: (value, param) => `შეიყვანეთ მაქსიმუმ ${param} სიმბოლო`,
        exactLength: (value, param) => `შეიყვანეთ ზუსტად ${param} სიმბოლო`,
        pattern: (value, param) => `გთხოვთ სწორედ შეავსოთ მოთხოვნილი ველი`,
        noLetters: (value, param) => `გთხოვთ სწორედ შეავსოთ მოთხოვნილი ველი`,
        email: (value, param) => `გთხოვთ შეიყვანოთ სწორი ელ. ფოსტის მისამართი (მაგ. email@example.com)`,
        date: (value, param) => `გთხოვთ შეიყვანოთ სწორი თარიღი`,
        number: (value, param) => `შეიყვანეთ მხოლოდ რიცხვი`,
        digit: (value, param) => `შეიყვანეთ მხოლოდ ციფრები`,
        equal: (value, param) => `მნიშვნელობები უნდა უდრიდეს`,
        notEqual: (value, param) => `მნიშვნელობები არ უნდა ემთხვეოდეს`,
        minArrayLength: (array, param) => `გთხოვთ შეიყვანოთ მინიმუმ ${param} ერთეული`,
        onlyLettersAndSpaces: (array, param) => `გთხოვთ სწორედ შეავსოთ მოთხოვნილი ველი`,
        geoMobile: (array, param) => `მობილურის ნომერი უნდა იწყებოდეს 5 - ით`,
    }
}

export class FormInput extends Component {

    // state = {
    //     dateValue: '',
    // }

    getClassNames = () => {
        const { className, floatLabel = true, icon, form, name, greeninput, readonly, disabled } = this.props;
        const classNames = ["input-el"];
        if (form.state[name].class) classNames.push(form.state[name].class);
        if (floatLabel) classNames.push("float-label");
        if (readonly || disabled) classNames.push("input-read-only");
        if (className) classNames.push(className);
        if (greeninput) classNames.push('ShouldNotBeRequired');
        if (icon) classNames.push('with-icon');
        return classNames.join(" ");
    }

    get setStyles() {
        let styles = this.props.style || {};
        return styles;
    }

    // componentWillReceiveProps(newProps) {
    //     const { form, name, dateMask, } = newProps;
    //     console.log(newProps)
    //     if (dateMask) {
    //         const { value } = form.state[name];
    //         this.setState({
    //             dateValue: value ? moment(value).format("DDMMYYYY") : '',
    //         }, () => {
    //             console.log('-------------------')
    //         })
    //     }

    // }

    getInput = () => {
        const {
            form, mask, label, req, className, onChange, name, icon, dateMask,
            floatLabel = true, disabled, type = "text", showValidationMessage = true,
            style, readonly, refreshDatePicker, onBlur, clearInput, containerStyle, ...rest
        } = this.props;

        if (readonly || disabled) {
            return <span
                name={name}
                style={this.setStyles}
                data-float_label={Boolean(form.state[name].value.toString())}
                data-value={form.state[name].value}
                // title={label}
                className={this.getClassNames()}
                {...rest}
            >
                <span>{rest.value ? rest.value : form.state[name].value}</span>
            </span>
        } else if (mask || dateMask) {
            return <InputMask
                name={name}
                style={this.setStyles}
                data-float_label={Boolean(form.state[name].value.toString())}
                data-value={form.state[name].value}
                type={type}
                // title={label}
                className={this.getClassNames()}
                // value={form.state[name].value}
                mask={mask}
                autoComplete="off"
                onBlur={onBlur}
                onChange={!onChange ? form.updateInput : onChange}
                onChange={e => {
                    onChange(e)
                    const value = e.target.value.replace(/\//g, "").replace(/\_/g, "");
                    const dateObj = moment(value, "DDMMYYYY");
                    if (value.length != 8 && !dateObj.isValid()) {
                        clearInput && clearInput();
                    }
                }}
                {...rest}
            />
        } else if (type == "textarea") {
            return <textarea
                name={name}
                style={this.setStyles}
                data-float_label={Boolean(form.state[name].value.toString())}
                data-value={form.state[name].value}
                // title={label}
                className={this.getClassNames()}
                onChange={!onChange ? form.updateInput : onChange}
                value={form.state[name].value}
                autoComplete="off"
                onBlur={onBlur}
                {...rest}>
            </textarea>
        } else {
            return <input
                name={name}
                data-float_label={Boolean(form.state[name].value.toString())}
                data-value={form.state[name].value}
                type={type}
                style={this.setStyles}
                // title={label}
                className={this.getClassNames()}
                autoComplete="off"
                onChange={!onChange ? form.updateInput : onChange}
                value={form.state[name].value}
                onBlur={onBlur}
                onWheel={(e) => this.props.type == "number" && e.target.blur()}
                onKeyDown={e => {
                    if (e.keyCode === 38 || e.keyCode === 40) {
                        e.preventDefault();
                    }
                }}
                {...rest}
            />
        }
    }

    validateProp = () => {
        const {
            form,
            name,
            validator,
            propName = validator ? validator : name,
        } = this.props;

        let a;

        try {
            a = form.state[propName].isValid;
        } catch (error) {
            console.error(propName);
        }
    }

    nodes = {
        errorIcon: null,
    }
    get setStyles() {
        let styles = this.props.style || {};
        return styles;
    }

    render() {
        const {
            form,
            floatLabel = true,
            label,
            req = true,
            type = "text",
            className,
            onChange,
            name,
            icon,
            showValidationMessage = true,
            validator,
            propName = validator ? validator : name,
            mask,
            containerStyle = {},
            ...rest
        } = this.props;

        this.validateProp();

        return (
            <>
                <div className="input" style={containerStyle}>
                    {icon && <span className="icon"><img src={icon} /></span>}
                    {(label && !floatLabel) && <label label={label}>{label}{!req && <span>(არა სავალდებულო ველი)</span>}</label>}
                    {this.getInput()}
                    {(label && floatLabel) && <label label={label}>{label}{!req && <span>(არა სავალდებულო ველი)</span>}</label>}
                    {showValidationMessage && <FormValidationMessage for={form.state[propName]} />}
                </div>
            </>
        )
    }
}

export class FormSelect extends Component {
    getClassNames = () => {
        const { className, floatLabel = true, form, name, validator, greeninput, icon } = this.props;
        const classNames = ["input-el input-select"];
        const formProp = validator ? validator : name;
        if (form.state[formProp].class) classNames.push(form.state[formProp].class);
        if (floatLabel) classNames.push("float-label");
        if (className) classNames.push(className);
        if (greeninput) classNames.push('ShouldNotBeRequired');
        if (icon) classNames.push('with-icon');
        return classNames.join(" ");
    }

    //TODO: Dynamic marking of required inputs
    requiredClassname = () => {
        const { req, form, name, } = this.props;
        const { validations } = form.state[name];

        // if (req || validations && validations.some(validation => validation == 'required')) {
        //     return ' Req';
        // }
        if (req)
            return ' Req';
        return '';
    }

    get setStyles() {
        let styles = this.props.style || {};
        return styles;
    }

    render() {
        const {
            form,
            floatLabel = true,
            label,
            req = true,
            className,
            onChange,
            name,
            icon,
            showValidationMessage = true,
            options = [],
            optionKey,
            optionValue,
            optionCaption = "",
            hideOptionCaption = false,
            children,
            validator,
            propName = validator ? validator : name,
            style,
            disabled,
            ...rest
        } = this.props;

        if (disabled) {
            return <FormInput
                disabled={disabled}
                readonly
                form={form}
                name={name}
                data-float_label={Boolean(form.state[name].value.toString())}
                data-value={form.state[name].value}
                // title={label}
                label={label}
                value={
                    options.find((item, key) => {
                        return item[optionKey ? optionKey : 'id'] == form.state[name].value;
                    })?.[optionValue ? optionValue : 'name']
                }
            />
        }

        return (
            <div className="input">
                {icon && <span className="icon"><img src={icon} /></span>}
                {(label && !floatLabel) && <label label={label}>{label}{!req && <span>(არა სავალდებულო ველი)</span>}</label>}
                <select
                    style={this.setStyles}
                    name={name}
                    data-float_label={Boolean(form.state[name].value.toString())}
                    data-value={form.state[name].value}
                    // title={label}
                    className={this.getClassNames()}
                    onChange={!onChange ? form.updateInput : onChange}
                    value={form.state[name].value}
                    disabled={disabled}
                    {...rest}
                >
                    {
                        !hideOptionCaption &&
                        <option value="">{optionCaption ? optionCaption : "- არჩევა -"}</option>
                    }
                    {options.length > 0 && options.map((item, key) => {
                        const val = typeof item != "object" ? item : optionKey ? item[optionKey] : item.id;
                        const txt = typeof item != "object" ? item : optionValue ? item[optionValue] : item.name;
                        return <option key={key} value={val}>{txt}</option>
                    })}
                    {options.length == 0 && children}
                </select>
                {(label && floatLabel) && <label label={label}>{label}{!req && <span>(არა სავალდებულო ველი)</span>}</label>}
                {showValidationMessage && <FormValidationMessage for={form.state[propName]} />}
            </div>
        )
    }
}

// მეთოდები:
// const { form } = this.props;

// //ვალუეს გადავსება კოდიდან
// form.setValue('propname', 'propvalue');

// //ფორმაში გადავსებული ჯეისონის ამოღება
// form.getData().json();

// //ფორმაში გადავსებული ობიექტის ამოღება
// form.getData();

// //მთლიანი ფორმის ვალიდაციის შემოწმება
// form.isValid();
// form.isValid({ options object });

// //ინპუთის ვალიუს აპდეითი (ფორმის სტეიტში ვალიუს განახლება)
// form.updateInput(e);

// //ფორმის მთლიანი ობიექტის გადავსება
// form.fillForm({});

// //ვალიდაციის დამატება / მოშლა კოდიდან
// form.setValidation('propname', { validation rule object });

// //ფორმის დარეზეტება
// form.reset();

// რენდერის ობეიქტი
// form.state

// //ვორმის ვალიუ, უნდა დაბაინდდეს ინფუთთან
// form.state.value

// //ვალიდურია თუ არა ვალიუ (true / false)
// form.state.isValid

// //მყისიერი მესიჯი იმ შემთხვევაში თუ ვალიუ არ არის ვალიდური
// form.state.message