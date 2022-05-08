import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { canPerformActions } from '../../../services/ActionChecker';
import { ACTION_CREATE_ROLE } from '../../../authnz-library/authnz-actions';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
import ConfirmationModalWrapper from '../../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

interface IProps {
    fetchRoles: () => void;
}

const CreateRole = (props: IProps): JSX.Element => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roleDescription, setRoleDescription] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleRoleChange = (event, field) => {
        field === 'name' ? setRoleName(event.target.value) : setRoleDescription(event.target.value);
    };
    const handleRoleSubmit = () => {
        setDisabled(true);
        authnzAxiosInstance
            .put('/roles', { roleName: roleName, description: roleDescription })
            .then(() => {
                setDisabled(false);
                props.fetchRoles();
                setShowCreateModal(false);
                resetStateCloseModal();
                alerts.showSuccess('Success created role');
            })
            .catch((error) => {
                setDisabled(false);
                resetStateCloseModal();
                alerts.showError(error.message);
                console.log(error);
            });
    };
    const resetStateCloseModal = () => {
        setRoleName('');
        setRoleDescription('');
        setConfirmModal(false);
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    return (
        <>
            {canPerformActions(ACTION_CREATE_ROLE.name) && (
                <Button className="float-right" variant="danger" onClick={() => setShowCreateModal(true)}>
                    Create Role
                </Button>
            )}
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={showCreateModal} centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Row>
                            <Col md={12}>
                                <ValidationForm onSubmit={handleRoleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            <b>Enter Role Name</b>
                                        </label>
                                        <TextInput
                                            name="name"
                                            id="name"
                                            type="text"
                                            placeholder="Role name"
                                            validator={validator.isAlphanumeric}
                                            errorMessage={{ validator: 'Please enter a valid Role name' }}
                                            value={roleName}
                                            onChange={(e) => handleRoleChange(e, 'name')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            <b>Enter Role Description</b>
                                        </label>
                                        <TextInput
                                            name="description"
                                            id="description"
                                            type="text"
                                            placeholder="Role description"
                                            validator={!validator.isAlphanumeric}
                                            errorMessage={{ validator: 'Please enter a valid Role description' }}
                                            value={roleDescription}
                                            onChange={(e) => handleRoleChange(e, 'description')}
                                        />
                                    </div>
                                </ValidationForm>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button disabled={disabled} className="float-right" variant="info" onClick={toggleConfirmModal}>
                            Submit
                        </Button>
                        <Button disabled={disabled} className="float-left" variant="danger" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                    </Col>
                </Modal.Footer>
            </Modal>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={handleRoleSubmit}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">Are you sure you want to create a role : {roleName}?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};
export default CreateRole;
