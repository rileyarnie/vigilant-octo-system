import Default from './pages/Dashboard/Default';
import UserList from './pages/Users/UserList';


const routes = [
    { path: '/dashboard', exact: true, name: 'default', component: Default },
    { path: "/userlist", exact: true, name: "default", component: UserList },

];
export default routes;
