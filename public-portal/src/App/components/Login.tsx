import { useContext, useState } from 'react';
import Config from '../../config';
import { PublicClientApplication } from '@azure/msal-browser';
import { getUserDetails } from './utils/GraphService';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import axios from 'axios';
import SelectPortal from './SelectPortal/select';

const Login = () => {
    const [error, setError] = useState(null);
    const { isAuthenticated, setAuthState } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const ERR_USER_NOT_FOUND = 'ERR_USER_NOT_FOUND'
    let  userInfo:any = {}
    let history = useHistory();

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
            await loginAAD()
            await fetchUserDetails()
            loadPortal()
        } catch (err: any) {
            logout(err)
        }
    };

    const logout = (err) => {
        setError(err.message);
        setAuthState(false);
        setUser({});
        console.log(err);
        localStorage.clear()
    };

    const loginAAD = async () => {
         //login via popup
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
    }

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

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("idToken")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const base_url = Config.baseUrl.timetablingSrv
        axios.get(`${base_url}/users/me`,config).then((res)=>{
            if(res.status === 200){ 
            localStorage.setItem("userInfo",JSON.stringify(res.data[0]))
            userInfo = res.data[0]
            }
            throw new Error(`Error:${res.status}:${res.statusText}`)
        })
    }

    const loadPortal = () => {
      if (userInfo.users_isStaff && userInfo.users_isStudent) {
        history.push("/select");
        return;
      }
      if (userInfo.users_isStudent) {
        window.location.href = Config.STUDENT_URL;
        return;
      }
      if (userInfo.users_isStaff) {
        window.location.href = Config.STAFF_URL;
        return;
      }
      console.log(ERR_USER_NOT_FOUND);
        return;
    };

    return (
        <div onClick={login} className="login">
            Login
        </div>
    );
};

export default Login; 