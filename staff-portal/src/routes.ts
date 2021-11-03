import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import CoursesList from './pages/Academics/CoursesList';
import CreateCourse from './pages/Academics/CreateCourse';
import ActionsList from './pages/Users/ActionsList';
import Departments from './pages/Academics/Departments';
import CreateProgram from './pages/Academics/CreateProgram';
import CampusList from './pages/Academics/CampusList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/courselist', exact: true, name: 'default', component: CoursesList },
    { path: '/createcourse', exact: true, name: 'default', component: CreateCourse },
    { path: '/actions', exact: true, name: 'default', component: ActionsList },
    { path: '/campuslist', exact: true, name: 'default', component: CampusList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/campuslist', exact: true, name: 'default', component: CampusList },
    { path: '/createprogram', exact: true, name: 'default', component: CreateProgram },

];
export default routes;
