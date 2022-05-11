import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {FileInput, TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {StudentFeesManagementService} from '../../services/StudentFeesManagementService';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

interface Props {
    show: boolean;
    closeModal: () => void;
    studentId: number;
}
const RecordFeePayment: React.FunctionComponent<Props> = (props) => {
    const [narrative, setNarrative] = useState('');
    const [evidenceUrl, setEvidenceUrl] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [fileUploaded, setFileUploaded] = useState('');
    const [disabled, setDisabled] = useState(false);

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
                alerts.showError(error.message);
            });
    };
    const handleSubmit = () => {
        setDisabled(true);
        const createFeeRecord = {
            studentId: props.studentId,
            narrative: narrative,
            evidenceUrls: evidenceUrl,
            amount: parseInt(amount)
        };
        StudentFeesManagementService.recordFeesReport(createFeeRecord)
            .then(() => {
                setDisabled(false);
                alerts.showSuccess('Fee Record created successfully');
                props.closeModal();
                toggleCloseConfirmModal();
            })
            .catch((error) => {
                setDisabled(false);
                props.closeModal();
                toggleCloseConfirmModal();
                alerts.showError(error.response.data);
            });
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
            <Modal
                show={props.show}
                onHide={props.closeModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter"><h6>Record Fee Item</h6></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm onSubmit={(e) => { e.preventDefault();toggleConfirmModal();}}>
                        <div className="form-group">
                            <label htmlFor="Amount"><b>Amount<span className="text-danger">*</span></b></label>
                            <TextInput
                                name="campusName"
                                id="campusName"
                                type="text"
                                required
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                }}
                                placeholder="Enter Amount"
                            />
                            <br/>
                            <label htmlFor="Amount"><b>Narrative<span className="text-danger">*</span></b></label>
                            <TextInput
                                name="Narrative"
                                id="Narrative"
                                type="text"
                                required
                                onChange={(e) => {
                                    setNarrative(e.target.value);
                                }}
                                placeholder="Enter Narrative"
                            />
                            <br/>
                            <label htmlFor="Amount"><b>Narrative<span className="text-danger">*</span></b></label><br/>
                            <Button
                                className="btn btn-danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowUploadModal(true);
                                }}
                            >
                                {' '}
                                Add Document
                            </Button>
                            <br />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info float-right">Submit</button>
                            <button className="btn btn-danger float-left" onClick={props.closeModal}>
                                Close
                            </button>
                        </div>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
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
                            <FileInput
                                name="fileUploaded"
                                id="image"
                                encType="multipart/form-data"
                                fileType={['pdf', 'doc', 'docx']}
                                maxFileSize="10mb"
                                onInput={(e) => {
                                    setFileUploaded(() => {
                                        return e.target.files[0];
                                    });
                                }}
                                errorMessage={{
                                    required: 'Please upload a document',
                                    fileType: 'Only document is allowed',
                                    maxFileSize: 'Max file size is 10MB'
                                }}
                            />
                        </ValidationForm>
                    </Modal.Body>

                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button disabled={disabled} className="float-left" variant="danger" onClick={toggleUploadModal}>
                            Close
                        </Button>
                        <Button disabled={disabled} className="float-right" variant="info" onClick={() => handleUpload()}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
            <ConfirmationModalWrapper disabled={disabled} submitButton submitFunction={handleSubmit} closeModal={toggleCloseConfirmModal} show={confirmModal}>
                <h6 className="text-center">Are you sure you want to add a fee record ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default RecordFeePayment;
