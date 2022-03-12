import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { customSelectTheme } from '../../lib/SelectThemes';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
const alerts: Alerts = new ToastifyAlerts();
interface ISelectedRow {
    aadAlias: string;
    id: number;
}
interface IProps {
    onHide: () => void;
    show: boolean;
    selectedrowprops: ISelectedRow;
}
export const AssignRoleModal = (props: IProps): JSX.Element => {
    const [roles, setRoles] = useState([]);
    const [assignedRoles, setAssignedRoles] = useState([]);
    const [isMulti] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options = [];
    useEffect(() => {
        fetchUserRoles();
        authnzAxiosInstance
            .get('/roles')
            .then((res) => {
                setRoles(res.data);
            })
            .catch((error) => {
                console.log('Error');
                alerts.showError(error.message);
            });
    }, []);

    roles.map((role) => {
        return options.push({ value: role.id, label: role.name });
    });
    function fetchUserRoles() {
        authnzAxiosInstance.get('/roles',{params: {userId:props.selectedrowprops.id}})
            .then((res) => {
                const assignedRoles = res['data'];
                const roles = assignedRoles.map((it) => {
                    return { value: it.role.id, label: it.role.name };
                });
                setAssignedRoles(roles);
            });
    }
    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const handlePostRoles = async () => {
        const roleIds: number[] = selectedOptions.map((option) => option.value);

        authnzAxiosInstance
            .post(`/users/${props.selectedrowprops.id}/roles`, { roleIds: roleIds })
            .then((res) => {
                if (res.status == 200) {
                    alerts.showSuccess('Successfully assigned role to user');
                    console.log(res);
                    props.onHide();
                }
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                props.onHide();
            });
    };
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{props.selectedrowprops.aadAlias}&apos;s Roles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    defaultValue={assignedRoles}
                    theme={customSelectTheme}
                    options={options}
                    isMulti={isMulti}
                    placeholder="Select roles for this user"
                    noOptionsMessage={() => 'No roles available'}
                    onChange={handleChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handlePostRoles}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
