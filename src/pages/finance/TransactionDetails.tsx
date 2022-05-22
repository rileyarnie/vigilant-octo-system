import React, { useState } from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

interface Props {
    data: unknown;
    staff: { staffId: number; name: string };
    balanceCr: number;
    balanceDr: number;
    supportingDocument?: string;
}
const TransactionDetails: React.FunctionComponent<Props> = (props) => {
    const [disabled, setDisabled] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    //reverse transaction function
    const reverseTransactionHandler = () => {
        setDisabled(true);
        console.log('transaction reversed');
    };
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
                                <p>reg No - Name</p>
                                <p>Balance: KES {props.balanceCr}</p>
                            </ListGroup.Item>
                        )}
                        {props.balanceDr && (
                            <ListGroup.Item>
                                <h6>Student (Dr):</h6>
                                <p>reg No - Name</p>
                                <p>Balance: KES {props.balanceDr}</p>
                            </ListGroup.Item>
                        )}
                        {/* <ListGroup.Item>
                            <h6>Program:</h6>
                            code - Name
                        </ListGroup.Item> */}
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
                disabled={disabled}
                closeModal={() => {
                    setConfirmModal(false);
                }}
                submitButton
                submitFunction={reverseTransactionHandler}
            >
                <h6>Are you sure you want to reverse this transaction?</h6>
            </ConfirmationModalWrapper>
        </div>
    );
};

export default TransactionDetails;
