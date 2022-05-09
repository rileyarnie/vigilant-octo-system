/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';

import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
import ConfirmationModalWrapper from '../../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();
const CreateUserModal = (props): JSX.Element => {
    const [email, setEmail] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleChange = (event) => {
        setEmail(event.target.value);
    };
    const handleSubmit = (e) => {
        setDisabled(true);
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('AADAlias', email);
        authnzAxiosInstance
            .post('/users', { AADAlias: email, isStaff: true })
            .then(() => {
                setDisabled(false);
                alerts.showSuccess('successfully created user');
                props.fetchUsers();
                props.onHide();
                toggleCloseConfirmModal();
                setEmail('');
                setConfirmModal(false);
            })
            .catch((error) => {
                setDisabled(false);
                //handle error using logging library
                props.onHide();
                toggleCloseConfirmModal();
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    return (
        <>
            <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <Row className="align-items-center page-header">
                            <Col />
                        </Row>
                        <Row>
                            <Col>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm onErrorSubmit={handleErrorSubmit}>
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
                                                <Button
                                                    disabled={disabled}
                                                    className="float-right"
                                                    variant="info"
                                                    onClick={toggleConfirmModal}
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </ValidationForm>
                                        <button disabled={disabled} className="btn btn-danger float-left" onClick={() => props.onHide()}>
                                            Cancel
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                </Modal.Body>
            </Modal>
            <ConfirmationModalWrapper disabled={disabled} submitButton submitFunction={handleSubmit} closeModal={toggleCloseConfirmModal} show={confirmModal}>
                <h6 className="text-center">
                    Are you sure you want to add <p>{email}</p> ?
                </h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default CreateUserModal;
