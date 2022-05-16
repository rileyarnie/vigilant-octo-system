import React, {useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import Select from 'react-select';
import {Alerts, ToastifyAlerts} from '../../lib/Alert';
import {customSelectTheme} from '../../lib/SelectThemes';
import {authnzAxiosInstance} from '../../../utlis/interceptors/authnz-interceptor';
import ConfirmationModalWrapper from '../../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

interface ISelectedRow {
    aadAlias: string;
    id: number;
}

interface IProps {
    onHide: () => void;
    toggleModal: () => void;
    show: boolean;
    selectedrowprops: ISelectedRow;
    assignedroles?: Array<{ value: number; label: string }>;
}

export const AssignRoleModal = (props: IProps): JSX.Element => {
    const [roles, setRoles] = useState([]);
    const [isMulti] = useState(true);
    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const options = [];
    useEffect(() => {
        authnzAxiosInstance
            .get('/roles')
            .then((res) => {
                setRoles(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);

    roles.map((role) => {
        return options.push({ value: role.id, label: role.name });
    });

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const handlePostRoles = async () => {
        const roleIds: number[] = selectedOptions.map((option) => option.value);
        setDisabled(true);

        authnzAxiosInstance
            .post(`/users/${props.selectedrowprops.id}/roles`, { roleIds: roleIds })
            .then((res) => {
                if (res.status == 200) {
                    alerts.showSuccess('Successfully assigned role to user');
                }
            })
            .catch((error) => {
                alerts.showError(error.message);
            }).finally(() => {
                props.onHide();
                setDisabled(false);
                toggleCloseConfirmModal();
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
                    <Modal.Title id="contained-modal-title-vcenter">Assign roles to {props.selectedrowprops.aadAlias}</Modal.Title>
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
                    <div className="form-group">
                        <button disabled={disabled} className="btn btn-danger float-left" onClick={() => props.toggleModal()}>
                            Cancel
                        </button>
                        <button disabled={disabled} className="btn btn-info float-right" onClick={toggleConfirmModal}>
                            Submit
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={handlePostRoles}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">Are you sure you want to Assign roles to {props.selectedrowprops.aadAlias} ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};
