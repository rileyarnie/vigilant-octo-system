/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from 'react-bootstrap';
import { AddActionsModal } from './AddActionsModal';

export const AddActions = (props): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    const toggleModal = () => {
        modalShow ? setModalShow(false) : setModalShow(true);
    };
    return (
        <>
            <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setModalShow(true)}>
                {props.children}
            </div>

            <AddActionsModal show={modalShow} toggleModal={toggleModal} onHide={() => setModalShow(false)} selectedRowProps={props} />
        </>
    );
};
