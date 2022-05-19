import React from 'react';
import { ListGroup, Row } from 'react-bootstrap';

interface Props {
    data: unknown;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TransactionDetails: React.FunctionComponent<Props> = (props) => {
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
                        <ListGroup.Item>
                            <h6>Program:</h6>
                            code - Name
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h6>Supporting document:</h6>- link here
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>
            <div className="form-group mt-4">
                <button className="btn btn-info float-right">Print Receipt</button>
                <button className="btn btn-danger float-left" onClick={() => console.log('reverse transaction')}>
                    Reverse Transaction
                </button>
            </div>
        </div>
    );
};

export default TransactionDetails;
