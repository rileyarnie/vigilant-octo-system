import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
const alerts: Alerts = new ToastifyAlerts();
const CreateUser = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('AADAlias', email);
        authnzAxiosInstance
            .post('/users', params)
            .then((res) => {
                console.log(res);
                alerts.showSuccess('User created successfully');
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
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
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
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-danger">Submit</button>
                                        </div>
                                    </ValidationForm>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CreateUser;
