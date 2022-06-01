import React, { useState } from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

interface Props {
    data: unknown;
    staff: { staffId: number; name: string };
    balanceCr: number;
    balanceDr: number;
    handleReversal: (transactionId: number) => void;
    transactionId: number;
    supportingDocument?: string;
    disabled: boolean;
    studentNameCr:string;
    studentNameDr:string;
}
const TransactionDetails: React.FunctionComponent<Props> = (props) => {
    const [confirmModal, setConfirmModal] = useState(false);

    return (
        <div>
            <Row>
                <div className="col-md-12">
                    <ListGroup>
                        {props.staff && (
                            <ListGroup.Item>
                                <h6>Recorded by:</h6> {props.staff.staffId} - {props.staff.name}
                            </ListGroup.Item>
                        )}
                        {props.balanceCr && (
                            <ListGroup.Item>
                                <h6>Student (Cr):</h6>
                                <p>{props.studentNameCr}</p>
                                <p>Balance: KES {props.balanceCr}</p>
                            </ListGroup.Item>
                        )}
                        {props.balanceDr && (
                            <ListGroup.Item>
                                <h6>Student (Dr):</h6>
                                <p>{props.studentNameDr}</p>
                                <p>Balance: KES {props.balanceDr}</p>
                            </ListGroup.Item>
                        )}
                        {props.supportingDocument && (
                            <ListGroup.Item>
                                <h6>Supporting document:</h6>link here
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </div>
            </Row>
            <div className="form-group mt-4">
                <button className="btn btn-info float-right">Print Receipt</button>
                <button className="btn btn-danger float-left" onClick={() => setConfirmModal(true)}>
                    Reverse Transaction
                </button>
            </div>
            <ConfirmationModalWrapper
                show={confirmModal}
                disabled={props.disabled}
                closeModal={() => {
                    setConfirmModal(false);
                }}
                submitButton
                submitFunction={() => {
                    props.handleReversal(props.transactionId);
                }}
            >
                <h6>Are you sure you want to reverse this transaction?</h6>
            </ConfirmationModalWrapper>
        </div>
    );
};

export default TransactionDetails;
