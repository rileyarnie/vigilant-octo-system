import React from "react";


interface IAuthContext{
    authState: boolean;
    setAuthState?:()=> void
}

const defaultState = {
    authState:false
}

export const AuthContext = React.createContext<any>(defaultState)