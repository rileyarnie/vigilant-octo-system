/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../../App/components/Breadcrumb';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { timetablingAxiosInstance } from '../../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();

const PublishedSemester = (): JSX.Element => {
    const columns = [
        { title: 'ID', render: (row) => row.id },
        { title: 'Semester name', field: 'name' },
        { title: 'Start Date', render: (row) => row.startDate.slice(0, 10) },
        { title: 'End Date', render: (row) => row.endDate.slice(0, 10) },
        {
            title: 'Action',
            field: 'internal_action',
            render: () => <Button variant="link">Register</Button>
        }
    ];
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [semesterId, setSemesterId] = useState('');
    const [errorMessages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    useEffect(() => {
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        timetablingAxiosInstance
            .get('/course-cohorts', { params: { semesterId: semesterId } })
            .then((res) => {
                setCourses(res.data);
                console.log(res.data);
            })
            .catch((error) => {
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
            <LinearProgress style={{ display: linearDisplay }} />
            <Row>
                <Col>
                    <Card>
                        <div>
                            {isError && (
                                <Alert severity="error">
                                    {errorMessages.map((msg, i) => {
                                        return <div key={i}>{msg}</div>;
                                    })}
                                </Alert>
                            )}
                        </div>
                        <TableWrapper
                            title="Semesters"
                            columns={columns}
                            data={data}
                            options={{ actionsColumnIndex: -1, pageSize: 50 }}
                            onRowClick={(event, row) => {
                                setSemesterId(row.id);
                            }}
                            detailPanel={[
                                {
                                    render: () => (
                                        <ol className="list-group">
                                            {Object.keys(courses).map((key) => (
                                                <li className="list-group-item" key={courses[key].cs_name}>
                                                    {courses[key].cs_name}
                                                </li>
                                            ))}
                                        </ol>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default PublishedSemester;
