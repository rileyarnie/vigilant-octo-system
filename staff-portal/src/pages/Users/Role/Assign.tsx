import React from 'react';
import { Button } from 'react-bootstrap';
import { AssignRoleModal } from './AssignRoleModal';

export const Assign = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button variant="danger mr-2" onClick={() => setModalShow(true)}>
                Assign Role
            </Button>

            <AssignRoleModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                selectedrowprops= {props}
            />
        </>
    );
};

