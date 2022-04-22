/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Select from 'react-select';


// import { Alerts, ToastifyAlerts } from '../../lib/Alert';
// import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';

// const alerts: Alerts = new ToastifyAlerts();

const CreateStaffModal = (props): JSX.Element => {
    let selectedUser;
    const [email, setEmail] = useState('');
    const handleChange = (event) => {
        setEmail(event.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        //submit function here
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };
    const handleSelect = (e) => {
        selectedUser = e.target.value;
        console.log(selectedUser);
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create Staff</Modal.Title>
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
                                        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>User</b>
                                                    </label>
                                                    <Select
                                                        options={[
                                                            { value: 'user 1', label: 'user 1' },
                                                            { value: 'user 2', label: 'user 2' },
                                                            { value: 'user 3', label: 'user 3' },
                                                        ]}
                                                        isMulti={false}
                                                        placeholder="Select User"
                                                        noOptionsMessage={() => 'No available users'}
                                                        onChange={(e) => handleSelect(e)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Name</b>
                                                    </label>
                                                    <TextInput
                                                        name="email"
                                                        id="email"
                                                        type="email"
                                                        placeholder="Enter Name"
                                                        validator={validator.isEmail}
                                                        errorMessage={{ validator: 'Please enter a valid email' }}
                                                        value={email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Identification Type</b>
                                                    </label>
                                                    <TextInput
                                                        name="email"
                                                        id="email"
                                                        type="email"
                                                        placeholder="Identification type"
                                                        validator={validator.isEmail}
                                                        errorMessage={{ validator: 'Please enter a valid email' }}
                                                        value={email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Identification</b>
                                                    </label>
                                                    <TextInput
                                                        name="email"
                                                        id="email"
                                                        type="email"
                                                        placeholder="identification"
                                                        validator={validator.isEmail}
                                                        errorMessage={{ validator: 'Please enter a valid email' }}
                                                        value={email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

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

export default CreateStaffModal;
