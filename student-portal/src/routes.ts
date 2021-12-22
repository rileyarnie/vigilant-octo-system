import Default from './pages/Dashboard/Default';
import Programs from './pages/Academics/Programs';
import CourseCohortSemester from './pages/Academics/CourseCohortSemester';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/programs', exact: true, name: 'default', component: Programs },
    { path: '/semesters', exact: true, name: 'default', component: CourseCohortSemester },

];
export default routes;
