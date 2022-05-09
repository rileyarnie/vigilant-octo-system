import {MenuItem, Select} from '@material-ui/core';
import React from 'react';
import {ACTION_CREATE_USERS} from '../../../authnz-library/authnz-actions';
import {canPerformActions} from '../../../services/ActionChecker';
import UpdateStaffModal from './UpdateStaffModal';

interface IProps {
    fetchStaff?: () => void;
    fetchUsers?: () => void;
    users: never[];
    data: Record<string, unknown>;
}
const UpdateStaff = (props: IProps): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    const activationStatus = props.data?.activation_status ? 'Deactivate' : 'Activate';
    return (
        <>
            {canPerformActions(ACTION_CREATE_USERS.name) && (
                <Select>
                    <div className="" onClick={() => {
                        props.fetchUsers();
                        setModalShow(true);
                    }
                    }>
                        <MenuItem value="Edit">Edit</MenuItem>
                    </div>
                    <div className="" onClick={() => console.log('deactivate users')}>
                        <MenuItem value={activationStatus}>{activationStatus}</MenuItem>
                    </div>
                </Select>
            )}

            <UpdateStaffModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
                fetchStaff={props.fetchStaff}
                users={props.users}
                data={props.data}
            />
        </>
    );
};

export default UpdateStaff;
