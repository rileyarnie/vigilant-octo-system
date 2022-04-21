/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_ASSIGN_ROLES, ACTION_GET_USERS } from '../../authnz-library/authnz-actions';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();
import { Select, MenuItem } from '@material-ui/core';

interface History {
    push: (path: string) => void;
}
interface IProps {
    history: History;
}

const StaffList = (props: IProps): JSX.Element => {
    const columns = [
        { title: 'SN', field: 'id' },
        { title: 'Name', field: 'isStaff' },
        { title: 'User', field: 'aadAlias' },
        {
            title: 'Actions',
            render: (row) => (
                <div style={{ padding: '0px 5px' }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        style={{ width: 150 }}
                        value={isActivated}
                        onChange={(e) => setIsActivated(e.target.value as string)}
                    >
                        {console.log(row)}
                        <MenuItem value={'ACTIVATE'}>Edit</MenuItem>
                        <MenuItem value={'DEACTIVATE'}>Deactivate</MenuItem>
                    </Select>
                </div>
            )
        }
    ];
    const [data, setData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isActivated, setIsActivated] = useState('ACTIVATE');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get('/users')
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
    const handleRouteChange = () => {
        // create staff logic here
        console.log('create staff function');
    };

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>

                {canPerformActions(ACTION_ASSIGN_ROLES.name) && (
                    <Button variant="danger" onClick={() => handleRouteChange()}>
                        Create Staff
                    </Button>
                )}
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
            {canPerformActions(ACTION_GET_USERS.name) && (
                <Row>
                    <Col>
                        <Card>
                            <TableWrapper
                                columns={columns}
                                title="users"
                                data={data}
                                options={{}}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};
export default StaffList;
