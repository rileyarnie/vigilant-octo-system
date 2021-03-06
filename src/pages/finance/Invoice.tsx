import React from 'react';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

interface Props {
    show: boolean;
    closeModal: () => void;
}

const Invoice: React.FunctionComponent<Props> = (props) => {
    //submit function to come here
    const handleSubmit = () => {
        console.log('Submitted');
    };
    return (
        <div>
            FeeWaiver
            <div>
                <ModalWrapper
                    show={props.show}
                    closeModal={props.closeModal}
                    title="Invoice"
                    modalSize="lg"
                    submitButton
                    submitFunction={handleSubmit}
                >
                    <Form>
                        <Form.Group controlId="formAmmount">
                            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Col sm={3}>Amount:</Col>
                                <Col sm={9}>
                                    <FormControl type="number" placeholder="Enter Amount" />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formAmmount">
                            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Col sm={3}>Narrative:</Col>
                                <Col sm={9}>
                                    <FormControl type="text" as="textarea" placeholder="Enter Narrative" />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </ModalWrapper>
            </div>
        </div>
    );
};

export default Invoice;
