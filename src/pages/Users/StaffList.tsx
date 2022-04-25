/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_GET_USERS } from '../../authnz-library/authnz-actions';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();
import CreateStaff from './CreateStaff/CreateStaff';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import UpdateStaff from './UpdateStaff/UpdateStaff';

const StaffList = (): JSX.Element => {
    const columns = [
        { title: 'SN', field: 'id' },
        { title: 'Name', field: 'name' },
        { title: 'User', field: 'email' },
        {
            title: 'Actions',
            render: (row) => <UpdateStaff fetchStaff={fetchStaff} data={row} />
        }
    ];
    const [data, setData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/staff')
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                //handle error using logging library
                console.log('Error', error.message);
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
