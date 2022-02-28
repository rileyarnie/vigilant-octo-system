/* eslint-disable react/prop-types */
import React from 'react';
import { VerticalModal } from './VerticalModal';
export const Actions = (props): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setModalShow(true)}>
                {props.children}
            </div>

            <VerticalModal show={modalShow} onHide={() => setModalShow(false)} selectedrowprops={props} />
        </>
    );
};

export default Actions;
