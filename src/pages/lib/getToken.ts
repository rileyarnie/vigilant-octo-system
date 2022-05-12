import { PublicClientApplication } from '@azure/msal-browser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInteractionRequired = (error: any) => {
    if (!error.message || error.message.length <= 0) {
        return false;
    }
    return (
        error.message.indexOf('constent_required') > -1 ||
        error.message.indexOf('interaction_required') > -1 ||
        error.message.indexOf('login_required') > -1 ||
        error.message.indexOf('no_account_in_silent_request') > -1
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAccessToken = async (publicClientApplication: PublicClientApplication, scopes: any) => {
    try {
        const silentResult = await publicClientApplication.acquireTokenSilent({
            account: publicClientApplication.getAllAccounts()[0],
            scopes: scopes
        });
        sessionStorage.setItem('idToken', silentResult.idToken);

        return silentResult.accessToken;
    } catch (err) {
        if (isInteractionRequired(err)) {
            console.log('error fetching access token from AAD. Retrying interactively', err);
            const interactiveResult = await publicClientApplication.acquireTokenPopup({
                scopes: scopes
            });
            sessionStorage.setItem('idToken', interactiveResult.idToken);

            return interactiveResult.accessToken;
        }
        throw new Error('AAD failed to provide the token for your session. Please try again');
    }
};

export default getAccessToken;
