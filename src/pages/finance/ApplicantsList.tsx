/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
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
import { Select, MenuItem } from '@material-ui/core';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { Icons } from 'material-table';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';

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
const StudentFeesManagement = (): JSX.Element => {
    const simsSrv = Config.baseUrl.simsSrv;
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
    const [isAdmitted, setIsAdmitted] = useState('PENDING');
    const [selectedRow] = useState(null);

    useEffect(() => {
        fetchProgramCohortApplications();
    }, [isAdmitted]);

    const fetchProgramCohortApplications = () => {
        axios
            .get(`${simsSrv}/program-cohort-applications`, { params: { status: isAdmitted } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
                console.log(res.data)
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
                            title="Applications"
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            onRowClick={(event, row) => {
                                window.location.href = `/studentfeesreport?studentId=${row.applications_studentId}`;
                                event.stopPropagation();
                            }}
                            options={{
                                rowStyle: (rowData) => ({
                                    backgroundColor: selectedRow === rowData.tableData.id ? '#EEE' : '#FFF'
                                })
                            }}
                            components={{
                                Toolbar: (props) => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{ padding: '0px 10px' }}>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                style={{ width: 150 }}
                                                value={isAdmitted}
                                                onChange={(e) => setIsAdmitted(e.target.value as string)}
                                            >
                                                <MenuItem value={'ADMITTED'}>Admitted</MenuItem>
                                                <MenuItem value={'PENDING'}>Pending</MenuItem>
                                                <MenuItem value={'REJECTED'}>Rejected</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default StudentFeesManagement;
