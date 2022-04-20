/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_GET_PROGRAM_COHORT_APPLICATIONS } from '../../authnz-library/sim-actions';
import { simsAxiosInstance } from '../../utlis/interceptors/sims-interceptor';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

const StudentFeesManagement = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'applications_id' },
        { title: 'Name', render: (rowData) => rowData.applications_firstName + ' ' + rowData.applications_lastName },
        { title: 'Email', field: 'applications_emailAddress' },
        { title: 'Program', field: 'applications_programCohortId' },
        { title: 'Admission Status', field: 'applications_status' }
    ];
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isAdmitted] = useState('PENDING');
    const [selectedRow] = useState(null);

    useEffect(() => {
        fetchProgramCohortApplications();
    }, [isAdmitted]);

    const fetchProgramCohortApplications = () => {
        simsAxiosInstance
            .get('/program-cohort-applications', { params: { status: 'ADMITTED' } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_PROGRAM_COHORT_APPLICATIONS.name) && (
                <>
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
                                    title="Applications"
                                    columns={columns}
                                    data={data}
                                    onRowClick={(event, row) => {
                                        window.location.href = `/studentfeesreport?studentId=${row.applications_studentId}&studentName=${
                                            row.applications_firstName + ' ' + row.applications_lastName
                                        }`;
                                        event.stopPropagation();
                                    }}
                                    options={{
                                        rowStyle: (rowData) => ({
                                            backgroundColor: selectedRow === rowData.tableData.id ? '#EEE' : '#FFF'
                                        }),
                                        pageSize: 50
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};
export default StudentFeesManagement;
