import Default from './pages/Dashboard/Default';
import Programs from './pages/Academics/Programs';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: '/programs', exact: true, name: 'default', component: Programs },

];
export default routes;
