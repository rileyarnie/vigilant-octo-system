/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
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
import axios from 'axios';
import { Icons } from 'material-table';
import { Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Config from '../../config';
import { Link } from 'react-router-dom';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import { LinearProgress } from '@mui/material';
import CourseCohort from '../services/CourseCohort';
import { CourseCohortService } from '../services/CourseCohortsService';
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
function ProgramCohortSemesters() {
    const columns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Name', field: 'name' },
        { title: 'Start Date', render: (rowData) => rowData?.startDate?.slice(0, 10) },
        { title: 'End Date', render: (rowData) => rowData?.endDate?.slice(0, 10) },
        {title: 'Transcripts', render: (rowData) => (
            <a href='#'
                onClick={e => {fetchTranscript(parseInt(programCohortId)); e.stopPropagation()}}
            >
            Download Transcript
            </a>
        )}
    ];
    const [errorMessages] = useState([]);
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const programCohortId = localStorage.getItem('programCohortId');
    const programCohortCode = localStorage.getItem('programCohortCode');
    const [data, setData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isError] = useState(false);
    const simSrv = Config.baseUrl.simsSrv;
    useEffect(() => {
        fetchProgramCohortSemester('semester', programCohortId);
    }, []);
    function fetchProgramCohortSemester(loadExtras: string, programCohortId: string) {
        CourseCohortService.fetchSemestersByProgramCohortId(loadExtras, programCohortId)
            .then((res) => {
                const ccData = res['data'];
                //setData(ccData)
                setLinearDisplay('none');
                const uniqueSemIds = ccData
                    .map((v: CourseCohort) => v.programCohortSemester?.semesterId)
                    .filter((value, index, self) => self.indexOf(value) === index);
                const semesterData = uniqueSemIds.map((semId) => {
                    const cc = ccData.filter((v: CourseCohort) => v.programCohortSemester?.semester.id === semId)[0];
                    return {
                        id: cc.programCohortSemester?.semester.id,
                        name: cc.programCohortSemester?.semester.name,
                        startDate: cc.programCohortSemester?.semester.startDate,
                        endDate: cc.programCohortSemester?.semester.endDate,
                        programCohortId: cc.programCohortId,
                        programCohortSemesterId: cc.programCohortSemesterId
                    };
                });
                setData(semesterData);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }

    function fetchTranscript(programCohortId:number){
        axios.get(`${simSrv}/transcripts`, {
            params: {
                programCohortId:programCohortId
            }
        })
            .then(() => {
                alerts.showSuccess('Downloading transcript')
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }
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
                            title={`${programName} of ${anticipatedGraduation} semesters`}
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            onRowClick={(event:any, row) => {
                                if(event.target.innerHTML === 'Download Transcript'){
                                    event.stopPropagation();
                                }
                                window.location.href = '/pcsdetails';
                                localStorage.setItem('programName', programName);
                                localStorage.setItem('programCohortCode', programCohortCode);
                                localStorage.setItem('semesterId', row.id);
                                localStorage.setItem('programCohortSemesterId', row.programCohortSemesterId);
                                localStorage.setItem('semStartDate', row.startDate.slice(0, 10));
                                localStorage.setItem('semEndDate', row.endDate.slice(0, 10));
                                localStorage.setItem('programCohortId', row.programCohortId);
                                event.stopPropagation();
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default ProgramCohortSemesters;
