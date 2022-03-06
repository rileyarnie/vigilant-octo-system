import axios from 'axios';
import Config from '../../config';

const baseURL = Config.baseUrl.timetablingSrv;
const headers = {};

export const timetablingAxiosInstance = axios.create({
    baseURL,
    headers
});

timetablingAxiosInstance.interceptors.request.use(
    (requestConfig) => {
        requestConfig.headers.authorization = `Bearer ${localStorage.getItem('idToken')}`;
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);
timetablingAxiosInstance.interceptors.response.use(
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
