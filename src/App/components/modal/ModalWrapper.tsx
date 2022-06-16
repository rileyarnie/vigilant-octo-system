/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import LinearProgress from '@material-ui/core/LinearProgress';

interface Props {
    children: any;
    show: boolean;
    closeModal?: () => void;
    title: string;
    modalSize?: string;
    submitButton?: boolean;
    submitFunction?: () => void;
    noFooter?: boolean;
    linearDisplay?: boolean;
    disabled?: boolean;
}
const ModalWrapper: React.FunctionComponent<Props> = (props) => {
    return (
        <Modal
            show={props.show}
            backdrop="static"
            centered
            size={`${props.modalSize === 'sm' ? 'sm' : props.modalSize === 'lg' ? 'lg' : props.modalSize === 'xl' ? 'xl' : null}`}
        >
            {props.linearDisplay && <LinearProgress />}
            <Modal.Header closeButton onHide={props.closeModal}>
                <Modal.Title id="contained-modal-title-vcenter">{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            {!props.noFooter && (
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button disabled={props.disabled} variant="danger" onClick={props.closeModal}>
                        Close
                    </Button>
                    {props.submitButton && props.submitFunction && (
                        <Button disabled={props.disabled} variant="info" onClick={props.submitFunction}>
                            Submit
                        </Button>
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default ModalWrapper;
