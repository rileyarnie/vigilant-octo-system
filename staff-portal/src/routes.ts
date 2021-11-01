import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import Departments from './pages/Academics/Departments';
import CreateProgram from './pages/Academics/CreateProgram';
import CampusList from './pages/Academics/CampusList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/campuslist', exact: true, name: 'default', component: CampusList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/createprogram', exact: true, name: 'default', component: CreateProgram },

];
export default routes;
