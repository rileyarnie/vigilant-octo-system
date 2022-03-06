/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';

import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';

const alerts: Alerts = new ToastifyAlerts();
const CreateUserModal = (props): JSX.Element => {
    const [email, setEmail] = useState('');
    const handleChange = (event) => {
        setEmail(event.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('AADAlias', email);
        authnzAxiosInstance
            .post('/users', { AADAlias: email, isStaff: true })
            .then(() => {
                alerts.showSuccess('successfully created user');
                props.fetchUsers();
                props.onHide();
                //clear input on success
                setEmail('');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <Row className="align-items-center page-header">
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col md={12}>
                                    <ValidationForm onSubmit={handleSubmit} onErrorSubmit={handleErrorSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                <b>Enter AAD Alias</b>
                                            </label>
                                            <TextInput
                                                name="email"
                                                id="email"
                                                type="email"
                                                placeholder="user@miog.co.ke"
                                                validator={validator.isEmail}
                                                errorMessage={{ validator: 'Please enter a valid email' }}
                                                value={email}
                                                onChange={handleChange}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                        </div>

                                        <div className="form-group">
                                            <button className="btn btn-info float-right">Submit</button>
                                        </div>
                                    </ValidationForm>
                                    <button className="btn btn-danger float-left" onClick={() => props.onHide()}>
                                        Cancel
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUserModal;
