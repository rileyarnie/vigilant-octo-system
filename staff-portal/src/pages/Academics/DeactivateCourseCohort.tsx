import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Button, Col } from 'react-bootstrap';
import Config from '../../config';


interface ICourseCohort {
  id:number;
  isActive:boolean;
  courseName:string;
  programName:string;
  semesterName:string;
}

interface IProps {
  selectedRow:ICourseCohort
}

export const DeactivateCourseCohort = (props:IProps) => {
   
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const [showModal,setShowModal] = useState(false);
    let activationStatus:boolean;
    let buttonVariant:string;
    let message:string;
    let action:string;
    let actionVerb:string;
 
    if(props.selectedRow.isActive){
        activationStatus=false;
        buttonVariant='danger';
        message = `You are about to deactivate ${props.selectedRow.courseName} for ${props.selectedRow.programName} in the semester ${props.selectedRow.semesterName}, this will mean that the course cohort will not be included in the timetable, are you sure you want to proceed? `;
        action= 'Deactivate';
        actionVerb='Deactivating';
    }
    else{
        buttonVariant='success';
        activationStatus=true;
        message=`You are about to activate ${props.selectedRow.courseName} for ${props.selectedRow.programName} in the semester ${props.selectedRow.semesterName}, this will mean that the course cohort will be reinstated in the timetable, are you sure you want to proceed?`;
        action='Activate';
        actionVerb='Activating';
    }

    const handleToggleCourseCohortActivation = () => {
        const courseCohort = {
            isActive : activationStatus
        };
        axios
            .patch(`${timetablingSrv}/course-cohorts/${props.selectedRow.id}`, courseCohort)
            .then(() => {
                alert('Success');
                setShowModal(false);
          
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error.message);
                alert(error.message);
            });
    };
    return (
        <>
            <Button variant= {buttonVariant} onClick={() => setShowModal(true)}>
                {action}
            </Button>  
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={ showModal }
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h5> {actionVerb} a course-cohort </h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {message}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button variant = "danger" className="float-left" onClick = {() => setShowModal(false)}>Cancel</Button>
                        <Button variant = "info" className="float-right" onClick = {() => handleToggleCourseCohortActivation()}>{action}</Button>
                    </Col>  
                </Modal.Footer>
            </Modal>
        </>
    );
};
  
  