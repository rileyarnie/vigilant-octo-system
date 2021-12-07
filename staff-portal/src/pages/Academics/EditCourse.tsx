/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card} from 'react-bootstrap';
import { ValidationForm} from 'react-bootstrap4-form-validation';
import Config from '../../config';
import { Switch,FormGroup,FormControlLabel } from '@material-ui/core';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
interface Props extends React.HTMLAttributes<Element> {
    setEditModal:(boolean) => void;
    selectedCourse:selectedCourse
    fetchCourses:() => void;
  }
  interface selectedCourse {
    id:number,
    activation_status:boolean,
    approval_status: boolean

  }

const timetablingSrv = Config.baseUrl.timetablingSrv;
class EditCourse extends Component <Props> {
    
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
        this.state.activation_status === true ? this.state.activation_status=false:this.state.activation_status=true;
    }
    handleApprovalStatusToggle = () => {
        this.state.approval_status === true? this.state.approval_status=false:this.state.approval_status=true;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const course = {
            activation_status: this.state.activation_status,
            approval_status: this.state.approval_status
        };

        axios.put(`${timetablingSrv}/courses/${this.props.selectedCourse.id}`, course)
            .then(res => {
                //handle success
                console.log(res);
                alerts.showSuccess('Course edited Successfully');
                this.props.fetchCourses();
                this.props.setEditModal(false);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
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
                                                             <Switch defaultChecked={this.state.activation_status} name="activationStatus" onClick={()=>this.handleActivationStatusToggle()}/>
                                                         }
                                                         label="Activation Status"
                                                     />
                                                     <FormControlLabel
                                                         control={
                                                             <Switch  name="approvalStatus" defaultChecked={this.state.approval_status} onClick={()=>this.handleApprovalStatusToggle()}/>
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