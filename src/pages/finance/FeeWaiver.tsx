import React, { useState } from 'react';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
import { Alerts, ToastifyAlerts } from '../lib/Alert';

const alerts: Alerts = new ToastifyAlerts();

interface Props {
    show: boolean;
    closeModal: () => void;
    studentId: number;
}

const FeeWaiver: React.FunctionComponent<Props> = (props) => {
    const [amount, setAmount] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [narrative, setNarrative] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = () => {
        setDisabled(true);
        const waiver = {
            studentId: props.studentId,
            narrative: narrative,
            amount: parseInt(amount)
        };
        StudentFeesManagementService.applyWaiver({ ...waiver })
            .then(() => {
                alerts.showSuccess('Fee Record created successfully');
                toggleCloseConfirmModal();
                props.closeModal();
            })
            .catch((error) => {
                props.closeModal();
                toggleCloseConfirmModal();
                alerts.showError(error.response.data);
            })
            .finally(() => setDisabled(false));
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
                                <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Col sm={3}>Amount:</Col>
                                    <Col sm={9}>
                                        <FormControl
                                            type="number"
                                            onChange={(e) => {
                                                setAmount(e.target.value);
                                            }}
                                            placeholder="Enter Amount"
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group controlId="form">
                                <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Col sm={3}>Narrative:</Col>
                                    <Col sm={9}>
                                        <FormControl
                                            type="text"
                                            as="textarea"
                                            onChange={(e) => {
                                                setNarrative(e.target.value);
                                            }}
                                            placeholder="Enter Narrative"
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </ModalWrapper>
                </div>
            </div>
            <ConfirmationModalWrapper disabled={disabled} submitButton submitFunction={handleSubmit} closeModal={toggleCloseConfirmModal} show={confirmModal}>
                <h6 className="text-center">Are you sure you want to add a fee waiver ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default FeeWaiver;
