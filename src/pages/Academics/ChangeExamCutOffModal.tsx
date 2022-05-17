import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import {Alerts, ToastifyAlerts} from '../lib/Alert';

const alerts: Alerts = new ToastifyAlerts();

const ChangeExamCutOffModal: React.FunctionComponent<{
    programCohortSemesterId:number,
     showCutOffModal:boolean, 
     setShowModal,
     modalTitle:string
    }> = (props) => {

        const [cutOffDate, setCutOffDate] = useState(new Date());
        const [disabled, setDisabled] = useState(false);
        const [activationModal, setActivationModal] = useState(false);
        const handleClose = () => props.setShowModal(false); 
        function handleCloseActivationModal () {
            setActivationModal(false);
        }

        async function updatePCSCutOffDate(pcsId: number, updates:unknown){
            setDisabled(true);
            try {
                try {
                    await timetablingAxiosInstance
                        .put(`/program-cohort-semesters/${pcsId}/marks-entry-cutoff`, updates);
                    alerts.showSuccess('Successfully updated program cohort semester');
                } catch (error) {
                    alerts.showError((error as Error).message);
                }
            } finally {
                setDisabled(false);
                setActivationModal(false);
                props.setShowModal(false);
            }
        }
    
        return (
            <>
  
                <Modal
                    show={props.showCutOffModal}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{props.modalTitle} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Enter a new cut off date</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div>
                                <DatePicker selected={cutOffDate} onChange={(date:Date) => setCutOffDate(date)} />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button disabled={disabled} variant="btn btn-info btn-rounded" onClick={handleClose}>
                        Close
                        </Button>
                        <Button
                            disabled={disabled}
                            onClick={() => {
                                setActivationModal(true);
                            }}
                            variant="btn btn-danger btn-rounded"
                        >
                        Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ConfirmationModalWrapper
                    disabled={disabled}
                    submitButton
                    submitFunction={() => updatePCSCutOffDate(props.programCohortSemesterId,{examCutOffDate:cutOffDate})}
                    closeModal={handleCloseActivationModal}
                    show={activationModal}
                >
                    <h6 className="text-center">
                                Are you sure you want to change the exam cut off date of Program Cohort Semester Id {props.programCohortSemesterId} to {cutOffDate.toDateString()}
                    </h6>
                </ConfirmationModalWrapper>
            </>
        );
    };

export default ChangeExamCutOffModal;