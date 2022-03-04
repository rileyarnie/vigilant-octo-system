/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
const defaultState = {
    authState: false
};

export const AuthContext = React.createContext<any>(defaultState);
