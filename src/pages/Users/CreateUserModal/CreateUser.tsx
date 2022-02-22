import React from 'react';
import { Button } from 'react-bootstrap';
import CreateUserModal from './CreateUserModal';

interface IProps {
    fetchUsers: () => void;
}
const CreateUser = (props: IProps): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button variant="danger" className="float-right" onClick={() => setModalShow(true)}>
                Create User
            </Button>

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
