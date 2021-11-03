import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import Departments from './pages/Academics/Departments';
import CreateProgram from './pages/Academics/CreateProgram';
import CampusDetails from './pages/Academics/CampusDetails';
import CreateCampus from './pages/Academics/CreateCampus';
import CampusList from './pages/Academics/CampusList';
import ProgramCoursesList from './pages/Academics/ProgramCoursesList';
import CreateTrainer from './pages/Academics/CreateTrainer';
import AssignCourse from './pages/Academics/AssignCourse';
import TrainerList from './pages/Academics/TrainerList';

import VenueList from './pages/Academics/VenueList';
import AssignRole from './pages/Users/AssignRole';
import CreateVenue from './pages/Academics/CreateVenue';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/createcampus', exact: true, name: 'default', component: CreateCampus },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/campuslist', exact: true, name: 'default', component: CampusList },
    { path: '/trainerlist', exact: true, name: 'default', component: TrainerList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/createvenue', exact: true, name: 'default', component: CreateVenue },
    { path: '/createprogram', exact: true, name: 'default', component: CreateProgram },
    { path: '/programcourses', exact: true, name: 'default', component: ProgramCoursesList },
    { path: '/CreateTrainer', exact: true, name: 'default', component: CreateTrainer },
    { path: '/assigncourses', exact: true, name: 'default', component: AssignCourse },
    { path: '/campusdetails', exact: true, name: 'default', component: CampusDetails },
    { path: '/venuelist', exact: true, name: 'default', component: VenueList },
    { path: '/assignrole', exact: true, name: 'default', component: AssignRole },

];
export default routes;
