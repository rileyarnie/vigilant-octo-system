/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import { timetablingAxiosInstance } from '../../../utlis/interceptors/timetabling-interceptor';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';

const alerts: Alerts = new ToastifyAlerts();

const UpdateStaffModal = (props): JSX.Element => {
    const [identificationType, setIdentificationType] = useState(props.data.identificationType);
    const [identification, setIdentification] = useState(props.data.identification);
    const [name, setName] = useState(props.data.name);
    const [userId, setUserId] = useState(props.data.id);
    const [email, setEmail] = useState(props.data.email);

    const handleIdentificationTypeChange = (event) => {
        setIdentificationType(event.target.value);
    };
    const handleIdentificationChange = (event) => {
        setIdentification(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //submit function here
        const data = { name, identification, identificationType, email };
        timetablingAxiosInstance
            .put(`/staff/${userId}`, data)
            .then(() => {
                alerts.showSuccess('successfully updated staff');
                setEmail('');
                setUserId('');
                setName('');
                setIdentificationType('');
                setIdentification('');
                props.fetchStaff();
                props.onHide();
            })
            .catch((err) => console.log('err', err));
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };
    // const handleSelect = (e) => {
    //     setUserId(e.value);
    // };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Update Staff</Modal.Title>
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
                                            {/* <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="user">
                                                        <b>User</b>
                                                    </label>
                                                    <Select
                                                        options={[
                                                            { value: 'user 1', label: 'user 1' },
                                                            { value: 'user 2', label: 'user 2' },
                                                            { value: 'user 3', label: 'user 3' }
                                                        ]}
                                                        isMulti={false}
                                                        placeholder="Select User"
                                                        noOptionsMessage={() => 'No available users'}
                                                        onChange={(e) => handleSelect(e)}
                                                    />
                                                </div>
                                            </Col> */}
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Enter Email Address</b>
                                                    </label>
                                                    <TextInput
                                                        name="email"
                                                        id="email"
                                                        type="email"
                                                        placeholder="Enter Email"
                                                        validator={validator.isEmail}
                                                        errorMessage={{ validator: 'Please enter a valid email' }}
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Name</b>
                                                    </label>
                                                    <TextInput
                                                        name="name"
                                                        id="name"
                                                        placeholder="Enter Name"
                                                        validator={!validator}
                                                        errorMessage={{ validator: 'Please enter a name' }}
                                                        value={name}
                                                        onChange={handleNameChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Identification Type</b>
                                                    </label>
                                                    <TextInput
                                                        name="identificationType"
                                                        id="identificationType"
                                                        placeholder="Identification type"
                                                        validator={!validator.isEmpty}
                                                        errorMessage={{ validator: 'Please enter a value' }}
                                                        value={identificationType}
                                                        onChange={handleIdentificationTypeChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>Identification</b>
                                                    </label>
                                                    <TextInput
                                                        name="identification"
                                                        id="identification"
                                                        placeholder="identification"
                                                        validator={!validator.isEmpty}
                                                        errorMessage={{ validator: 'Please enter a value' }}
                                                        value={identification}
                                                        onChange={handleIdentificationChange}
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

export default UpdateStaffModal;
