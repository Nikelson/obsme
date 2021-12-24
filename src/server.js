import axios, { CancelToken } from 'axios';
import util from "./utils";
import { ResponseModel } from './models/genericAppModels';
import notify from './notifications';
import config from './config';

// const testAsProd = util.getQueryParam("api") == "prod";
// const conf = testAsProd ? window.globalConfigProd : window.globalConfig;

const { api, locale } = window.globalConfig;

class Server {
    generateUrlWithQueryString = (url, data) => {
        if (data && typeof data == 'object') {
            url = `${url}?${util.objToString(data)}`;
        }
        return url;
    }

    isSuccess = (response) => {
        if (response.data && response.data.statusCode >= 200 && response.data.statusCode < 300) {
            return true;
        }
        return false;
    }

    request = async (type, path, {
        payload,
        cancels,
        query = null,
        progress = null,
        logout = false,
        showGenericError = true,
    } = {}) => {
        let response = null;
        let url = `${api.url}/${path}`;
        let options = {
            crossdomain: true,
            headers: {}
        }

        options.headers['x-application-id-header'] = api.id;
        options.headers['x-hmac-header'] = api.hmac;

        if (progress !== null) {
            // options.headers['Content-Type'] = 'multipart/form-data; charset=utf-8';
            options.onUploadProgress = (e) => {
                let percent = Math.round((e.loaded * 100) / e.total);
                progress(e, { percent });
            }
        }

        if (cancels) {
            options.cancelToken = new CancelToken(function executor(c) {
                cancels.push(c);
            });
        }

        try {
            switch (type.toLowerCase()) {
                case 'get':
                case 'delete':
                    url = this.generateUrlWithQueryString(url, query);
                    response = await axios[type](url, options);
                    break;

                case 'post':
                case 'put':
                case 'patch':
                default:
                    if (query)
                        url = this.generateUrlWithQueryString(url, query);
                    response = await axios[type](url, payload, options);
                    break;
            }

            if (response.data) {
                response.data.statusCode = response.data.StatusCode || response.data.statusCode;
                response.data.message = response.data.Message || response.data.message;
            }

            if (this.isSuccess(response)) {
                return new ResponseModel({
                    data: response.data.result,
                    status: response.status,
                    appStatus: response.data.statusCode,
                });
            }
            else {
                let title = "შეცდომა";
                let text = response.data.Message || response.data.message;
                if (!config.isProduction) {
                    title = `HTTP Status: ${response.status}; StatusCode: ${response.data?.statusCode}; ${response.data.result?.messageCode ? 'Error: ' + response.data.result.messageCode : ''}`;
                    text = `${path}\n${response.data.message}${response.data.result ? '\n' + JSON.stringify(response.data.result) : ''}`;
                }
                if (showGenericError && response.status != 401) {
                    notify.error({
                        title: title,
                        message: text
                    });
                } else if (response.data.StatusCode == 500) {
                    notify.error({
                        title: title,
                        message: text
                    });
                }

                return new ResponseModel({
                    isSuccess: false,
                    errors: response.data.ResponseException || response.data.result,
                    errorMessage: response.data.message,
                    status: response.status,
                    appStatus: response.data.statusCode,
                    data: response.data.result,
                });
            }

        } catch (error) {
            let errorData = error.response ? {
                message: error.response.data,
                status: error.response.status
            } : {
                message: error.message,
                status: -1
            };

            if (typeof errorData.message !== "string") {
                try {
                    errorData.message = JSON.stringify(errorData.message);
                }
                catch (e) { }
            }

            if (showGenericError && errorData.status != 401) {
                let title = "შეცდომა";
                let text = errorData.message;
                if (!config.isProduction) {
                    title = `Error ${errorData.status}`;
                    text = `API Action: ${path}\n${errorData.message}`;
                }

                notify.error({
                    title: title,
                    message: text
                });
                // alert(`${title} ${text}`);
            }

            // if (errorData.status == 401) {
            //     if (!logout) {
            //         window.location = '/logout';
            //     }
            // }

            return new ResponseModel({
                isSuccess: false,
                errors: errorData.message,
                status: errorData.status,
            });
        }
    }

    VerifyClient_Post = args => this.request('post', 'client/verifyJuridical', { ...args });
    RegisterClient_Post = args => this.request('post', 'client/RegisterJuridical', { ...args });

    /** * data: {payload: {"phoneNumber": "string", "requestId": "string"}} */
    OtcSend_Post = args => this.request('post', 'otc/send', { ...args });
    /** * data: {payload: {"requestId": "string", "phoneNumber": "string", "code": "string"}} */
    OtcVerify_Post = args => this.request('post', 'otc/verify', { ...args });

    /** * data: {payload: {"requestId": "string"}} */
    GenerateKvalifikaUrl_Post = args => this.request('post', 'Liveness/GenerateUrl', { ...args });
    /** * data: {payload: {"requestId": "string"}} */
    // GetSessionData_Post = args => this.request('post', 'Liveness/GetSessionData', { ...args });
    GetSessionData_Get = args => this.request('get', 'Liveness/GetSessionData', { ...args });

    Cities_Get = args => this.request('get', 'infrastructure/Cities', { ...args });
    Countries_Get = args => this.request('get', 'infrastructure/Countries', { ...args });
    DeliveryAddresses_Get = args => this.request('get', 'infrastructure/DeliveryAddresses', { ...args });
    PositionTypes_Get = args => this.request('get', 'infrastructure/PositionTypes', { ...args });

}

export default new Server();