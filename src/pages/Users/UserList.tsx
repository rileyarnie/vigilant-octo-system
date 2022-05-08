/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Card, Col, Row} from 'react-bootstrap';
import CreateUser from './CreateUserModal/CreateUser';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_ASSIGN_ROLES, ACTION_GET_USERS} from '../../authnz-library/authnz-actions';
import {authnzAxiosInstance} from '../../utlis/interceptors/authnz-interceptor';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

interface History {
    push: (path: string) => void;
}
interface IProps {
    history: History;
}

const UserList = (props: IProps): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'AAD Alias', field: 'aadAlias' }
    ];
    const [data, setData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchUsers();
    }, []);

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
            {canPerformActions(ACTION_GET_USERS.name) && (
                <Row>
                    <Col>
                        <Card>
                            <TableWrapper columns={columns} title="users" data={data} options={{}} />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};
export default UserList;
