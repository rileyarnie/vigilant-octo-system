import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Config from '../../../config';
import axios from 'axios';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
interface IProps {
    fetchRoles: () => void;
}
const CreateRole = (props: IProps): JSX.Element => {
    const authnzSrv = Config.baseUrl.authnzSrv;
    const [roleName, setRoleName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roleDescription, setRoleDescription] = useState('');
    const handleRoleChange = (event, field) => {
        field === 'name' ? setRoleName(event.target.value) :
            setRoleDescription(event.target.value);
    };

    const handleRoleSubmit = () => {
        axios
            .put(`${authnzSrv}/roles`, { roleName: roleName, description: roleDescription })
            .then(() => {
                alerts.showSuccess('Success created role');
                props.fetchRoles();
                setShowCreateModal(false);
            })
            .catch((error) => {
                alerts.showError(error.message);
                console.log(error);
            });
    };
    return (
        <>
            <Button className="float-right" variant="danger" onClick={() => setShowCreateModal(true)}>
                Create Role
            </Button>
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
                                            onChange={(e) => handleRoleChange(e,'name')}
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
                        <Button className="float-right" variant="info" onClick={handleRoleSubmit}>
                            Submit
                        </Button>
                        <Button className="float-left" variant="danger" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                    </Col>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default CreateRole;
