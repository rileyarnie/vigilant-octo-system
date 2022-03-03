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

const App = () => {
    const [isAuthenticated, setAuthState] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState();
    // const token = ;

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('userInfo'));
        if (loggedInUser && loggedInUser.isStaff) {
            setIsLoggedIn(true);
        }
        setUserInfo(loggedInUser);
    }, [userInfo]);

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
            <ScrollToTop>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        {menu}
                        <Route path="/" component={MainLayout} />
                    </Switch>
                </Suspense>
            </ScrollToTop>
        </AuthContext.Provider>
    );
};

export default App;
