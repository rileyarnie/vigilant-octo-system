import axios from 'axios';
import Config from '../../config';
import {onRequestFailed, onRequestMade, onResponseFailed, onResponseSuccess} from './interceptor';

const baseURL = Config.baseUrl.authnzSrv;
const headers = {};

export const authnzAxiosInstance = axios.create({
    baseURL,
    headers
});

authnzAxiosInstance.interceptors.request.use(onRequestMade, onRequestFailed);

authnzAxiosInstance.interceptors.response.use(onResponseSuccess, onResponseFailed);
