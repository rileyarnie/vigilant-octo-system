/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Props {
    children: any;
    show: boolean;
    closeModal?: () => void;
    title: string;
    modalSize: string;
    submitButton?: boolean;
    submitFunction?: () => void;
    noFooter?: boolean;
}
const ModalWrapper: React.FunctionComponent<Props> = (props) => {
    return (
        <Modal
            show={props.show}
            backdrop="static"
            centered
            size={`${props.modalSize === 'sm' ? 'sm' : props.modalSize === 'lg' ? 'lg' : props.modalSize === 'xl' ? 'xl' : null}`}
        >
            <Modal.Header closeButton onHide={props.closeModal}>
                <Modal.Title id="contained-modal-title-vcenter">{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            {!props.noFooter && (
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="danger" onClick={props.closeModal}>
                        Close
                    </Button>
                    {props.submitButton && props.submitFunction && (
                        <Button variant="info" onClick={props.submitFunction}>
                            Submit
                        </Button>
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default ModalWrapper;
