import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from 'react-bootstrap';
import Config from '../../config';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import Breadcrumb from '../../App/components/Breadcrumb';
class CreateCampus extends Component {
    state = {
        name: '',
        description: '',
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const campus = {
            name: this.state.name,
            description: this.state.description,
        };
        const timetablingSrv = Config.baseUrl.timetablingSrv;
        console.log(campus);
        axios.put(`${timetablingSrv}/campuses`)
            .then(res => {
                //handle success
                alert('Campus created successfully');
                this.setState({
                    name: '',
                    description: ''
                });
                console.log(res);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error.message);
                this.setState({
                    name: '',
                    description: ''
                });
            });
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
                                                <label htmlFor='name'><b>Name of Campus</b></label>
                                                <TextInput name='name' id='name' type='text' value={this.state.name} placeholder="Enter name" onChange={this.handleChange}
                                                    required /><br />
                                                <label htmlFor='description'><b>Description</b></label>
                                                <TextInput name='description' id='desc' type='textarea' value={this.state.description} multiline required minLength="4" placeholder="enter description" rows="5" onChange={this.handleChange} /><br />

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

export default CreateCampus;