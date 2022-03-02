import { Action } from './Action';

const authnzServiceActions = new Map<string, Action>();

export function getAuthnzServiceActions(): Map<string, Action> {
    return authnzServiceActions;
}

export const ACTION_GET_ACTIONS_BY_ROLE_ID = new Action(
    'getActionsByRoleId',
    'Returns a list of actions associated with a role id',
    'GET',
    '/actions/:roleId'
);
authnzServiceActions.set(
    ACTION_GET_ACTIONS_BY_ROLE_ID.name,
    ACTION_GET_ACTIONS_BY_ROLE_ID
);

export const ACTION_GET_ACTIONS = new Action(
    'getActions',
    'Returns a paginated list of actions',
    'GET',
    '/actions'
);
authnzServiceActions.set(ACTION_GET_ACTIONS.name, ACTION_GET_ACTIONS);

export const ACTION_GET_AUTHORIZATION = new Action(
    'getAuthorization',
    'Determines if an action is authorised for a user',
    'POST',
    '/auth'
);
authnzServiceActions.set(
    ACTION_GET_AUTHORIZATION.name,
    ACTION_GET_AUTHORIZATION
);

export const ACTION_GET_FIRST_USER_CREATION_FORM = new Action(
    'getFirstUserCreationForm',
    'Get a HTML form to enter AAD Aliases to be created',
    'GET',
    '/first_user'
);
authnzServiceActions.set(
    ACTION_GET_FIRST_USER_CREATION_FORM.name,
    ACTION_GET_FIRST_USER_CREATION_FORM
);

export const ACTION_ADD_FIRST_USER = new Action(
    'addFirstUsers',
    'Create initial Sys Admin and Super User',
    'POST',
    '/first_user'
);
authnzServiceActions.set(ACTION_ADD_FIRST_USER.name, ACTION_ADD_FIRST_USER);

export const ACTION_GET_ROLES = new Action(
    'getRoles',
    'Returns a list of system roles',
    'GET',
    '/roles'
);
authnzServiceActions.set(ACTION_GET_ROLES.name, ACTION_GET_ROLES);

export const ACTION_CREATE_ROLE = new Action(
    'createRole',
    'Creates a new role',
    'PUT',
    '/roles'
);
authnzServiceActions.set(ACTION_CREATE_ROLE.name, ACTION_CREATE_ROLE);

export const ACTION_DEACTIVATE_ROLE = new Action(
    'deactivateRole',
    'Deactivates a role',
    'POST',
    '/roles'
);
authnzServiceActions.set(ACTION_DEACTIVATE_ROLE.name, ACTION_DEACTIVATE_ROLE);

export const ACTION_UPDATE_ROLE = new Action(
    'updateRole',
    'Updates a role',
    'PUT',
    '/roles/:roleID'
);
authnzServiceActions.set(ACTION_UPDATE_ROLE.name, ACTION_UPDATE_ROLE);

export const ACTION_ADD_ACTIONS_TO_ROLE = new Action(
    'addActions',
    'Adds actions to roleID',
    'POST',
    '/roles'
);
authnzServiceActions.set(
    ACTION_ADD_ACTIONS_TO_ROLE.name,
    ACTION_ADD_ACTIONS_TO_ROLE
);

export const ACTION_ASSIGN_ROLES = new Action(
    'assignRole',
    'This endpoint assigns and de-assigns roles to a user',
    'POST',
    '/roles/user-roles'
);
authnzServiceActions.set(ACTION_ASSIGN_ROLES.name, ACTION_ASSIGN_ROLES);

export const ACTION_CREATE_USERS = new Action(
    'createUsers',
    'Create system users within Elimisha',
    'POST',
    '/users'
);
authnzServiceActions.set(ACTION_CREATE_USERS.name, ACTION_CREATE_USERS);

export const ACTION_GET_USERS = new Action(
    'getUsers',
    'Returns an array of all the system users',
    'GET',
    '/users'
);
authnzServiceActions.set(ACTION_GET_USERS.name, ACTION_GET_USERS);

export const ACTION_FETCH_USER_DETAILS = new Action(
    'fetchUserDetails',
    'Returns a list of actions and roles for a user',
    'GET',
    '/me'
);
authnzServiceActions.set(
    ACTION_FETCH_USER_DETAILS.name,
    ACTION_FETCH_USER_DETAILS
);

export const ACTION_ASSIGN_ROLES_TO_USER = new Action(
    'assignRole',
    'This endpoint assigns roles to a user',
    'POST',
    '/users/:userId/roles'
);
authnzServiceActions.set(
    ACTION_ASSIGN_ROLES_TO_USER.name,
    ACTION_ASSIGN_ROLES_TO_USER
);
