import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import CoursesList from './pages/Academics/CoursesList';
import CreateCourse from './pages/Academics/CreateCourse';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/courselist', exact: true, name: 'default', component: CoursesList },
    { path: '/createcourse', exact: true, name: 'default', component: CreateCourse },

];
export default routes;
