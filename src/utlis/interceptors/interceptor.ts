import Config from '../../config';
import getAccessToken from '../../pages/lib/getToken';
import publicClientApplication from '../../pages/lib/initializeMSAL';
import { v4 as uuidV4 } from 'uuid';

import handleLogout from '../Logout';

export async function onRequestMade(requestConfig) {
    const idToken = await getAccessToken(publicClientApplication, Config.scopes);
    const tokenFromStorage = sessionStorage.getItem('idToken');
    const accessToken = tokenFromStorage === idToken ? idToken : tokenFromStorage;
    requestConfig.headers.authorization = `Bearer ${accessToken}`;
    requestConfig.headers['X-Request-ID'] = uuidV4();
    requestConfig.headers['X-Client-ID'] = 'staff-portal';
    return requestConfig;
}

export function onRequestFailed(error) {
    return Promise.reject(error);
}

export function onResponseSuccess(responseConfig) {
    return responseConfig;
}

export function onResponseFailed(error) {
    const customErrorObject: { status: number; message: string } = { status: 0, message: '' };
    const status = error.response?.status;
    //check if error from server is 401 then logout user
    if (status === 401) {
        handleLogout();
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
