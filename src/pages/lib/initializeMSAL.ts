import { PublicClientApplication } from '@azure/msal-browser';
import Config from '../../config';

// Initialize MSAL Object
const publicClientApplication = new PublicClientApplication({
    auth: {
        clientId: Config.appId,
        redirectUri: Config.redirectUri,
        authority: Config.authority,
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true
    }
});

export default publicClientApplication;
