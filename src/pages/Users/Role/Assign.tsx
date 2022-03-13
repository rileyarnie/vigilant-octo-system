/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { AssignRoleModal } from './AssignRoleModal';

const alerts: Alerts = new ToastifyAlerts();

export const Assign = (props): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    const [assignedRoles, setAssignedRoles] = useState([]);

    function fetchUserRoles() {
        setAssignedRoles([]);
        authnzAxiosInstance
            .get('/roles', { params: { userId: props.id } })
            .then((res) => {
                const assignedRoles = res['data'];
                console.log('from axios response', assignedRoles);
                const roles = assignedRoles.map((assignedRole: { id: number; name: string }) => ({
                    value: assignedRole.id,
                    label: assignedRole.name
                }));
                setAssignedRoles(roles);
                setModalShow(true);
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(
                    `We couldn’t fetch the existing roles for ${props.aadAlias}, reopening the dialog should fix this.`
                );
                setModalShow(true);
            });
    }

    return (
        <>
            <Button
                variant="danger mr-2"
                onClick={() => {
                    fetchUserRoles();
                    console.log('assign role clicked');
                    console.log('from button click', assignedRoles);
                    console.log('from button click', props);
                }}
            >
                Assign Role
            </Button>
            <AssignRoleModal show={modalShow} onHide={() => setModalShow(false)} selectedrowprops={props} assignedroles={assignedRoles} />
        </>
    );
};
