import React from 'react';
import { Button } from 'react-bootstrap';
import { AddActionsModal } from './AddActionsModal';
export const AddActions = (props):JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    const toggleModal = () => {
        modalShow ? setModalShow(false) : setModalShow(true);
    };
    return (
        <>
            <Button variant="danger mr-2" onClick={() => setModalShow(true)}>
              Add Actions
            </Button>

            <AddActionsModal
                show={modalShow}
                toggleModal={toggleModal}
                onHide={() => setModalShow(false)}
                selectedRowProps= {props}
            /> 
        </>
    );
};

 