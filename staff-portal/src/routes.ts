import Default from './pages/Dashboard/Default';
import RoleList from './pages/Users/RoleList';
import CreateUser from './pages/Users/Create';
import Departments from './pages/Academics/Departments';
import CampusDetails from './pages/Academics/CampusDetails';
import CreateCampus from './pages/Academics/CreateCampus';
import CampusList from './pages/Academics/CampusList';
import ProgramCoursesList from './pages/Academics/ProgramCoursesList';
import AssignCourse from './pages/Academics/AssignCourse';
import TrainerList from './pages/Academics/TrainerList';

import VenueList from './pages/Academics/VenueList';
import AssignRole from './pages/Users/AssignRole';
import CreateVenue from './pages/Academics/CreateVenue';
import Programs from './pages/Academics/Programs';
import CoursesList from './pages/Academics/CoursesList';
import UserList from './pages/Users/UserList';
import CreateCourse from './pages/Academics/CreateCourse';
import SemesterList from './pages/Academics/SemesterList';
import ProgramCohorts from './pages/Academics/ProgramCohorts';
import ProgramCohortCoursesList from './pages/Academics/ProgramCohortCoursesList';
import ApplicationsList from './pages/Academics/ApplicationsList';

const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/roles', exact: true, name: 'default', component: RoleList },
    { path: '/cohorts', exact: true, name: 'default', component: ProgramCohorts },
    { path: '/users', exact: true, name: 'default', component: UserList },
    { path: '/createcampus', exact: true, name: 'default', component: CreateCampus },
    { path: '/createuser', exact: true, name: 'default', component: CreateUser },
    { path: '/departments', exact: true, name: 'default', component: Departments },
    { path: '/campuses', exact: true, name: 'default', component: CampusList },
    { path: '/trainers', exact: true, name: 'default', component: TrainerList },
    { path: '/createuser', exact: true, name: 'default', component: CreateUser },
    { path: '/courses', exact: true, name: 'default', component: CoursesList },
    { path: '/trainers', exact: true, name: 'default', component: TrainerList },
    { path: '/createvenue', exact: true, name: 'default', component: CreateVenue },
    { path: '/createcourse', exact: true, name: 'default', component: CreateCourse },
    { path: '/programcourses', exact: true, name: 'default', component: ProgramCoursesList },
    { path: '/createcourse', exact: true, name: 'default', component: CreateCourse },
    { path: '/assigncourses', exact: true, name: 'default', component: AssignCourse },
    { path: '/campusdetails', exact: true, name: 'default', component: CampusDetails },
    { path: '/venues', exact: true, name: 'default', component: VenueList },
    { path: '/programs', exact: true, name: 'default', component: Programs },
    { path: '/assigncourses', exact: true, name: 'default', component: AssignCourse },
    { path: '/campusdetails', exact: true, name: 'default', component: CampusDetails },
    { path: '/semesters', exact: true, name: 'default', component: SemesterList },
    { path: '/assignrole', exact: true, name: 'default', component: AssignRole },
    { path: '/cohorts', exact: true, name: 'default', component: ProgramCohorts },
    { path: '/cohortscourses', exact: true, name: 'default', component: ProgramCohortCoursesList },
    { path: '/applications', exact: true, name: 'default', component: ApplicationsList },


];
export default routes;