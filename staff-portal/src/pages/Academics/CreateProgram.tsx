import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from "react-bootstrap";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import Breadcrumb from '../../App/components/Breadcrumb';

class CreateProgram extends Component {
    state = {
        name: '',
        courseIds: [],
        prerequisiteCourseIds: [],
        description: '',
        prerequisiteDocumentation: [],
        requiresClearance: false,
        programId: 0,
        programDuration: '4w',
        programStatus:'Inactive',
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
            courseIds: this.state.courseIds,
            prerequisiteCourseIds: this.state.prerequisiteCourseIds,
            description: this.state.description,
            prerequisiteDocumentation: this.state.prerequisiteDocumentation,
            requiresClearance: this.state.requiresClearance,
            programId: this.state.programId,
            programDuration: this.state.programDuration,
            programStatus: this.state.programStatus,
            isApproved: this.state.isApproved
        }
        console.log(program)
        axios.put('', program)
            .then(res => {
                //handle success
                console.log(res);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error)
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
                                                <TextInput name='name' id='name' type='text' placeholder="Enter name"  onChange={this.handleChange} /><br />
                                                <label htmlFor='courseIds'><b>Courses</b></label>
                                                <TextInput name='courseIds' id='courseIds' type='textarea' placeholder="Enter course Ids separate with ," onChange={(e) => {
                                                    this.setState({courseIds: e.target.value.split(',')})
                                                }} /><br />
                                                <label htmlFor='prerequisiteCourseIds'><b>Courses</b></label>
                                                <TextInput name='prerequisiteCourseIds' id='prerequisiteCourseIds' type='textarea' placeholder="Enter prerequisite course Ids separate with ," onChange={(e) => {
                                                    this.setState({prerequisiteCourseIds: e.target.value.split(',')})
                                                }} /><br />
                                                <label htmlFor='description'><b>Description</b></label>
                                                <TextInput name='description' id='desc' type='text' placeholder="enter description" onChange={this.handleChange} /><br />
                                                <label htmlFor='cou'><b>Prerequisite Courses</b></label>
                                                <TextInput name='prerequisiteDocumentation' id='prerequisiteDocumentation' type='textarea' placeholder="Enter prerequisite documentation separate with ," onChange={(e) => {
                                                    this.setState({prerequisiteDocumentation: e.target.value.split(',')})
                                                }} /><br />
                                                <label htmlFor='certificationType'><b>CertificationType</b></label>
                                                <TextInput name='certificationType' id='certificationType' type='textarea' placeholder="Enter certification type ," onChange={this.handleChange} /><br />
                                                <label htmlFor='requiresClearance'><b>Requires Clearance</b></label><br />
                                                <select  name='requiresClearance' id='requiresClearance' >
                                                    <option value="true" >True</option>
                                                    <option value="false"  >False</option>
                                                </select><br />
                                                <label htmlFor='programDuration'><b>Program duration</b></label><br />
                                                <TextInput name='programDuration' id='programDuration' type='textarea' placeholder="Enter program duration e.g 4w2d" onChange={this.handleChange} /><br /><br />
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