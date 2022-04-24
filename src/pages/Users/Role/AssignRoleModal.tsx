import React, {useEffect, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Select from 'react-select';
import {Alerts, ToastifyAlerts} from '../../lib/Alert';
import {customSelectTheme} from '../../lib/SelectThemes';
import {authnzAxiosInstance} from '../../../utlis/interceptors/authnz-interceptor';

const alerts: Alerts = new ToastifyAlerts();

interface ISelectedRow {
    aadAlias: string;
    id: number;
}

interface IProps {
    onHide: () => void;
    show: boolean;
    selectedrowprops: ISelectedRow;
    assignedroles?: Array<{ value: number, label: string }>;
}

export const AssignRoleModal = (props: IProps): JSX.Element => {
    const [roles, setRoles] = useState([]);
    const [isMulti] = useState(true);
    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options = [];
    useEffect(() => {
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
        return options.push({value: role.id, label: role.name});
    });

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const handlePostRoles = async () => {
        const roleIds: number[] = selectedOptions.map((option) => option.value);

        authnzAxiosInstance
            .post(`/users/${props.selectedrowprops.id}/roles`, {roleIds: roleIds})
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
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    return (
        <>
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Assign roles
                        to {props.selectedrowprops.aadAlias}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Select
                        defaultValue={props.assignedroles}
                        theme={customSelectTheme}
                        options={options}
                        isMulti={isMulti}
                        placeholder="Select roles for this user"
                        noOptionsMessage={() => 'No roles available'}
                        onChange={handleChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={toggleConfirmModal}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={confirmModal}
                onHide={toggleConfirmModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>{' '}</Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">A you sure you want to create a role ?</h6>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseConfirmModal}>
                        Continue editing
                    </Button>
                    <button className="btn btn-info float-right" onClick={handlePostRoles}>
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
