import React, {useState} from 'react';
import {Button, Col, Form, FormControl, Modal, Row} from 'react-bootstrap';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import {StudentFeesManagementService} from '../../services/StudentFeesManagementService';
import {Alerts, ToastifyAlerts} from '../lib/Alert';

const alerts: Alerts = new ToastifyAlerts();

interface Props {
    show: boolean;
    closeModal: () => void;
    studentId: number
}

const FeeWaiver: React.FunctionComponent<Props> = (props) => {
    const [amount, setAmount] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [narrative, setNarrative] = useState('');
    const handleSubmit = () => {
        const waiver = {
            studentId: props.studentId,
            narrative: narrative,
            amount: parseInt(amount)
        };
        StudentFeesManagementService.applyWaiver({...waiver})
            .then(() => {
                alerts.showSuccess('Fee Record created successfully');
            })
            .catch((error) => {
                alerts.showError(error.response.data);
            });
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    return (
        <>
            <div>
                FeeWaiver
                <div>
                    <ModalWrapper
                        show={props.show}
                        closeModal={props.closeModal}
                        title="Apply Fee Waiver"
                        modalSize="lg"
                        submitButton
                        submitFunction={toggleConfirmModal}
                    >
                        <Form>
                            <Form.Group controlId="formAmmount">
                                <Row style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Col sm={3}>Amount:</Col>
                                    <Col sm={9}>
                                        <FormControl type="number" onChange={(e) => {
                                            setAmount(e.target.value);
                                        }} placeholder="Enter Amount"/>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group controlId="form">
                                <Row style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Col sm={3}>Narrative:</Col>
                                    <Col sm={9}>
                                        <FormControl type="text" as="textarea" onChange={(e) => { setNarrative(e.target.value);}} placeholder="Enter Narrative"/>
                                    </Col>
                                </Row>
                            </Form.Group>
                            {/*<Form.Group controlId="formAmmount">*/}
                            {/*    <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>*/}
                            {/*        <Col sm={3}>Invoice Number:</Col>*/}
                            {/*        <Col sm={9}>*/}
                            {/*            <FormControl type="select" as="select" placeholder="Enter Invoice Number" />*/}
                            {/*        </Col>*/}
                            {/*    </Row>*/}
                            {/*</Form.Group>*/}
                        </Form>
                    </ModalWrapper>
                </div>
            </div>
            <Modal
                show={confirmModal}
                onHide={toggleConfirmModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>{' '}</Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">A you sure you want to add a fee waiver ?</h6>
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

export default FeeWaiver;
