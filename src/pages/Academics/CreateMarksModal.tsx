/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import Select from 'react-select';
import {  FileInput } from 'react-bootstrap4-form-validation';
import CertificationType from './enums/CertificationType';
const alerts: Alerts = new ToastifyAlerts();
interface Props extends React.HTMLAttributes<Element> {
    setLinearDisplay: (string) => void;
    fetchcourseCohortsRegistrations: () => void;
    courseCohortId:number;
    certificationType:string;
}
const CreateMarksModal = (props:Props) => {
    const [courseCohortRegistrationId,setCourseCohortRegistrationId] = useState(0);
    const [typeOfMarks,setTypeOfMarks] = useState('');
    const [marks,setMarks] = useState(0);
    const [programCohortSemesterId,] = useState(1);
    const [ccRegistrations,setCCRegistrations] = useState([]);
    const [modalShow,setModalShow] = useState(false);
    const options= [];
    const simSrv = Config.baseUrl.simsSrv;
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const [imageUploaded, setImageUploaded] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    let selectedMarks;
    const markTypes = [
        {label:'Main', value:'main'},
        {label: 'Supplementary', value:'supplementary'},
        {label:'Credit Transfer', value:'creditTransfer'},
    ];

    const shortTermMarks = [
        {value:'complete', label:'complete'},
        {value:'incomplete', label:'incomplete'}
    ];

    const competencyBasedMarks = [
        {value:'pass', label:'pass'},
        {value:'fail', label:'fail'}
    ];

    const handleSelect= (e) => {
        selectedMarks=e.target.value;
    };
    useEffect(() => {
        fetchcourseCohortRegistrations();
    },[]);
    function renderSwitch(){
        switch(props.certificationType) {
        case CertificationType.shortTerm:                                                                         
            return (
                <>
                    <label htmlFor="name">
                        <b>Short Term Marks</b>
                    </label>                
                    <Select
                        options={shortTermMarks}
                        isMulti={false}
                        placeholder="Select short term marks"
                        noOptionsMessage={() => 'No available short term marks options'}
                        onChange={(e) => handleSelect(e)}
                    />
                    <br />
                    <label htmlFor="cohortName">
                        <b>Upload Transcript</b>
                    </label>
                    <br />
                    <br />   
                    <label >
                        <b>Upload Transcript</b>
                    </label>
                    <br />
                    <button
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowUploadModal(true);
                        }}
                    >
                                        Upload transcript
                    </button> 
                    <br></br>     
                    <br></br>  
                </>
            );

        case CertificationType.competencyBased:            
            return (
                <>
                    <label htmlFor="name">
                        <b>Comptenecy Based Marks</b>
                    </label>                  
                    <Select
                        options={competencyBasedMarks}
                        isMulti={false}
                        noOptionsMessage={() => 'No available competency based marks options'}
                        onChange={(e) => handleSelect(e)}
                    />
                    <br />   
                    <label >
                        <b>Upload Transcript</b>
                    </label>
                    <br />
                    <button
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowUploadModal(true);
                        }}
                    >
                                        Upload transcript
                    </button> 
                    <br></br>     
                    <br></br>  
                </>                    
            );  
        default:
            return (
                <>
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
                    <br></br>  
                </>             
            );    
        }
    }
    function fetchcourseCohortRegistrations() {
        axios
            .get(`${simSrv}/course-cohort-registrations`, {
                params: {
                    courseCohortIds:props.courseCohortId
                }})
            .then((res) => {
                const ccRegs = res.data;
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


    const handleMarkTypeChange = (selectedOption) => {
        setTypeOfMarks(selectedOption.value);
    };

    const handleSelectChange = (selectedOption) => {
        setCourseCohortRegistrationId(selectedOption.value);
    };

    const handleMarksInput = (e) => {
        setMarks(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.setLinearDisplay('block');
        axios
            .post(`${simSrv}/course-cohort-registration-marks`, { 
                courseCohortRegistrationId: courseCohortRegistrationId,
                typeOfMarks: typeOfMarks,
                marks: marks | selectedMarks,
                programCohortSemesterId:programCohortSemesterId
            })
            .then(() => {
                alerts.showSuccess('Marks Created Successfully');
                props.fetchcourseCohortsRegistrations();
                props.setLinearDisplay('none');
                setModalShow(false);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.response.data);
            });
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

    const toggleUploadModal = () => {
        showUploadModal ? setShowUploadModal(false) : setShowUploadModal(true);
    };

    const handleUpload = (): void => {
        const form = new FormData();
        form.append('fileUploaded', imageUploaded);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        props.setLinearDisplay('block');
        axios
            .post(`${timetablingSrv}/files`, form, config)
            .then((res) => {
                console.log(res.data);
                alerts.showSuccess('successfully uploaded');
                props.setLinearDisplay('none');
                toggleUploadModal();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };

    return (
        <>    
            <Button variant="danger" className = "float-right" onClick={() => setModalShow(true)}>
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

                                                {/* <label htmlFor="name">
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
                                                <br />                     */}
                                                {renderSwitch()}


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
            <Modal backdrop="static" show={showUploadModal} onHide={toggleUploadModal} size="sm" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <FileInput
                            name="fileUploaded"
                            id="image"
                            encType="multipart/form-data"
                            onChange={(e) => {
                                setImageUploaded(() => {
                                    return e.target.files[0];
                                });
                            }}
                            required
                            fileType={['png', 'jpg', 'jpeg']}
                            maxFileSize="3mb"
                            errorMessage={{
                                required: 'Please upload an image',
                                fileType: 'Only image is allowed',
                                maxFileSize: 'Max file size is 3MB'
                            }}
                        />
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="btn btn-info btn-rounded" onClick={toggleUploadModal}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            handleUpload();
                        }}
                        variant="btn btn-danger btn-rounded"
                    >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>    
    );
    
};

export default CreateMarksModal;
