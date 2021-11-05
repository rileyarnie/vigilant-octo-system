import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from "react-bootstrap";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Breadcrumb from '../../App/components/Breadcrumb';
import Config from '../../config';

class CreateUser extends Component {
    state = {
        email: ''
    };
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e, formData,) => {
        e.preventDefault();
        const params = new URLSearchParams();
        const baseUrl = Config.baseUrl.authnzSrv;
        params.append('AADAlias', this.state.email);
        axios.post(`${baseUrl}/users`, params)
            .then(res => {
                //handle success
                console.log(res);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert('Bad request');
            });

        alert(JSON.stringify(formData, null, 2));
    };

    handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };


    render() {
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
                                        <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}>
                                            <div className='form-group'>
                                                <label htmlFor='email'><b>Enter AAD Alias</b></label>
                                                <TextInput name='email' id='email' type='email' placeholder="user@miog.co.ke"  validator={validator.isEmail} errorMessage={{ validator: 'Please enter a valid email' }} value={this.state.email} onChange={this.handleChange} />
                                            </div>
                                            <div className='form-group'>
                                                <button className='btn btn-danger'>Submit</button>
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
    }
}

export default CreateUser;