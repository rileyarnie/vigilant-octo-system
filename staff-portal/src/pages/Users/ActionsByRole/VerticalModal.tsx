/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import {ActionsList} from '../ActionsList';
export const  VerticalModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.selectedrowprops.name} Actions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ActionsList selectedrowprops = {props}></ActionsList>
            </Modal.Body>
            <Modal.Footer style={{display: 'flex', justifyContent: 'flex-start'}}>
                <Button variant="danger float-left" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};