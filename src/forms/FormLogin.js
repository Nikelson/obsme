import VtbForm, { FormInput, FormValidationMessage } from './../hoc/VtbForms';
import * as images from './../assets/images';

import CaptchaV2 from '../shared/components/CaptchaV2';
import { useEffect, useRef } from 'react';
import RadioButton from '../shared/components/RadioButton';
import { ClientTypeEnum } from '../enums';

const FormValues = {
    organizationType: ClientTypeEnum.SOLE_PROPRIETOR,
    personalNumber: '',
    mobile: '',
    captcha: '',
}

const FormValidations = {
    personalNumber: { required: true, number: true, exactLength: 11, },
    mobile: { required: true, number: true, geoMobile: true, exactLength: 9, },
    captcha: { required: true, },
}

const FormLogin = ({ onSubmit, form, id, setCaptchaReset }) => {

    useEffect(() => {
        setCaptchaReset(resetCaptcha)
    });

    useEffect(() => {
        const organizationType = form.state.organizationType.value;
        if (organizationType == ClientTypeEnum.SOLE_PROPRIETOR) {
            form.setValidation("personalNumber", {
                ...FormValidations.personalNumber,
                exactLength: 11,
            });
        } else {
            form.setValidation("personalNumber", {
                ...FormValidations.personalNumber,
                exactLength: 9,
            });
        }
        if (form.state.personalNumber.value) {
            form.setValue("personalNumber", "");
        }
    }, [form.state.organizationType.value]);

    const nodes = {
        captcha: useRef(null),
    }

    const resetCaptcha = () => {
        nodes.captcha.current && nodes.captcha.current.resetCaptcha()
    }

    const isRadioChecked = (name, value) => {
        const formValue = form.state[name].value;
        if (formValue === "") {
            return false;
        } else {
            return formValue == value;
        }
    }

    return (
        <form id={id} className="form" onSubmit={onSubmit}>

            <div className="row" style={{ paddingBottom: "15px", }}>
                <div className="col">
                    <span className="label">აირჩიე მეწარმე სუბიექტის ტიპი</span>
                </div>
            </div>

            <div className="row" style={{ marginBottom: "20px" }}>
                <div className="col">
                    <RadioButton
                        checked={isRadioChecked("organizationType", ClientTypeEnum.SOLE_PROPRIETOR)}
                        value={ClientTypeEnum.SOLE_PROPRIETOR}
                        onChange={form.updateInput}
                        name="organizationType">
                        ინდ. მეწარმე
                    </RadioButton>
                </div>
                <div className="col">
                    <RadioButton
                        checked={isRadioChecked("organizationType", ClientTypeEnum.LTD)}
                        value={ClientTypeEnum.LTD}
                        onChange={form.updateInput}
                        name="organizationType">
                        შ.პ.ს.
                    </RadioButton>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <FormInput
                        name="personalNumber"
                        form={form}
                        label={form.state.organizationType.value == ClientTypeEnum.SOLE_PROPRIETOR ? "პირადი ნომერი" : "საიდენტიფიკაციო კოდი"}
                        type="number"
                        maxLength={form.state.organizationType.value == ClientTypeEnum.SOLE_PROPRIETOR ? "11" : "9"}
                        icon={images.InputId}
                        pattern="[0-9]*"
                        steps="0"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormInput
                        name="mobile"
                        form={form}
                        type="number"
                        label="მობილურის ნომერი"
                        pattern="[0-9]*"
                        icon={images.InputPhone}
                        maxLength="9"
                        steps="0"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col captcha">
                    <CaptchaV2 ref={nodes.captcha} onChange={token => {
                        form.setValue("captcha", token)
                    }} />
                    <FormValidationMessage for={form.state.captcha} />
                </div>
            </div>
        </form>
    )
}

export default VtbForm(FormLogin, FormValues, FormValidations);