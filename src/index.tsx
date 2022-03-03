import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App/index';
import reducer from './store/reducer';
import config from './config';
import './assets/scss/style.scss';
import Login from './pages/Auth/Login';
import { ProtectedRoutes } from './App/components/ProtectedRoutes';
const store = createStore(reducer);

const isLoggedIn = JSON.parse(localStorage.getItem('userInfo')) ? true : false;

const Staging = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoutes isLoggedIn={isLoggedIn} path="/" component={App} />
        </Switch>
    );
};

export default Staging;

const app = (
    <Provider store={store}>
        <BrowserRouter basename={config.basename}>
            <Staging />
        </BrowserRouter>
    </Provider>
);
ReactDOM.render(app, document.getElementById('root'));
