/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import axios from 'axios';
import Config from '../../../config';

const CreateUserModal = (props) => {
    const [email, setEmail] = useState('');
    const handleChange = (event) => {
        setEmail(event.target.value);
    };
    const [progress, setProgress] = useState(0);
    const handleSubmit = (e) => {
        e.preventDefault();
        setProgress(10);
        const params = new URLSearchParams();
        const authnzSrv = Config.baseUrl.authnzSrv;
        params.append('AADAlias', email);
        axios
            .post(`${authnzSrv}/users`, params)
            .then((res) => {
                setProgress(100);
                alert(res.status);
                props.onHide();
                //clear input on success
                setEmail('');
            })
            .catch((error) => {
                setProgress(0);
                //handle error using logging library
                console.error(error);
                alert(error.message);
            });
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
            <ProgressBar striped variant="info" animated now={progress} />
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
                            <Card>
                                <Card.Body>
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
                                                    <button className="btn btn-danger float-right">Submit</button>
                                                    
                                                </div>
                                            </ValidationForm>
                                            <button className="btn btn-info float-left" onClick={()=>props.onHide()}>Cancel</button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUserModal;
