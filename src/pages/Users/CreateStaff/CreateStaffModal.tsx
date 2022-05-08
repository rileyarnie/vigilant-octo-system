/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Select from 'react-select';
import { timetablingAxiosInstance } from '../../../utlis/interceptors/timetabling-interceptor';

import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
import ModalWrapper from '../../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const CreateStaffModal = (props): JSX.Element => {
    const [identificationType, setIdentificationType] = useState('');
    const [identification, setIdentification] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        authnzAxiosInstance
            .get('/users')
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.log('Error', error.message);
                alerts.showError(error.message);
            });
    };

    const handleIdentificationTypeChange = (event) => {
        setIdentificationType(event.target.value);
    };
    const handleIdentificationChange = (event) => {
        setIdentification(event.target.value);
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //submit function here
        const data = { name, identification, identificationType, email };
        const body = userId ? { ...data, userId } : data;
        timetablingAxiosInstance
            .post('/staff', body)
            .then(() => {
                alerts.showSuccess('successfully created staff');
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
    const handleSelect = (e) => {
        setUserId(e.value);
    };

    return (
        <ModalWrapper noFooter show={props.show} closeModal={props.onHide} modalSize="lg" title="Create Staff">
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
                                                <label htmlFor="user">
                                                    <b>User</b>
                                                </label>
                                                <Select
                                                    options={users.map((user) => ({
                                                        value: user.id,
                                                        label: user.aadAlias
                                                    }))}
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
                                                <label htmlFor="name">
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
                                                <label htmlFor="identificationType">
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
                                                <label htmlFor="identification">
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
                                        <Col sm={6}></Col>
                                    </Row>

                                    <div className="form-group">
                                        <button className="btn btn-danger float-left" onClick={() => props.onHide()}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-info float-right">Submit</button>
                                    </div>
                                </ValidationForm>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        </ModalWrapper>
    );
};

export default CreateStaffModal;
