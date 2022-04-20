/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Card, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Assign } from './Role/Assign';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

const AssignRole = (): JSX.Element => {
    const columns = [
        { title: 'id', field: 'id' },
        { title: 'AAD ALIAS', field: 'aadAlias' },
        { title: 'Actions', render: (row) => <Assign {...row}></Assign> }
    ];
    const [data, setData] = useState([]);

    //for error handling
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);

    useEffect(() => {
        authnzAxiosInstance
            .get('/users')
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.log('Error');
                alerts.showError(error.message);
            });
    }, []);

    return (
        <>
            <div>
                <Row className="align-items-center page-header">
                    <Col>
                        <Breadcrumb />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <div>
                                {iserror && (
                                    <Alert severity="error">
                                        {errorMessages.map((msg, i) => {
                                            return <div key={i}>{msg}</div>;
                                        })}
                                    </Alert>
                                )}
                            </div>
                            <TableWrapper title="Select User to assign role" columns={columns} data={data} options={{ pageSize: 50 }} />
                        </Card>
                    </Col>
                </Row>
                &nbsp;&nbsp;&nbsp;
            </div>
        </>
    );
};

export default AssignRole;
