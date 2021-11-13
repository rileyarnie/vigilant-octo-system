import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,Form} from "react-bootstrap";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
//import log from '';
import Breadcrumb from '../../App/components/Breadcrumb';
import Config from '../../config';
import { Switch,FormGroup,FormControlLabel } from '@material-ui/core';

interface Course{
    name:string,
    id:number,
    prerequisiteCourses:string,
    description: string,
    trainingHours:number,
    isTimetableable: boolean,
    needsTechnicalAssistant: boolean
    activation_status:boolean,
    approval_status:boolean
}
interface Props extends React.HTMLAttributes<Element> {
	setEditModal:any,
	setProgress:any,
    fetchCourses:any,
    selectedCourse:Course
  }

const timetablingSrv = Config.baseUrl.timetablingSrv
class EditCourse extends Component <Props,{}> {
    
    state = {
        activation_status:this.props.selectedCourse.activation_status,
        approval_status:this.props.selectedCourse.approval_status
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleActivationStatusToggle = () =>{
        this.state.activation_status === true ? this.state.activation_status=false:this.state.activation_status=true
    }
    handleApprovalStatusToggle = () => {
        this.state.approval_status === true? this.state.approval_status=false:this.state.approval_status=true
    }

    handleSubmit = (e, formData,) => {
        e.preventDefault();
        const course = {
            activation_status: this.state.activation_status,
            approval_status: this.state.approval_status
        }

        axios.put(`${timetablingSrv}/courses/${this.props.selectedCourse.id}`, course)
            .then(res => {
                //handle success
                console.log(res);
                alert('Succesfully edited course')
                this.props.fetchCourses()
                this.props.setProgress(100)
                this.props.setEditModal(false)
                this.props.setProgress(0)
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error)
            });

    };

    handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

     selectStyle = {
        width:'100%',
        height: '30px'
    }
    

    render() {
        return (
            <>
                <Row className="align-items-center page-header">
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}>
                                            <div className='form-group'>
                                            <FormGroup className='align-items-center'>
                                            <FormControlLabel
                                            control={ 
                                                <Switch defaultChecked={this.state.activation_status} name="activationStatus" onClick={(event)=>this.handleActivationStatusToggle()}/>
                                            }
                                            label="Activation Status"
                                            />
                                            <FormControlLabel
                                            control={
                                                <Switch  name="approvalStatus" defaultChecked={this.state.approval_status} onClick={(event)=>this.handleApprovalStatusToggle()}/>
                                            }
                                            label="Approval Status"
                                            />
                                            </FormGroup>   
                                               
                                                &nbsp;&nbsp;&nbsp;
                                            </div>
                                            <div className='form-group'>
                                                <button className='btn btn-info float-right'>Submit</button>
                                            </div>
                                        </ValidationForm>
                                        <button className="btn btn-danger float-left" onClick={()=>this.props.setEditModal(false)}>Cancel</button> 
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

export default EditCourse;