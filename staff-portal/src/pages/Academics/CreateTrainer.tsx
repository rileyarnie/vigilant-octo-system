import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card, DropdownButton, Dropdown,} from "react-bootstrap";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
//import log from '';
import Select from 'material-table';
import Breadcrumb from '../../App/components/Breadcrumb';
import Config from '../../config';

class CreateTrainer extends Component {
    state = {
        userId: 0,
        departmentId: 0,
        trainerType: '',
        users: [],
        departments: []
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e, formData,) => {
        e.preventDefault();
        const course = {
            userId: this.state.userId,
            departmentId: this.state.departmentId,
            trainerType: this.state.trainerType
        }

        axios.put(`${Config.baseUrl.timetablingSrv}/trainers`, course)
            .then(res => {
                //handle success
                alert('Succesfully updated')
                console.log(res);
            })
            .catch((error) => {
                //handle error using logging library
                //console.error(error);
                alert(error)
            });
    };

    handleErrorSubmit = (e, _formData, errorInputs) => {
        alert(errorInputs)
        console.error(errorInputs);
    };

    componentDidMount(){
        axios.get(`${Config.baseUrl.timetablingSrv}/users`)
            .then(res => {
                this.setState({users: res.data});

            })
            .catch(error => {
                //handle error using logging library
                console.log('Error');
                alert('Fetching users failed')
            });

            axios.get(`${Config.baseUrl.timetablingSrv}/departments`)
            .then(res => {
                this.setState({ departments: res.data});
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert('Fetching departments failed')
            });
    }

    render() {
        const trainerTypes = [
            'Lecturer',
            'Trainer',
            'Assistant',
        ]
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

                                            <label htmlFor='user'><b>User</b></label><br />

                                            <DropdownButton variant="danger" title="Select user" id="user" >

                                                {

                                                    this.state.users.map(user => {

                                                        return(

                                                            <Dropdown.Item href="#/action-1" value={user.id} >{user.AADAlias}</Dropdown.Item>

                                                        )

                                                    })

                                                }

                                            </DropdownButton>

                                            <br /><br />

                                            <label htmlFor='department'><b>Department</b></label><br />

                                            <DropdownButton variant="danger" title="Select department" id='department'>

                                                {

                                                    this.state.departments.map(dept => {

                                                        return(

                                                            <Dropdown.Item value={dept.id} >{dept.name}</Dropdown.Item>

                                                        )

                                                    })

                                                }

                                            </DropdownButton>

                                            <br /><br />

                                            <label htmlFor='trainerType'><b>Trainer type</b></label><br />

                                            <DropdownButton variant="danger" id='trainerType'  title="Select trainer type">

                                                {

                                                    trainerTypes.map(ttype => {

                                                        return(

                                                            <Dropdown.Item value={ttype} >{ttype}</Dropdown.Item>

                                                        )

                                                    })

                                                }

                                            </DropdownButton>

                                            <br /><br />

                                        </div>

                                        <div className='form-group'>

                                            <button className='btn btn-danger' >Submit</button>

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

export default CreateTrainer;