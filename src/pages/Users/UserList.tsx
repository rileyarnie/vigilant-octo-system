/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Card, Col, Row} from 'react-bootstrap';
import CreateUser from './CreateUserModal/CreateUser';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import {ACTION_ASSIGN_ROLES} from '../../authnz-library/authnz-actions';
import {authnzAxiosInstance} from '../../utlis/interceptors/authnz-interceptor';
import {canPerformActions} from '../../services/ActionChecker';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';

const alerts: Alerts = new ToastifyAlerts();

interface History {
    push: (path: string) => void;
}
interface IProps {
    history: History;
}

const UserList = (props: IProps): JSX.Element => {
    const [disabled, setDisabled] = useState(false);
    const [switchStatus,setSwitchStatus] = useState<boolean>();
    const [activationModal, setActivationModal] = useState(false);
    const [selectedRow,setselectedRow] = useState<{aadAlias:string,id:number}>();
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'AAD Alias', field: 'aadAlias' },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row) =>
                (
                    <>
                        <CustomSwitch
                            defaultChecked={row.activationStatus}
                            color="secondary"
                            inputProps={{'aria-label': 'controlled'}}
                            checked={row.activationStatus}
                            onChange={(event) => {
                                setselectedRow(row);
                                setSwitchStatus(event.target.checked); 
                                setActivationModal(true);
                                                               
                            }}
                        />
                        <ConfirmationModalWrapper
                            disabled={disabled}
                            submitButton
                            submitFunction={() => updateUser(selectedRow?.id,{activationStatus:switchStatus})}
                            closeModal={handleCloseModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                Are you sure you want to change the status of <>{selectedRow?.aadAlias}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
        }
    ];
    const [data, setData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCloseModal = () => {
        setActivationModal(false);
    };

    const fetchUsers = () => {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get('/users',{ params: { includeDeactivated: true }})
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };

    const updateUser = (userId, updates) => {
        setDisabled(true);
        setLinearDisplay('block');
        authnzAxiosInstance
            .put(`/users/${userId}`, {userUpdateRequest:updates})
            .then(() => {
                alerts.showSuccess('Successfully updated user');
                fetchUsers();                
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                
            })
            .finally(() => {
                setLinearDisplay('none');
                setActivationModal(false);
                setDisabled(false);
            });
    };
    const handleRouteChange = () => {
        props.history.push('assignrole');
    };

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <CreateUser fetchUsers={fetchUsers}></CreateUser>
                    {canPerformActions(ACTION_ASSIGN_ROLES.name) && (
                        <button className="btn btn-danger float-right" onClick={() => handleRouteChange()} style={{ marginLeft: '1.5rem' }}>
                            Assign Role
                        </button>
                    )}
                </Col>
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
            <Row>
                <Col>
                    <Card>
                        <TableWrapper columns={columns} title="users" data={data} options={{}} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default UserList;
