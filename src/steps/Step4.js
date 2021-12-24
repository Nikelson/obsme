import React, { useEffect, useState } from 'react';
import MainButton from '../shared/components/MainButton';

import * as images from '../assets/images';
import useInterval from '../hooks/useInterval';
import { FormValidationMessage, } from '../hoc/VtbForms';
import server from '../server';
import ReactCodeInput from 'react-code-input';
import moment from 'moment';

const StepTwo = ({ onChange, setCachedData, cachedData, goToStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [codeTemp, setCodeTemp] = useState(cachedData.otpCodeTemp || "");
    const [otpTimerCount, setOtpTimerCount] = useState(null);
    const [otpValue, setOtpValue] = useState("");

    useInterval(() => {
        if (otpTimerCount != null) {
            const secondsLeft = (otpTimerCount - 1);
            setOtpTimerCount(secondsLeft);
            localStorage.setItem("ots", secondsLeft);
            localStorage.setItem("otl", moment().format());
        } else {
            localStorage.removeItem("ots");
        }
    }, otpTimerCount > 0 ? 1000 : null)

    useEffect(() => {
        setOtpTimerCount(cachedData.otpExpirationSeconds || 120);
    }, []);

    useEffect(() => {
        const inputs = document.getElementsByTagName("input");

        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            element.addEventListener("wheel", handleMouseWheel)
        }
        return () => {
            for (let index = 0; index < inputs.length; index++) {
                const element = inputs[index];
                element.removeEventListener("wheel", handleMouseWheel)
            }
        }
    }, []);

    const handleMouseWheel = e => {
        e.target.blur();
    }

    const handleOtpVerify = () => {
        if (isLoading || isVerifying || (typeof otpTimerCount == "number" && otpTimerCount > 0)) {
            return;
        }

        setIsLoading(true);
        setOtpError("")

        server.OtcSend_Post({
            payload: {
                phoneNumber: cachedData.client?.mobile,
                requestId: cachedData.requestId,
            }
        }).then(response => {
            if (response.isSuccess) {
                setCachedData(state => ({
                    ...state,
                    otpCodeTemp: response.data.code,
                    otpExpirationSeconds: response.data.expirationSeconds,
                }), newState => {
                    setCodeTemp(response.data.code);
                    setOtpTimerCount(response.data.expirationSeconds);
                });
            } else if (response.errors.message) {
                setOtpError(response.errors.message)
            } else if (response.errors.ExceptionMessage) {
                setOtpError(response.errors.ExceptionMessage)
            }
            setIsLoading(false);
        });

    }

    const isoOtpValid = () => otpValue.length == 4;

    const handleOtpSubmit = (e) => {
        e.preventDefault();

        setIsVerifying(true);
        setOtpError("");

        server.OtcVerify_Post({
            payload: {
                phoneNumber: cachedData.client?.mobile,
                requestId: cachedData.requestId,
                code: otpValue,
            }
        }).then(response => {
            if (response.isSuccess) {
                onChange();
                localStorage.removeItem("ots");
                localStorage.removeItem("otl");
            } else if (response.errors && response.errors.messageCode == 42) {
                setCachedData(state => ({
                    ...state,
                    stepOne: {
                        // genericError: response.errors.message,
                        otpExpirationSeconds: response.data.expirationSeconds,
                    }
                }), newState => {
                    goToStep(1);
                });

            } else if (response.errors.message) {
                setOtpError(response.errors.message)
            }
            setIsVerifying(false);
        });

    }

    return (
        <section className="card">
            <div className="card-header text-center">
                <img className="icon" src={images.IconSms} />
                <h2 className="title">მიუთითეთ სმს კოდი</h2>
                {isLoading ?
                    <span className="title-sub">გთხოვთ მოითმინოთ</span>
                    :
                    <span className="title-sub">კოდი გამოგზავნილია ნომერზე: {cachedData.client?.mobile}</span>
                }
            </div>

            <div className="card-content text-center">
                <form id="check-otp-form" onSubmit={handleOtpSubmit}>
                    <ReactCodeInput
                        type="number"
                        className="otp-input"
                        value={otpValue}
                        onChange={setOtpValue}
                        filterKeyCodes={[69]}
                        onWheel={(e) => e.target.blur()}
                    />
                </form>

                {codeTemp && <span>{codeTemp}</span>}

                <FormValidationMessage isValid={!otpError} message={otpError} />

                <span className="otp-timer" style={isLoading ? { visibility: 'hidden' } : {}}>
                    {otpTimerCount ?
                        `კოდს ${otpTimerCount} წამში გასდის ვადა`
                        :
                        "კოდს ვადა გაუვიდა"
                    }
                </span>

                <span
                    onClick={handleOtpVerify}
                    className={`otp-resend${otpTimerCount ? '' : ' active'}`}>
                    თავიდან გამოგზავნა
                </span>

                <div className="buttons text-center">
                    <MainButton
                        disabled={!isoOtpValid()}
                        isLoading={isVerifying}
                        form="check-otp-form"
                        type="submit">
                        შემდეგი
                    </MainButton>
                </div>
            </div>
        </section>
    )
}

export default StepTwo;