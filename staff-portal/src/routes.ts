import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import Departments from './pages/Academics/Departments';
import ProgramsList from './pages/Academics/ProgramsList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/programlist', exact: true, name: 'default', component: ProgramsList },

];
export default routes;
