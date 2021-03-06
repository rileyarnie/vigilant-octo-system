import React from 'react';
import { Button } from 'react-bootstrap';
import { ACTION_CREATE_USERS } from '../../../authnz-library/authnz-actions';
import { canPerformActions } from '../../../services/ActionChecker';
import CreateUserModal from './CreateUserModal';

interface IProps {
    fetchUsers: () => void;
}
const CreateUser = (props: IProps): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            {canPerformActions(ACTION_CREATE_USERS.name) && (
                <Button variant="danger" className="float-right" style={{ marginLeft: '1rem' }} onClick={() => setModalShow(true)}>
                    Create User
                </Button>
            )}
            <CreateUserModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
                fetchUsers={props.fetchUsers}
            />
        </>
    );
};

export default CreateUser;
