import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App/index';
import reducer from './store/reducer';
import './assets/scss/style.scss';
import Login from './pages/Auth/Login';
import { ProtectedRoutes } from './App/components/ProtectedRoutes';
import isLoggedIn from './utlis/isLoggedIn';
const store = createStore(reducer);


const Staging = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoutes isLoggedIn={isLoggedIn()} path="/" component={App} />
        </Switch>
    );
};

export default Staging;

const app = (
    <Provider store={store}>
        <HashRouter>
            <Staging />
        </HashRouter>
    </Provider>
);
ReactDOM.render(app, document.getElementById('root'));
