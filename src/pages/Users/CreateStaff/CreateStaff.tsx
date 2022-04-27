import React from 'react';
import { Button } from 'react-bootstrap';
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
            {canPerformActions(ACTION_CREATE_USERS.name) && (
                <Button variant="danger" className="float-right" onClick={() => setModalShow(true)}>
                    Create Staff
                </Button>
            )}

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
