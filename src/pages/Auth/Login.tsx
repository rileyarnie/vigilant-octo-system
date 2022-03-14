/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { getUserDetails } from '../lib/GraphService';
import Config from '../../config';
import { AuthContext } from '../../App/context/AuthContext';
import { Button } from 'react-bootstrap';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';

const alerts: Alerts = new ToastifyAlerts();
const Login = () => {
    interface userInfoI {
        isStaff: boolean;
        isStudent: boolean;
    }
    // const [, setError] = useState(null);
    const { setAuthState } = useContext(AuthContext);
    const [, setUser] = useState({});
    // const ERR_USER_NOT_FOUND = 'Error, User not found';
    // let userInfo = {} as userInfoI
    const [userInfo, setUserInfo] = useState<userInfoI>();

    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            loadPortal(userInfo);
            setAuthState(true);
        }
    }, [userInfo]);

    // Initialize MSAL Object
    const publicClientApplication = new PublicClientApplication({
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
            await loginAAD();
            await fetchUserDetails();
        } catch (err: any) {
            logout(err);
        }
    };

    const logout = (err) => {
        // setError(err.message);
        // setAuthState(false);
        // setUser({});
        console.log(err);
        // localStorage.clear();
    };

    const loginAAD = async () => {
        // login via popup
        await publicClientApplication.handleRedirectPromise();
        await publicClientApplication.loginPopup({
            scopes: Config.scopes,
            prompt: 'select_account'
        });
        const user: any = await getUserDetails(await getAccessToken(publicClientApplication, Config.scopes));
        // setAuthState(true);
        setUser({
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName
        });
        localStorage.setItem('User', JSON.stringify(user));
        return user;
    };

    const getAccessToken = async (publicClientApplication: PublicClientApplication, scopes: any) => {
        try {
            const silentResult = await publicClientApplication.acquireTokenSilent({
                account: publicClientApplication.getAllAccounts()[0],
                scopes: scopes
            });
            localStorage.setItem('idToken', silentResult.idToken);
            return silentResult.accessToken;
        } catch (err) {
            console.log(err);
            if (isInteractionRequired(err)) {
                const interactiveResult = await publicClientApplication.acquireTokenPopup({
                    scopes: scopes
                });
                localStorage.setItem('idToken', interactiveResult.idToken);
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

    const fetchUserDetails: any = async () => {
        authnzAxiosInstance
            .get('/users/me')
            .then((res) => {
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                setUserInfo(res.data);
                return res.data;
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };
    const loadPortal = (userInfo?: userInfoI) => {
        if (!userInfo) {
            alerts.showError('Please login');
            return;
        }
        if (userInfo) {
            window.location.assign('http://localhost:3001');
            return;
        }
    };

    return (
        <div className="login" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <Button onClick={login} size="lg">
                Log In with your KPC E-mail Address
            </Button>
        </div>
    );
};

export default Login;
