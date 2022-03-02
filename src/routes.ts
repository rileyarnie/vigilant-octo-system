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
import PublishedSemester from './pages/Academics/Application/PublishedSemester';
import Timetable from './pages/Timetabling/Timetable';
import CourseCohorts from './pages/Academics/CourseCohorts';
import CourseCohortsDetails from './pages/Academics/CourseCohortDetails';
import ProgramCohortSemesters from './pages/Academics/ProgramCohortSemesters';
import ProgramCohortSemesterDetails from './pages/Academics/ProgramCohortSemesterDetails';
import ApplicantsList from './pages/finance/ApplicantsList';
import StudentFeesReport from './pages/finance/StudentFeesReport';
import WorkFlows from './pages/workFlows/WorkFlows';
import ActionApprovals from './pages/Approvals/ActionApprovals';
import Login from './pages/Auth/Login';

const routes = [
    { path: '/login', exact: true, name: 'default', component: Login },
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
    { path: '/publishedsemesters', exact: true, name: 'default', component: PublishedSemester },
    { path: '/timetable', exact: true, name: 'default', component: Timetable },
    { path: '/coursecohorts', exact: true, name: 'default', component: CourseCohorts },
    { path: '/coursecohortdetails/:id', exact: true, name: 'default', component: CourseCohortsDetails },
    { path: '/programcohortsemester', exact: true, name: 'default', component: ProgramCohortSemesters },
    { path: '/pcsdetails', exact: true, name: 'default', component: ProgramCohortSemesterDetails },
    { path: '/studentlist', exact: true, name: 'default', component: ApplicantsList },
    { path: '/studentfeesreport', exact: true, name: 'default', component: StudentFeesReport },
    { path: '/workflows', exact: true, name: 'default', component: WorkFlows },
    { path: '/actionapprovals', exact: true, name: 'default', component: ActionApprovals }
];
export default routes;
