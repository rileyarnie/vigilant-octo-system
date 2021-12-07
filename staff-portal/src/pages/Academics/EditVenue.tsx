/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
const EditVenue = (props) => {
    const [venueName,setVenueName] = useState('');
    const timetableSrv = Config.baseUrl.timetablingSrv;
    const venueChangeHandler = (event) =>{
        setVenueName(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const modifiedVenue = {
            name: venueName
        };
        props.setLinearDisplay('block');
        axios.put(`${timetableSrv}/venues/${props.venue_id}`, {'Venue': modifiedVenue})
            .then(()=>{
                alerts.showSuccess('successfully updated Venue details');
                props.setEditModal(false);
                props.fetchVenues();
                props.setLinearDisplay('none');                
            })
            .catch((error)=>{
                console.log(error);
                alerts.showError(error.message);
            });
    };
    return (
        <div>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <ValidationForm onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                <b>Enter new venue name</b>
                                            </label>
                                            <TextInput
                                                name="name"
                                                id="name"
                                                type="text"
                                                placeholder="Hall 6"
                                                validator={validator.isAlphanumeric}
                                                errorMessage={{ validator: 'Please enter a valid name' }}
                                                value={venueName}
                                                onChange = {venueChangeHandler}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-danger float-right">Submit</button>
                                        </div>
                                    </ValidationForm>
                                    <button className="btn btn-info float-left" onClick={()=>props.setEditModal(false)}>Cancel</button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EditVenue;
