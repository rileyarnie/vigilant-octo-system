import React from 'react';
import { Button } from 'react-bootstrap';
import { AddActionsModal } from './AddActionsModal';

export const AddActions = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button variant="danger mr-2" onClick={() => setModalShow(true)}>
              Add Actions
            </Button>

            <AddActionsModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                selectedRowProps= {props}
            /> 
        </>
    );
};

 