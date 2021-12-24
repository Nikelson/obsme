import React, { useEffect, useRef, useState } from 'react';
import FormLogin from '../forms/FormLogin';
import MainButton from '../shared/components/MainButton';
import { FormValidationMessage, } from '../hoc/VtbForms';
import server from '../server';
import * as images from '../assets/images';
import useInterval from '../hooks/useInterval';
import moment from 'moment';

const Step3 = ({ onChange, setCachedData, cachedData, goToPrevStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [generciErrorCode, setGenericErrorCode] = useState(null);
    const [genericError, setGenericError] = useState(cachedData.stepOne?.genericError || "");
    const [otpTimerCount, setOtpTimerCount] = useState(null);

    useInterval(() => {
        if (otpTimerCount != null) {
            const secondsLeft = (otpTimerCount - 1);
            setOtpTimerCount(secondsLeft);
            localStorage.setItem("ots", secondsLeft);
            localStorage.setItem("otl", moment().format());
        } else {
            localStorage.removeItem("ots");
            localStorage.removeItem("otl");
        }
    }, otpTimerCount > 0 ? 1000 : null)

    const nodes = {
        checkClientForm: useRef(null)
    }

    let handleCaptchaReset;

    const handleSubmit = e => {
        e.preventDefault();

        const form = nodes.checkClientForm.current;

        if (!form.isValid()) {
            return;
        }


        if (!validateOtpTimer()) {
            setGenericError("");
            setGenericErrorCode(null);
            return;
        }

        setIsLoading(true);

        setGenericError("");
        setGenericErrorCode(null);

        const formData = form.getData();
        const payload = {
            identificationCode: formData.personalNumber,
            organizationType: formData.organizationType,
            mobile: formData.mobile,
            g_recaptcha_response: formData.captcha,
        };

        server.VerifyClient_Post({ payload }).then(response => {
            if (response.isSuccess) {
                setCachedData(state => ({
                    ...state,
                    requestId: response.data.requestId,
                    client: payload,
                }), newState => {
                    // console.log("new state:", newState);

                    localStorage.setItem("c", JSON.stringify({ mobile: payload.mobile }));

                    handleOtpVerify(payload.mobile, response.data.requestId);
                });
            } else {
                setGenericError(response.errors.message || response.errors.ExceptionMessage || response.errors.text)
                setGenericErrorCode(response.errors.messageCode > 0 ? response.errors.messageCode : null);
                setOtpTimerCount(null);
                setIsLoading(false);
                handleCaptchaReset();
            }
        })
    }

    const setTimeLeftErrorMessage = (secondsToCount) => {
        let secondsLeft = secondsToCount || localStorage.getItem("ots");

        const lastSecondSet = localStorage.getItem("otl");

        if (lastSecondSet && !secondsToCount) {
            const now = moment();

            const diff = moment.duration(now.diff(lastSecondSet));
            if (diff > 0) {
                secondsLeft = parseInt(secondsLeft) - parseInt(diff.asSeconds());
            }

        }

        secondsLeft && setOtpTimerCount(secondsLeft);

        return secondsLeft > 0;
    }

    useEffect(() => {
        if (cachedData?.stepOne?.otpExpirationSeconds > 0) {
            setTimeLeftErrorMessage(cachedData.stepOne.otpExpirationSeconds)
        }
    }, [])

    const validateOtpTimer = () => {
        let clientInfo = localStorage.getItem("c");

        if (clientInfo) {
            try {
                clientInfo = JSON.parse(clientInfo);

                const form = nodes.checkClientForm.current;
                const formData = form.getData();

                return !setTimeLeftErrorMessage()

                if (clientInfo.mobile == formData.mobile) {
                    return !setTimeLeftErrorMessage()
                }
            } catch (error) {
                return true;
            }
        }
        return true;
    }

    const handleOtpVerify = (mobile, requestId) => {
        if (isLoading) {
            return;
        }

        server.OtcSend_Post({
            payload: {
                phoneNumber: mobile,
                requestId: requestId,
            }
        }).then(response => {
            if (response.isSuccess) {
                setCachedData(state => ({
                    ...state,
                    otpCodeTemp: response.data.code,
                    otpExpirationSeconds: response.data.expirationSeconds,
                }), newState => {
                    onChange();
                });
            } else if (response.data.messageCode == 13) {
                setTimeLeftErrorMessage(response.data.expirationSeconds)
            } else {
                setOtpTimerCount(null);
                setGenericError(response.errors.message || response.errors.ExceptionMessage || response.errors.text)
                setGenericErrorCode(response.errors.messageCode > 0 ? response.errors.messageCode : null);
            }
            setIsLoading(false);
        });

    }

    const handleFormInputChange = inputObj => {
        if (
            (inputObj.inputName === "mobile" || inputObj.inputName === "personalNumber")
            && generciErrorCode == 5
        ) {
            setGenericError("")
        }
    }

    return (
        <section className="card">

            <div className="card-top-nav row">
                <div className="col back text-center">
                    <span onClick={goToPrevStep} className="back-btn">უკან</span>
                </div>
            </div>

            <div className="card-header text-center">
                <h2 className="title">კლიენტად რეგისტრაცია</h2>
            </div>

            <div className="card-content text-center">
                <FormLogin
                    ref={nodes.checkClientForm}
                    id="check-client-form"
                    onSubmit={handleSubmit}
                    onInputChange={handleFormInputChange}
                    setCaptchaReset={(callbackMethod) => (handleCaptchaReset = callbackMethod)}
                />
                <FormValidationMessage isValid={!(otpTimerCount > 0)} message={`გთხოვთ, სცადოთ ხელახლა ${otpTimerCount} წამში.`} />
                <FormValidationMessage isValid={!genericError} message={genericError} />

                <div className="buttons text-center">
                    <MainButton disabled={otpTimerCount > 0} isLoading={isLoading} form="check-client-form" type="submit">შემდეგი</MainButton>
                </div>
            </div>

        </section>
    )
}

export default Step3;