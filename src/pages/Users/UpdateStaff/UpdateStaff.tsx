import { MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { ACTION_CREATE_USERS } from '../../../authnz-library/authnz-actions';
import { canPerformActions } from '../../../services/ActionChecker';
import UpdateStaffModal from './UpdateStaffModal';

interface IProps {
    fetchStaff?: () => void;
    data: unknown;
}
const UpdateStaff = (props: IProps): JSX.Element => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            {canPerformActions(ACTION_CREATE_USERS.name) && (
                <Select>
                    <div className="" onClick={() => setModalShow(true)}>
                        <MenuItem value="Edit">Edit</MenuItem>
                    </div>
                    <div className="" onClick={() => console.log('deactivate users')}>
                        <MenuItem value="Deactivate">Deactivate</MenuItem>
                    </div>
                </Select>
            )}

            <UpdateStaffModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
                fetchStaff={props.fetchStaff}
                data={props.data}
            />
        </>
    );
};

export default UpdateStaff;
