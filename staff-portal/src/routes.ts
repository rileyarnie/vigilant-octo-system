import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import CoursesList from './pages/Academics/CoursesList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/courselist', exact: true, name: 'default', component: CoursesList },

];
export default routes;
