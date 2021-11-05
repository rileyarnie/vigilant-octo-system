import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import CreateUser from './pages/Users/Create';
import Departments from './pages/Academics/Departments';
import CreateProgram from './pages/Academics/CreateProgram';
import CampusDetails from './pages/Academics/CampusDetails';
import CreateCampus from './pages/Academics/CreateCampus';
import CampusList from './pages/Academics/CampusList';
import ProgramCoursesList from './pages/Academics/ProgramCoursesList';
import AssignCourse from './pages/Academics/AssignCourse';
import TrainerList from './pages/Academics/TrainerList';
import VenueList from './pages/Academics/VenueList';
import AssignRole from './pages/Users/AssignRole';
import CreateVenue from './pages/Academics/CreateVenue';
import SemesterList from './pages/Academics/SemsterList';
import CreateCourse from './pages/Academics/CreateCourse';
import UserList from './pages/Users/UserList';
import CoursesList from './pages/Academics/CoursesList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/rolelist', exact: true, name: 'default', component: RoleList },
    { path: '/userlist', exact: true, name: 'default', component: UserList },
    { path: '/createcampus', exact: true, name: 'default', component: CreateCampus },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/createuser', exact: true, name: 'default', component: CreateUser },
    { path: '/campuslist', exact: true, name: 'default', component: CampusList },
    { path: '/courselist', exact: true, name: 'default', component: CoursesList },
    { path: '/trainerlist', exact: true, name: 'default', component: TrainerList },
    { path: '/department', exact: true, name: 'default', component: Departments },
    { path: '/createvenue', exact: true, name: 'default', component: CreateVenue },
    { path: '/createcourse', exact: true, name: 'default', component: CreateCourse },
    { path: '/createprogram', exact: true, name: 'default', component: CreateProgram },
    { path: '/programcourses', exact: true, name: 'default', component: ProgramCoursesList },
    { path: '/assigncourses', exact: true, name: 'default', component: AssignCourse },
    { path: '/campusdetails', exact: true, name: 'default', component: CampusDetails },
    { path: '/venuelist', exact: true, name: 'default', component: VenueList },
    { path: '/semesterlist', exact: true, name: 'default', component: SemesterList },
    { path: '/assignrole', exact: true, name: 'default', component: AssignRole },

];
export default routes;
