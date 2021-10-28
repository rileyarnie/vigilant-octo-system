import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },

];
export default routes;
