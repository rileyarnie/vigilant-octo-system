import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import CoursesList from './pages/Academics/CoursesList';
import CreateCourse from './pages/Academics/CreateCourse';
import ActionsList from './pages/Users/ActionsList';
import Departments from './pages/Academics/Departments';
import CreateProgram from './pages/Academics/CreateProgram';
import CampusDetails from './pages/Academics/CampusDetails';
import CreateCampus from './pages/Academics/CreateCampus';
import CampusList from './pages/Academics/CampusList';
import TrainerList from './pages/Academics/TrainerList';

import VenueList from './pages/Academics/VenueList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/createcampus', exact: true, name: 'default', component: CreateCampus },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/campuslist', exact: true, name: 'default', component: CampusList },
    { path: '/trainerlist', exact: true, name: 'default', component: TrainerList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/createprogram', exact: true, name: 'default', component: CreateProgram },
    { path: '/campusdetails', exact: true, name: 'default', component: CampusDetails },
    { path: '/venuelist', exact: true, name: 'default', component: VenueList },

];
export default routes;
