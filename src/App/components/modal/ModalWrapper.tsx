import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Props {
    show: boolean;
    closeModal: () => void;
    title: string;
    modalSize: string;
    submitButton?: boolean;
    submitFunction?: () => void;
}

const ModalWrapper: React.FunctionComponent<Props> = (props) => {
    return (
        <Modal
            show={props.show}
            backdrop="static"
            centered
            size={`${props.modalSize === 'sm' ? 'sm' : props.modalSize === 'lg' ? 'lg' : 'xl'}`}
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
                        Submit
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ModalWrapper;