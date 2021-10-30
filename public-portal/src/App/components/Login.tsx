import { useContext, useState } from 'react';
import Config from '../../config';
import { PublicClientApplication } from '@azure/msal-browser';
import { getUserDetails } from './utils/GraphService';
//import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [error, setError] = useState(null);
    const { isAuthenticated, setAuthState } = useContext(AuthContext);
    const [user, setUser] = useState({});

    //Initialize MSAL Object
    let publicClientApplication = new PublicClientApplication({
        auth: {
            clientId: Config.appId,
            redirectUri: Config.redirectUri,
            authority: Config.authority,
            navigateToLoginRequestUrl: false
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: true
        }
    });

    const login = async () => {
        try {
            //login via redirect
            await publicClientApplication.loginPopup({
                scopes: Config.scopes,
                prompt: 'select_account'
            });
            const user: any = await getUserDetails(await getAccessToken(publicClientApplication, Config.scopes));
            setAuthState(true);
            setUser({
                displayName: user.displayName,
                email: user.mail || user.userPrincipalName
            });
            localStorage.setItem('User', JSON.stringify(user));
        } catch (err: any) {
            setError(err.message);
            setAuthState(false);
            setUser({});
            console.log(err);
        }
    };

    const logout = () => {
        publicClientApplication.logoutPopup();
    };

    const getAccessToken = async (publicClientApplication: PublicClientApplication, scopes: any) => {
        try {
            var silentResult = await publicClientApplication.acquireTokenSilent({
                account: publicClientApplication.getAllAccounts()[0],
                scopes: scopes
            });
            localStorage.setItem("idToken",silentResult.idToken)
            return silentResult.accessToken;

        } catch (err) {
            console.log(err);
            if (isInteractionRequired(err)) {
                var interactiveResult = await publicClientApplication.acquireTokenPopup({
                    scopes: scopes
                });
                localStorage.setItem("idToken",interactiveResult.idToken)
                return interactiveResult.accessToken;
            }
        }
    };

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

    return (
        <div onClick={login} className="login">
            Login
        </div>
    );
};

export default Login;