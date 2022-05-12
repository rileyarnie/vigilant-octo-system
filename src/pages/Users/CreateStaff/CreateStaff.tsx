import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ACTION_CREATE_USERS } from '../../../authnz-library/authnz-actions';
import { canPerformActions } from '../../../services/ActionChecker';
// import CreateStaffModal from './CreateStaffModal';
interface IProps {
    fetchStaff?: () => void;
    openCreateStaffModal: () => void;
}
const CreateStaff = (props: IProps): JSX.Element => {
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    {canPerformActions(ACTION_CREATE_USERS.name) && (
                        <button className="btn btn-danger float-right" onClick={props.openCreateStaffModal}>
                            Create Staff
                        </button>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default CreateStaff;
