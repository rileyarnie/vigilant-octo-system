import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import Departments from './pages/Academics/Departments';
import CreateProgram from './pages/Academics/CreateProgram';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/createprogram', exact: true, name: 'default', component: CreateProgram },

];
export default routes;
