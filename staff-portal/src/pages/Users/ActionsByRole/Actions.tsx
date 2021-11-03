import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { VerticalModal } from './VerticalModal';

export const Actions = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setModalShow(true)}>
       Role Actions
      </Button>

      <VerticalModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedrowprops= {props}
      /> 
    </>
  );
};

export default Actions;
 