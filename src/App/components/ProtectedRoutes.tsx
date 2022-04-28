/* eslint-disable react/prop-types */
import { Route, Redirect, RouteProps } from 'react-router-dom';
import React from 'react';
import Config from '../../config';

interface Props extends RouteProps {
    isLoggedIn: boolean;
}

export const ProtectedRoutes: React.FC<Props> = ({ component: Component, isLoggedIn, ...rest }) => (
    <Route {...rest} render={(props) => (isLoggedIn === true ? <Component {...props} /> : <Redirect to={Config.basename+"/login"} />)} />
);
