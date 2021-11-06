import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from "react-bootstrap";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import Breadcrumb from '../../App/components/Breadcrumb';
import SelectInput from '@material-ui/core/Select/SelectInput';
import Config from '../../config';

const timetablingSrv = Config.baseUrl.timetablingSrv

class CreateProgram extends Component {
    state = {
        name: '',
        description: '',
        prerequisiteDocumentation: [],
        requiresClearance: false,
        certificationType: '',
        programId: 0,
        duration: '4w',
        status:'Inactive',
        isApproved: false,
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e, formData,) => {
        e.preventDefault();
        const program = {
            name: this.state.name,
            description: this.state.description,
            prerequisiteDocumentation: this.state.prerequisiteDocumentation,
            requiresClearance: this.state.requiresClearance,
            certificationType: this.state.certificationType,
            duration: this.state.duration,
        }
        console.log(program)
        axios.post(`${timetablingSrv}/programs`, program)
            .then(res => {
                //handle success
                console.log(res);
                alert('Succesfully created program.')
                this.setState({
                    name: '',
                    description: '',
                    prerequisiteDocumentation: [],
                    requiresClearance: false,
                    certificationType: '',
                    duration: ''
                })
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error)
                alert('Error creating program')
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
                                                <label htmlFor='name'><b>Name of program</b></label>
                                                <TextInput name='name' id='name' value={this.state.name} type='text' placeholder="Enter name"  onChange={this.handleChange} /><br />
                                                <label htmlFor='description'><b>Description</b></label>
                                                <TextInput name='description' id='desc' type='text' value={this.state.description} placeholder="enter description" onChange={this.handleChange} /><br />
                                                <label htmlFor='cou'><b>Prerequisite Documentation</b></label>
                                                <TextInput name='prerequisiteDocumentation' id='prerequisiteDocumentation' value={this.state.prerequisiteDocumentation} type='textarea' placeholder="Enter prerequisite documentation separate with ," onChange={(e) => {
                                                    this.setState({prerequisiteDocumentation: e.target.value.split(',')})
                                                }} /><br />
                                                <label htmlFor='certificationType'><b>CertificationType</b></label><br />
                                                <select name="certificationType" value={this.state.certificationType} onChange={(e) => this.setState({certificationType: e.target.value})} >
                                                    <option value="Degree">Degree</option>
                                                    <option value="Diploma">Diploma</option>
                                                    <option value="Certificate">Certificate</option>
                                                </select><br /><br />
                                                <label htmlFor='requiresClearance'><b>Requires Clearance</b></label><br />
                                                <select  name='requiresClearance' value={JSON.stringify(this.state.requiresClearance)} id='requiresClearance' >
                                                    <option value="true" >True</option>
                                                    <option value="false"  >False</option>
                                                </select><br /><br />
                                                <label htmlFor='duration'><b>Program duration</b></label><br />
                                                <TextInput name='duration' value={this.state.duration} id='programDuration' type='textarea' placeholder="Enter program duration e.g 4w2d" onChange={this.handleChange} /><br /><br />
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

export default CreateProgram;