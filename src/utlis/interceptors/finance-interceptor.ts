import axios from 'axios';
import Config from '../../config';
import { onRequestFailed, onRequestMade, onResponseFailed, onResponseSuccess } from './interceptor';

const baseURL = Config.baseUrl.financeSrv;
const headers = {};

export const financeAxiosInstance = axios.create({
    baseURL,
    headers
});

financeAxiosInstance.interceptors.request.use(onRequestMade, onRequestFailed);
financeAxiosInstance.interceptors.response.use(onResponseSuccess, onResponseFailed);
