import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from "react-bootstrap";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
//import log from '';
import Breadcrumb from '../../App/components/Breadcrumb';
import Config from '../../config';

const timetablingSrv = Config.baseUrl.timetablingSrv
class CourseCreation extends Component {
    state = {
        name: '',
        prerequisiteCourses: [],
        description: '',
        trainingHours: 0,
        isTimetablable: false,
        needsTechnicalAssistant: false
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e, formData,) => {
        e.preventDefault();
        const course = {
            name: this.state.name,
            prerequisiteCourses: this.state.prerequisiteCourses,
            description: this.state.description,
            trainingHours: this.state.trainingHours,
            isTimetableable: this.state.isTimetablable,
            needsTechnicalAssistant: this.state.needsTechnicalAssistant
        }

        axios.post(`${timetablingSrv}/courses`, course)
            .then(res => {
                //handle success
                console.log(res);
                alert('Succesfully created course')
                this.setState({
                    name: '',
                    prerequisiteCourses: '',
                    description: '',
                    trainingHours: '',
                    isTimetableable: false,
                    needsTechnicalAssistant: false
                })
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error)
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
                                                <label htmlFor='name'><b>Name of course</b></label>
                                                <TextInput name='name' value={this.state.name} id='name' type='text' placeholder="Enter name"  onChange={this.handleChange} /><br />
                                                <label htmlFor='precourses'><b>Prerequisite Courses</b></label>
                                                <TextInput name='precourses' value={this.state.prerequisiteCourses} id='precourses' type='textarea' placeholder="Enter prerequisite courses separate with ," onChange={(e) => {
                                                    this.setState({prerequisiteCourses: e.target.value.split(',')})
                                                }} /><br />
                                                <label htmlFor='description'><b>Description</b></label>
                                                <TextInput name='description' id='desc' type='text' value={this.state.description} placeholder="enter description" onChange={this.handleChange} /><br />
                                                <label htmlFor='trainingHours'><b>Training Hours</b></label>
                                                <TextInput name='trainingHours' id='hours' type='text' value={this.state.trainingHours} placeholder="number of hours" onChange={this.handleChange} /><br />
                                                <label htmlFor='tiimetablelable'><b>Timetablable?</b></label><br />
                                                <select  name='timetabelable' value={JSON.stringify(this.state.isTimetablable)} id='timetableable' >
                                                    <option value="true" >True</option>
                                                    <option value="false" >False</option>
                                                </select><br /><br />
                                                <label htmlFor='technicalAssistant'><b>Needs Technical Assistant?</b></label><br />
                                                <select  name='technicalAssistant' value={JSON.stringify(this.state.needsTechnicalAssistant)} id='technicalAssistant' >
                                                    <option value="true" >True</option>
                                                    <option value="false"  >False</option>
                                                </select>
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

export default CourseCreation;