import React from 'react';
import {Col, Row} from 'react-bootstrap';
import { ACTION_CREATE_USERS} from '../../../authnz-library/authnz-actions';
import { canPerformActions } from '../../../services/ActionChecker';
import CreateStaffModal from './CreateStaffModal';
interface IProps {
    fetchStaff?: () => void;
}
const CreateStaff = (props: IProps): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    {canPerformActions(ACTION_CREATE_USERS.name) && (
                        <button className="btn btn-danger float-right" onClick={() => setModalShow(true)}>
                            Create Staff
                        </button>
                    )}
                </Col>
            </Row>
            <CreateStaffModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
                fetchStaff={props.fetchStaff}
            />
        </>
    );
};

export default CreateStaff;
