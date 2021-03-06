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

    function toggleModal() {
        modalShow ? setModalShow(false) : setModalShow(true); 
    }

    function fetchUserRoles() {
        setAssignedRoles([]);
        authnzAxiosInstance
            .get('/roles', { params: { userId: props.id } })
            .then((res) => {
                const assignedRoles = res['data'];
                const roles = assignedRoles.map((assignedRole: { id: number; name: string }) => ({
                    value: assignedRole.id,
                    label: assignedRole.name
                }));
                setAssignedRoles(roles);
                setModalShow(true);
            })
            .catch(() => {
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
                }}
            >
                Assign Role
            </Button>
            <AssignRoleModal show={modalShow} toggleModal={toggleModal} onHide={() => setModalShow(false)} selectedrowprops={props} assignedroles={assignedRoles} />
        </>
    );
};
