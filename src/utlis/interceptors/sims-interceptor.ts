import axios from 'axios';
import Config from '../../config';
import {onRequestFailed, onRequestMade, onResponseFailed, onResponseSuccess} from './interceptor';

const baseURL = Config.baseUrl.simsSrv;
const headers = {};

export const simsAxiosInstance = axios.create({
    baseURL,
    headers
});

simsAxiosInstance.interceptors.request.use(onRequestMade, onRequestFailed);
simsAxiosInstance.interceptors.response.use(onResponseSuccess, onResponseFailed);
