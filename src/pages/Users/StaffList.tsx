/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Card, Col, Row} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_GET_USERS} from '../../authnz-library/authnz-actions';
import TableWrapper from '../../utlis/TableWrapper';
import CreateStaff from './CreateStaff/CreateStaff';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import UpdateStaff from './UpdateStaff/UpdateStaff';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import CustomSwitch from '../../assets/switch/CustomSwitch';

const alerts: Alerts = new ToastifyAlerts();

const StaffList = (): JSX.Element => {
    const [disabled, setDisabled] = useState(false);
    const [switchStatus,setSwitchStatus] = useState<boolean>();
    const [activationModal, setActivationModal] = useState(false);
    const handleCloseActivationModal = () => {
        setActivationModal(false);
    };

    const updateStaff = (staffId,updates) => {
        setDisabled(true);
        timetablingAxiosInstance
            .put(`/staff/${staffId}`, updates)
            .then(() => {
                alerts.showSuccess('successfully updated staff');
                fetchStaff();
            })
            .catch((err) => console.log('err', err))
            .finally(() => {
                setDisabled(false);
            });
    };
    const columns = [
        { title: 'SN', field: 'id' },
        { title: 'Name', field: 'name' },
        { title: 'User', field: 'email' },
        {
            title: 'Actions',
            render: (row) => <UpdateStaff fetchStaff={fetchStaff} data={row} fetchUsers={fetchUsers} users={users} />
        },
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
                                setActivationModal(true);
                                setSwitchStatus(event.target.checked);
                                
                            }}
                        />
                        <ConfirmationModalWrapper
                            disabled={disabled}
                            submitButton
                            submitFunction={() => updateStaff(row.id,{activationStatus:switchStatus})}
                            closeModal={handleCloseActivationModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                Are you sure you want to change the status of <>{row.name}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
           
        }
    ];
    const [data, setData] = useState([]);
    const [users,setUsers] = useState<never[]>();
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchStaff();
    }, []);
    const fetchUsers = () => {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get('/users')
            .then((res) => {
                setUsers(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    };
    const fetchStaff = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/staff', { params: { includeDeactivated: true }})
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <CreateStaff fetchStaff={fetchStaff} />
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
            {canPerformActions(ACTION_GET_USERS.name) && (
                <Row>
                    <Col>
                        <Card>
                            <TableWrapper columns={columns} title="Staff" data={data} options={{}} />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};
export default StaffList;
