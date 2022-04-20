/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();
const CampusDetails = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'id', hidden: true },
        { title: 'Campus name', field: 'name' },
        { title: 'Details', field: 'details' }
    ];
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);
    useEffect(() => {
        axios
            .get('/campuses')
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);

    return (
        <>
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
                        <TableWrapper options={{}} title="Campuses" columns={columns} data={data} editable={{}} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default CampusDetails;
