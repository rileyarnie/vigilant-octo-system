/* eslint-disable no-prototype-builtins */

import { Action } from '../authnz-library/Action';

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
    const userDetails = JSON.parse(sessionStorage.getItem('userInfo')) as unknown as User;
    if (!userDetails) {
        return;
    }
    return userDetails.actions;
}

function cannotPerformAllActions(...actionNames: string[]): boolean {
    const actions = getCurrUserActions();

    if (Object.keys(actions).length < 1) {
        return false;
    }
    return actionNames.filter(actionName => actions.hasOwnProperty(actionName)).length == 0;
}

function canPerformActions(...actionNames: string[]): boolean {
    const actions = getCurrUserActions();

    if (Object.keys(actions).length < 1) {
        return false;
    }
    return actionNames.filter(actionName => actions.hasOwnProperty(actionName)).length == actionNames.length;
    
}

export { canPerformActions, cannotPerformAllActions };
