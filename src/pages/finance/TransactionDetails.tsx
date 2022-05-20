import React, { useState } from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

interface Props {
    data: unknown;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TransactionDetails: React.FunctionComponent<Props> = (props) => {
    const [disabled, setDisabled] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    //reverse transaction function
    const reverseTransactionHandler = () => {
        console.log('transaction reversed');
    };
    return (
        <div>
            {console.log('props.data', props.data)}
            <Row>
                <div className="col-md-12">
                    <ListGroup>
                        <ListGroup.Item>
                            <h6>Recorded by:</h6> staffId - Name
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h6>Student:</h6>
                            reg No - Name
                        </ListGroup.Item>
                        {/* <ListGroup.Item>
                            <h6>Program:</h6>
                            code - Name
                        </ListGroup.Item> */}
                        <ListGroup.Item>
                            <h6>Fee Balance:</h6>balance here
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h6>Supporting document:</h6>link here
                        </ListGroup.Item>
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
