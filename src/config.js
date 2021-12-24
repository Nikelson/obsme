import util from "./utils";

export default {
    get isProduction() {
        return process.env.REACT_APP_ENV === 'production';
    },
    get env() {
        return process.env.REACT_APP_ENV;
    },
    recaptchaKeyV2: "6LcUai0cAAAAAIDuLFt64g990ouaiEXpwvuNxpNV",
    notificationOptions: {
        container: util.isMobile ? 'bottom-center' : 'top-right',
        insert: 'top',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
            duration: 15000,
            onScreen: true,
        },
        dismissError: {
            duration: 25000,
            onScreen: true,
            pauseOnHover: true,
        }
    }
}