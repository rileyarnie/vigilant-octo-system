/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import validator from 'validator';
import Select from 'react-select';
import { customSelectTheme } from '../lib/SelectThemes';
import CreatableSelect from 'react-select/creatable';
const alerts: Alerts = new ToastifyAlerts();
interface Props extends React.HTMLAttributes<Element> {
    setLinearDisplay: (string) => void;
    fetchcourseCohortsRegistrations: () => void;
    courseCohortId:number
}
const CreateMarksModal = (props:Props) => {
    const [courseCohortId,setCourseCohortId] = useState(0);
    const [courseCohortRegistrationId,setCourseCohortRegistrationId] = useState(0);
    const [typeOfMarks,setTypeOfMarks] = useState('');
    const [marks,setMarks] = useState('');
    const [programCohortSemesterId,setProgramCohortSemesterId] = useState(1);
    const [ccRegistrations,setCCRegistrations] = useState([]);
    const [modalShow,setModalShow] = useState(false)
    const options= []
    const simSrv = Config.baseUrl.simsSrv

    const markTypes = [
        {label:'Main', value:'main'},
        {label: 'Supplementary', value:'supplementary'},
        {label:'Credit Transfer', value:'creditTransfer'},
    ];

    useEffect(() => {
        fetchcourseCohortRegistrations();
    });

    function fetchcourseCohortRegistrations() {
        axios
            .get(`${simSrv}/course-cohort-registrations`, {
                params: {
                    courseCohortIds:props.courseCohortId
                }})
            .then((res) => {
                const ccRegs = res.data
                setCCRegistrations(ccRegs);
            })
            .catch((error) => {
            //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    }
    ccRegistrations.map((cc:any) => {
        return options.push({ value: cc.id, label: cc.id });
    });
    function postMarks() {
        axios
            .post(`${simSrv}/course-cohort-registrations-marks`, {
                params: {
                    courseCohortIds:courseCohortId
                }})
            .then((res) => {
                setCCRegistrations(res.data);
                // ccRegistrations.map((cc:any) => {
                //     return options.push({ value: cc.id, label: cc.id });
                // });
            })
            .catch((error) => {
            //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    }


    const handleMarkTypeChange = (selectedOption) => {
        setTypeOfMarks(selectedOption.value)
    };

    const handleSelectChange = (selectedOption) => {
        setCourseCohortRegistrationId(selectedOption.value)
    };

    const handleMarksInput = (e) => {
        setMarks(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const marksObj = {
            courseCohortRegistrationId: courseCohortRegistrationId,
            typeOfMarks: typeOfMarks,
            marks: marks,
            programCohortSemesterId:programCohortSemesterId
        };
        props.setLinearDisplay('block');
        axios
            .post(`${simSrv}/course-cohort-registration-marks`, { 
                courseCohortRegistrationId: courseCohortRegistrationId,
                typeOfMarks: typeOfMarks,
                marks: marks,
                programCohortSemesterId:programCohortSemesterId
            })
            .then(() => {
                alerts.showSuccess('Marks Created Successfully');
                props.fetchcourseCohortsRegistrations();
                props.setLinearDisplay('none');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

    return (
        <>    
            <Button variant="danger" onClick={() => setModalShow(true)}>
                Create Marks
            </Button>
            <Modal show={modalShow}>

                <Row className="align-items-center page-header"></Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm onSubmit={handleSubmit} onErrorSubmit={handleErrorSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="name">
                                                    <b>Course Cohort Registrations</b>
                                                </label>
                                                <Select
                                                    options={options}
                                                    isMulti={false}
                                                    placeholder="Select Course Cohort Registration"
                                                    noOptionsMessage={() => 'No available registrations'}
                                                    onChange={handleSelectChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;
                                                <br />      

                                                <label htmlFor="name">
                                                    <b>Marks</b>
                                                </label>
                                                <TextInput
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter marks"
                                                    required
                                                    onChange={handleMarksInput}
                                                />
                                                <br />                    



                                                <label htmlFor="name">
                                                    <b>Type Of Marks</b>
                                                </label>
                                                <Select
                                                    options={markTypes}
                                                    isMulti={false}
                                                    placeholder="Select Mark Type"
                                                    noOptionsMessage={() => 'No available mark types'}
                                                    onChange={handleMarkTypeChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;                                                
                                            </div>

                                            <div className="form-group">
                                                <button className="btn btn-danger float-right">Submit</button>
                                            </div>
                                        </ValidationForm>
                                        <button className="btn btn-info float-left" onClick={() =>setModalShow(false)}>
                                            Cancel
                                        </button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
        
            </Modal>
        </>    
    );
    
};

export default CreateMarksModal;
