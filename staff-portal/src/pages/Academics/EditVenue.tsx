import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Breadcrumb from '../../App/components/Breadcrumb';
import Config from '../../config';

const EditVenue = (props) => {
    const [venueName,setVenueName] = useState('')
    let venues:venue[] =  props.data

    interface venue{
        name:string,
        id:number
    }
    const timetableSrv = Config.baseUrl.timetablingSrv;
    const venueChangeHandler = (event) =>{
        setVenueName(event.target.value)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        const modifiedVenue = {
            name: venueName
        };
        params.append('Venue', JSON.stringify(modifiedVenue));
        axios.put(`${timetableSrv}/venues/${props.id}`, params)
             .then((res)=>{
                props.setProgress(100)       
                alert(res.status) 
                props.setEditModal(false)
                props.fetchVenues()
                props.setProgress(0)                  
             })
             .catch((err)=>{
                 alert(err.message)
                 console.log(err)
             })
    };
    return (
        <div>
            <Row className="align-items-center page-header"></Row>
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
