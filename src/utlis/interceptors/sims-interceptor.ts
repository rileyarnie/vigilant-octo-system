import axios from 'axios';
import Config from '../../config';

const baseURL = Config.baseUrl.simsSrv;
const headers = {};

export const simsAxiosInstance = axios.create({
    baseURL,
    headers
});

simsAxiosInstance.interceptors.request.use(
    (requestConfig) => {
        requestConfig.headers.authorization = `Bearer ${localStorage.getItem('idToken')}`;
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);
simsAxiosInstance.interceptors.response.use(
    (responseConfig) => {
        return responseConfig;
    },
    (error) => {
        const customErrorObject: { status: number; message: string } = { status: 0, message: '' };
        const status = error.response?.status;

        //check if error from server is 401 then logout user
        if (status === 401) {
            localStorage.removeItem('idToken');
            window.location.replace('/login');
        }

        //check if error from server is 403
        if (status === 403) {
            customErrorObject.status = status;
            customErrorObject.message = 'You are not authorized to perform this action';
            return Promise.reject(customErrorObject);
        }

        //check if error from server is 404
        if (status === 404) {
            customErrorObject.status = status;
            customErrorObject.message = 'The resource was not found, kindly refresh';
            return Promise.reject(customErrorObject);
        }

        //check if error from server is 4XX
        if (status >= 400 && status < 500) {
            customErrorObject.status = status;
            customErrorObject.message = 'Looks like something was wrong with your input, please validate before proceeding ';
            return Promise.reject(customErrorObject);
        }
        //check if error from server is 3XX or 5XX
        if ((status >= 300 && status < 400) || (status >= 500 && status < 560)) {
            customErrorObject.status = status;
            customErrorObject.message = 'Something wicked happened, please try again. Contact system admin if the issue persists';
            return Promise.reject(customErrorObject);
        }

        return Promise.reject(error);
    }
);
