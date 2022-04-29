/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Props {
    show: boolean;
    closeModal: () => void;
    title?: string;
    submitButton?: boolean;
    submitFunction?: (e?: unknown) => void;
}
const ConfirmationModalWrapper: React.FunctionComponent<Props> = (props) => {
    return (
        <Modal
            show={props.show}
            backdrop="static"
            centered
            size="sm"
        >
            <Modal.Header closeButton onHide={props.closeModal}>
                <Modal.Title id="contained-modal-title-vcenter">{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.closeModal}>
                    Close
                </Button>
                {props.submitButton && props.submitFunction && (
                    <Button variant="info" onClick={props.submitFunction}>
                        Confirm
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModalWrapper;
