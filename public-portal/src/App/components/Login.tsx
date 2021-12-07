/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useContext, useState, useEffect } from 'react'
import Config from '../../config'
import { PublicClientApplication } from '@azure/msal-browser'
import { getUserDetails } from './utils/GraphService'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Login.css'
import axios from 'axios'
import { Alerts, ToastifyAlerts } from '../../lib/Alert'

const alerts: Alerts = new ToastifyAlerts()
const Login = () => {
  interface userInfoI {
    users_isStaff:boolean;
    users_isStudent:boolean;
  }
  const [, setError] = useState(null)
  const { setAuthState } = useContext(AuthContext)
  const [, setUser] = useState({})
  const ERR_USER_NOT_FOUND = 'Error, User not found'
  // let userInfo = {} as userInfoI
  const [userInfo, setUserInfo] = useState<userInfoI>()
  const history = useHistory()

  useEffect(() => {
    loadPortal(userInfo)
  }, [userInfo])

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
  })

  const login = async () => {
    try {
      await loginAAD()
      await fetchUserDetails()
    } catch (err: any) {
      logout(err)
    }
  }

  const logout = (err) => {
    setError(err.message)
    setAuthState(false)
    setUser({})
    console.log(err)
    localStorage.clear()
  }

  const loginAAD = async () => {
    // login via popup
    await publicClientApplication.loginPopup({
      scopes: Config.scopes,
      prompt: 'select_account'
    })
    const user: any = await getUserDetails(await getAccessToken(publicClientApplication, Config.scopes))
    setAuthState(true)
    setUser({
      displayName: user.displayName,
      email: user.mail || user.userPrincipalName
    })
    localStorage.setItem('User', JSON.stringify(user))
  }

  const getAccessToken = async (publicClientApplication: PublicClientApplication, scopes: any) => {
    try {
      const silentResult = await publicClientApplication.acquireTokenSilent({
        account: publicClientApplication.getAllAccounts()[0],
        scopes: scopes
      })
      localStorage.setItem('idToken', silentResult.idToken)
      return silentResult.accessToken
    } catch (err) {
      console.log(err)
      if (isInteractionRequired(err)) {
        const interactiveResult = await publicClientApplication.acquireTokenPopup({
          scopes: scopes
        })
        localStorage.setItem('idToken', interactiveResult.idToken)
        return interactiveResult.accessToken
      }
    }
  }

  const isInteractionRequired = (error: any) => {
    if (!error.message || error.message.length <= 0) {
      return false
    }
    return (
      error.message.indexOf('constent_required') > -1 ||
            error.message.indexOf('interaction_required') > -1 ||
            error.message.indexOf('login_required') > -1 ||
            error.message.indexOf('no_account_in_silent_request') > -1
    )
  }

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('idToken')
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const authnzSrv = Config.baseUrl.authnzSrv
    axios.get(`${authnzSrv}/users/me`, config)
      .then((res) => {
        localStorage.setItem('userInfo', JSON.stringify(res.data[0]))
        setUserInfo(() => { return res.data[0] })
      })
      .catch((error) => {
        alerts.showError(error.message)
      })
  }
  const loadPortal = (userInfo?:userInfoI) => {
    if (!userInfo) {
      return alerts.showError('Please login')
    }
    if (userInfo?.users_isStaff && userInfo?.users_isStudent) {
      alerts.showSuccess('Successful login')
      return history.push('/select')
    }
    if (userInfo?.users_isStudent) {
      alerts.showSuccess('Successful login')
      window.location.href = Config.STUDENT_URL
      return
    }
    if (userInfo?.users_isStaff) {
      alerts.showSuccess('Successful login')
      window.location.href = Config.STAFF_URL
      return
    }
    return alerts.showError(ERR_USER_NOT_FOUND)
  }

  return (
        <div onClick={login} className="login">
            Login
        </div>
  )
}

export default Login
