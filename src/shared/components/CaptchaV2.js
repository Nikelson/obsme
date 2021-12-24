import { useEffect, forwardRef, useImperativeHandle, } from "react";
import useStateCallback from "../../hooks/useStateCallback";

const globalConfig = window.globalConfig;

window.captcha = null;

const CaptchaV2 = forwardRef(({ onChange }, ref) => {
    const [captchaToken, setCaptchaToken] = useStateCallback();

    useImperativeHandle(ref, () => ({ resetCaptcha }));

    const verifyCallback = (response) => {
        setCaptchaToken(response, () => {
            onChange && onChange(response);
        })
    }

    const expiredCallback = (response) => {
        setCaptchaToken("", () => {
            onChange && onChange("");
        })
    }

    const errorCallback = (response) => {
        setCaptchaToken("", () => {
            onChange && onChange("");
        })
    }

    useEffect(() => {
        if (window.captcha != null) {
            renderCaptcha()
        }
    }, []);

    const resetCaptcha = () => {
        window.grecaptcha.reset();
        setCaptchaToken("", () => {
            onChange && onChange("");
        })
    }

    const renderCaptcha = () => {
        window.captcha = window.grecaptcha.render('g-recaptcha', {
            'sitekey': globalConfig.recaptchaKeyV2,
            'theme': 'light',
            'callback': verifyCallback,
            'expired-callback': expiredCallback,
            'error-callback': errorCallback,
            // 'hl': 'ka',
            'size': 'normal'
        })
    }

    const onloadCallback = function (response) {
        window.grecaptcha.ready(function () {
            if (window.captcha == null) {
                renderCaptcha()
            }
        })
    }

    useEffect(() => {
        if (!document.getElementById("recaptcha-ref")) {
            const script = document.createElement("script");
            script.id = "recaptcha-ref";
            script.src = `https://www.google.com/recaptcha/api.js`;
            script.async = true;
            script.defer = true;
            script.onload = onloadCallback

            document.body.appendChild(script);
        }
    }, [])

    return <div id="g-recaptcha" className="recaptcha" />
});

export default CaptchaV2;