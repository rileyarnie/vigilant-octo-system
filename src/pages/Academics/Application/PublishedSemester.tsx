/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { LinearProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../../App/components/Breadcrumb';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Icons } from 'material-table';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { timetablingAxiosInstance } from '../../../utlis/interceptors/timetabling-interceptor';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
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
                        <MaterialTable
                            title="Semesters"
                            columns={columns}
                            data={data}
                            options={{ actionsColumnIndex: -1, pageSize: 50 }}
                            icons={tableIcons}
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
