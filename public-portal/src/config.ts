const Config = {
  appId: '5309142a-1a45-449e-a645-3977166cf64e',
  redirectUri: 'http://localhost:3000/sims/dashboard',
  scopes: [
    'user.read'
  ],
  authority: 'https://login.microsoftonline.com/poshit.onmicrosoft.com',
  STUDENT_URL: 'https://www.google.com/',
  STAFF_URL: 'https://www.facebook.com/',
  baseUrl: {
    authnzSrv: 'http://localhost:1338/authnz-service/v0.0.1',
    timetablingSrv: 'http://localhost:4250/timetabling-service/0.0.1',
    simSrv: 'http://localhost:4250/sim-service/0.0.1'
  }

}

export default Config
