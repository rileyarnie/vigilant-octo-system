import React, { Suspense, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import '../../node_modules/font-awesome/scss/font-awesome.scss';
import Loader from './layout/Loader';
import ScrollToTop from './layout/ScrollToTop';
import routes from '../route';
import { AuthContext } from './context/AuthContext';
import Login from '../pages/Auth/Login';

const MainLayout = Loadable({
    loader: () => import('./layout/MainLayout'),
    loading: Loader
});
// class App extends Component {
//     render(): JSX.Element {
//         const menu = routes.map((route, index) => {
//             return route.component ? (
//                 <Route key={index} path={route.path} exact={route.exact} render={(props) => <route.component {...props} />} />
//             ) : null;
//         });
//         return (
//             <>
//                 <ScrollToTop>
//                     <Suspense fallback={<Loader />}>
//                         <Switch>
//                             {menu}
//                             <Route path="/" component={MainLayout} />
//                         </Switch>
//                     </Suspense>
//                 </ScrollToTop>
//             </>
//         );
//     }
// }
// export default App;

// import React from 'react';

const App = () => {
    const [isAuthenticated, setAuthState] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('idToken');

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        }
    }, [token]);

    const menu = routes.map((route, index) => {
        return route.component ? (
            <Route key={index} path={route.path} exact={route.exact} render={(props) => <route.component {...props} />} />
        ) : null;
    });
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setAuthState
            }}
        >
            {!isLoggedIn && <Login />}
            {isLoggedIn && (
                <ScrollToTop>
                    <Suspense fallback={<Loader />}>
                        <Switch>
                            {menu}
                            <Route path="/" component={MainLayout} />
                        </Switch>
                    </Suspense>
                </ScrollToTop>
            )}
        </AuthContext.Provider>
    );
};

export default App;
