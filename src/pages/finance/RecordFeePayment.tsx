import React, { useState } from 'react';
import {Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import { ValidationForm, FileInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
interface Props {
    show: boolean;
    closeModal: () => void;
    studentId: number
}
const RecordFeePayment: React.FunctionComponent<Props> = (props) => {
    const [narrative, setNarrative] = useState('');
    const [evidenceUrl, setEvidenceUrl] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [fileUploaded, setFileUploaded] = useState('');
    const handleUpload = () => {
        const form = new FormData();
        form.append('fileUploaded', fileUploaded);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        StudentFeesManagementService.uploadSupportDocument(form, config)
            .then((res) => {
                toggleUploadModal();
                alerts.showSuccess('File uploaded successfully');
                setEvidenceUrl(res['data']);
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    };
    const handleSubmit = () => {
        const createFeeRecord = {
            studentId: props.studentId,
            narrative: narrative,
            evidenceUrls: evidenceUrl,
            amount: parseInt(amount)
        };
        StudentFeesManagementService.recordFeesReport(createFeeRecord)
            .then(() => {
                alerts.showSuccess('Fee Record created successfully');
            })
            .catch((error) => {
                alerts.showError(error.response.data);
            });
        console.log('Data to be sent',createFeeRecord);
    };
    const toggleUploadModal = () => {
        showUploadModal ? setShowUploadModal(false) : setShowUploadModal(true);
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    return (
        <>
            <ModalWrapper
                show={props.show}
                closeModal={props.closeModal}
                title="Record Fee Item"
                modalSize="lg"
                submitButton
                submitFunction={toggleConfirmModal}
            >
                <Form>
                    <Form.Group controlId="formAmount">
                        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Col sm={3}>Amount:</Col>
                            <Col sm={9}>
                                <FormControl type="number"
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    placeholder="Enter Amount" />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="formAmount">
                        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Col sm={3}>Narrative:</Col>
                            <Col sm={9}>
                                <FormControl type="text" as="textarea"
                                    onChange={(e) => {
                                        setNarrative(e.target.value);
                                    }}
                                    placeholder="Enter Narrative" />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="formAmount">
                        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Col sm={3}>Supporting Documents:</Col>
                            <Col sm={9}>
                                <Button className="btn btn-danger" onClick={(e) => { e.preventDefault(); setShowUploadModal(true); }}> Add Document</Button><br/>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </ModalWrapper>
            <Modal
                backdrop="static"
                show={showUploadModal}
                onHide={toggleUploadModal}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload support document</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ValidationForm>
                            <FileInput name="fileUploaded" id="image" encType="multipart/form-data"
                                fileType={['pdf', 'doc', 'docx']} maxFileSize="10mb"
                                onInput={(e) => { setFileUploaded(() => { return e.target.files[0]; });
                                }}
                                errorMessage={{ required: 'Please upload a document', fileType: 'Only document is allowed', maxFileSize: 'Max file size is 10MB' }}/>
                        </ValidationForm>
                    </Modal.Body>

                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }} >
                        <Button className="float-left" variant="danger" onClick={toggleUploadModal}>Close</Button>
                        <Button className="float-right" variant="info" onClick={() => handleUpload()}>Upload</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
            <Modal
                show={confirmModal}
                onHide={toggleConfirmModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>{' '}</Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">A you sure you want to add a fee record ?</h6>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseConfirmModal}>
                        Continue editing
                    </Button>
                    <button className="btn btn-info float-right" onClick={handleSubmit}>
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RecordFeePayment;
