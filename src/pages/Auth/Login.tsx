/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useContext, useState, useEffect } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { getAADUserDetails } from '../lib/GraphService';
import { AuthContext } from '../../App/context/AuthContext';
import { Button } from 'react-bootstrap';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import LinearProgress from '@mui/material/LinearProgress';
import background from '../../assets/images/staffbg.jpg';
import logo from '../../assets/images/logo-dark.png';
import Config from '../../config';
import publicClientApplication from '../lib/initializeMSAL';
import getAccessToken from '../lib/getToken';

const alerts: Alerts = new ToastifyAlerts();
const Login = () => {
    interface userInfoI {
        isStaff: boolean;
        isStudent: boolean;
    }

    const [linearDisplay, setLinearDisplay] = useState('none');
    const { setAuthState } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState<userInfoI>();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        localStorage.clear();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            loadPortal(userInfo);
            setAuthState(true);
        }
    }, [userInfo]);

    const login = async () => {
        setLinearDisplay('block');
        setDisabled(true);
        try {
            await loginAAD();
            await fetchUserDetails();
        } catch (err: any) {
            alerts.showError(err.message);
            setLinearDisplay('none');
            setDisabled(false);
        }
    };

    const loginAAD = async () => {
        try {
            // login via popup
            await publicClientApplication.handleRedirectPromise();
            await publicClientApplication.loginPopup({
                scopes: Config.scopes,
                prompt: 'select_account'
            });
            const aadUser: any = await getAADUserDetails(await getAccessToken(publicClientApplication, Config.scopes));

            sessionStorage.setItem('aadUser', JSON.stringify(aadUser));
            return aadUser;
        } catch (error) {
            console.log('error from login AAD function', error);
            throw new Error('We received an error from AAD, please ensure pop ups are enabled and try again');
        }
    };

    const fetchUserDetails: any = async () => {
        console.log('fetch user details called');
        authnzAxiosInstance
            .get('/users/me')
            .then((res) => {
                if (!res.data.isStaff) {
                    alerts.showError('You need to be a member of staff to access this app.');
                    localStorage.clear();
                    sessionStorage.clear();
                    setLinearDisplay('none');
                    setDisabled(false);
                    return;
                }
                sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                setUserInfo(res.data);
                setLinearDisplay('none');
                return res.data;
            })
            .catch((error) => {
                console.log('error from authnz service /users/me', error);
                throw error;
            });
    };
    const loadPortal = (userInfo?: userInfoI) => {
        if (!userInfo) {
            alerts.showError('Please login');
            return;
        }
        if (userInfo) {
            window.location.assign(Config.basename);
            return;
        }
    };
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <LinearProgress style={{ display: linearDisplay }} />
                <div className="login" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                    <img src={logo} alt="miog" />
                    <Button
                        style={{ backgroundColor: disabled ? 'gray' : '' }}
                        disabled={disabled}
                        variant="danger"
                        onClick={login}
                        size="lg"
                    >
                        Log In with your KPC E-mail Address
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Login;
