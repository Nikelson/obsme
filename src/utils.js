import is from "is_js";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile,
    isTablet,
} from "react-device-detect";

const util = {
    inputToObj: (element) => {
        const { name, type, value, checked, id } = element;
        if (name) {
            const stateObj = {};
            stateObj[name] = type === 'checkbox' ? checked : value;
            return stateObj;
        }
        console.warn(`Please set #${id} - ${type} input name attribute!!!`);
    },
    objToString: (obj) => {
        let queryString = [];
        for (let prop of Object.keys(obj)) {
            queryString.push(encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]));
        }
        return queryString.join("&");
    },
    getRandomColor: () => {
        const letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 13)];
        }
        return color;
    },
    serialize: (form, format) => {
        if (!form || form.nodeName !== "FORM")
            return;

        const inputs = form.elements;
        let dataObj = {};
        let dataArray = [];

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value !== '' && inputs[i].type !== 'file') {
                switch (inputs[i].type) {
                    case 'radio':
                        if (inputs[i].checked) {
                            dataArray.push(`${inputs[i].name}=${inputs[i].value}`);
                            dataObj[inputs[i].name] = inputs[i].value;
                        }
                        break;

                    case 'checkbox':
                        dataArray.push(`${inputs[i].name}=${inputs[i].checked}`);
                        dataObj[inputs[i].name] = inputs[i].checked;
                        break;

                    default:
                        dataArray.push(`${inputs[i].name}=${inputs[i].value}`);
                        dataObj[inputs[i].name] = inputs[i].value;
                }
            }
        }

        if (format === 'json')
            return JSON.stringify(dataObj);

        if (format === 'query')
            return dataArray.join('&');

        return dataObj;
    },
    shortText: (string, props) => {
        const p = props || {};
        if (string) {
            const max = p.maxLength || 20, start = p.startLength || 10, end = p.endLength || 10;
            if (string.length > max) {
                return string.substr(0, start) + '...' + string.substr(string.length - end, string.length);
            }
        }
        return string;
    },
    calcChildrenHeight: node => {
        const childs = node.children;
        let height = 0;
        for (let i = 0; i < childs.length; i++) {
            height += childs[i].offsetHeight;
        }
        return height;
    },
    getUniqId: () => {
        return Math.random().toString(36).substr(2, 9);
    },
    toggleValue: (bool, valWhenTrue = '', valWhenFalse = '') => bool ? valWhenTrue : valWhenFalse,
    isNullOrUndefined: value => (value === null || value === undefined),
    parseJWT: token => {
        let parsedPayload;
        const payloadJSON = atob(token.split('.')[1]);
        try {
            parsedPayload = JSON.parse(payloadJSON);
        } catch (error) {

        }
        return parsedPayload;
    },
    getQueryParam: (name, url = window.location.href) => {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    get isMobile() {
        return isMobile;
        return (is.mobile() || isMobile);
    },
    get isTablet() {
        return isTablet;
        return (is.tablet() || isTablet);
    },
    get isLandscape() {
        if (window.innerHeight < window.innerWidth) {
            return true;
        }
        return false;


        let orientation = null;

        if (window.screen && window.screen.orientation) {
            orientation = (window.screen.orientation || {}).type || window.screen.mozOrientation || window.screen.msOrientation;
        }
        else if (!isNaN(window.orientation)) {

            switch (window.orientation) {
                case 0:
                    orientation = "portrait-primary";
                    break;

                case 180:
                    orientation = "portrait-secondary";
                    break;

                case -90:
                    orientation = "landscape-primary";
                    break;

                case 90:
                    orientation = "landscape-secondary";
                    break;
            }
        }
        // alert(orientation  + window.orientation)
        if (orientation === "portrait-primary" || orientation === "portrait-secondary") {
            return false;
        } else if (orientation === null) {
            return null;
        }

        return true;
    }
};

export default util;
