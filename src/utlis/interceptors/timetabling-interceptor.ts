import axios from 'axios';
import Config from '../../config';
import {onRequestFailed, onRequestMade, onResponseFailed, onResponseSuccess} from './interceptor';

const baseURL = Config.baseUrl.timetablingSrv;
const headers = {};

export const timetablingAxiosInstance = axios.create({
    baseURL,
    headers
});

timetablingAxiosInstance.interceptors.request.use(onRequestMade, onRequestFailed);
timetablingAxiosInstance.interceptors.response.use(onResponseSuccess, onResponseFailed);
