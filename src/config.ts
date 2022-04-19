/* eslint-disable linebreak-style */
const Config = {
    appId: '5309142a-1a45-449e-a645-3977166cf64e',
    redirectUri: 'http://localhost:3001/login',
    authority: 'https://login.microsoftonline.com/poshit.onmicrosoft.com',
    scopes: ['user.read'],
    defaultPath: '/dashboard',
    basename: '/staff',
    layout: 'horizontal',
    collapseMenu: false,
    layoutType: 'menu-dark',
    headerBackColor: '',
    fullWidthLayout: true,
    navFixedLayout: true,
    headerFixedLayout: true,
    baseUrl: {
        authnzSrv: 'http://localhost:1338/authnz-service/v0.0.1',
        timetablingSrv: 'http://localhost:4250/timetabling-service/0.0.1',
        financeSrv: 'http://localhost:4255/finance-service/0.0.1',
        simsSrv: 'http://localhost:4500/sim-service/v0.0.1'
    }
};
export default Config;
