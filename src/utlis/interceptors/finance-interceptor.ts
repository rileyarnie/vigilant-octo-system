import axios from 'axios';
import Config from '../../config';

const baseURL = Config.baseUrl.financeSrv;
const headers = {};

export const financeAxiosInstance = axios.create({
    baseURL,
    headers
});

financeAxiosInstance.interceptors.request.use(
    (requestConfig) => {
        requestConfig.headers.authorization = `Bearer ${localStorage.getItem('idToken')}`;
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);
financeAxiosInstance.interceptors.response.use(
    (responseConfig) => {
        return responseConfig;
    },
    (error) => {
        //check if error from server is 401 then logout user

        if (error.response?.status === 401) {
            localStorage.removeItem('idToken');
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);
