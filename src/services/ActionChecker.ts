/* eslint-disable no-prototype-builtins */
import { Action } from 'authnz-library/dist';
import Config from '../config';

interface Role {
    id: number;
    name: string;
    description: string;
    actions: Action[];
}

interface User {
    id: number;
    aadAlias: string;
    isStudent: boolean;
    isStaff: boolean;
    roles: Role[];
    actions: { string: Action };
}

function getCurrUserActions(): { string: Action } {
    const userDetails = JSON.parse(localStorage.getItem('userInfo')) as unknown as User;
    if (!userDetails) {
        // debugger;
        // logout();
        return;
    }
    return userDetails.actions;
}

function cannotPerformAllActions(...actionNames: string[]): boolean {
    const actions = getCurrUserActions();
    actionNames.forEach((actionName) => {
        if (actions.hasOwnProperty(actionName)) {
            return false;
        }
    });
    return true;
}

function canPerformActions(...actionNames: string[]): boolean {
    const actions = getCurrUserActions();
    actionNames.forEach((actionName) => {
        if (!actions.hasOwnProperty(actionName)) {
            return false;
        }
    });
    return true;
}

export { canPerformActions, cannotPerformAllActions };

// function logout() {
//     localStorage.clear();
//     window.location.href = `${Config.PUBLIC_URL}?showLoggedOutModal=true`;
// }
// export { logout };
