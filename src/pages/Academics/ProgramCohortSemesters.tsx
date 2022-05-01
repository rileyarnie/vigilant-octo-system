/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Card, Col, Row} from 'react-bootstrap';
import {LinearProgress} from '@mui/material';
import CourseCohort from '../services/CourseCohort';
import {CourseCohortService} from '../services/CourseCohortsService';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {simsAxiosInstance} from '../../utlis/interceptors/sims-interceptor';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1)
        },
        extendedIcon: {
            marginRight: theme.spacing(1)
        }
    })
);
function ProgramCohortSemesters(props: { history: { goBack: () => void } }) {
    const classes = useStyles();
    const columns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Name', field: 'name' },
        { title: 'Start Date', render: (rowData: { startDate: string | unknown[] }) => rowData?.startDate?.slice(0, 10) },
        { title: 'End Date', render: (rowData: { endDate: string | unknown[] }) => rowData?.endDate?.slice(0, 10) },
        {
            title: 'Transcripts',
            render: (rowData: { id: number }) => (
                <a
                    href="#"
                    onClick={(e) => {
                        fetchTranscript(parseInt(programCohortId), rowData?.id);
                        e.stopPropagation();
                    }}
                >
                    Download Transcript
                </a>
            )
        }
    ];
    const [errorMessages] = useState([]);
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const programCohortId = localStorage.getItem('programCohortId');
    const programCohortCode = localStorage.getItem('programCohortCode');
    const [data, setData] = useState([]);
    const [, setSemesterId] = useState();
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isError] = useState(false);
    useEffect(() => {
        setLinearDisplay('block');
        fetchProgramCohortSemester('semester', programCohortId);
    }, []);
    function fetchProgramCohortSemester(loadExtras: string, programCohortId: string) {
        CourseCohortService.fetchSemestersByProgramCohortId(loadExtras, programCohortId)
            .then((res) => {
                const ccData = res['data'];
                setLinearDisplay('none');
                const uniqueSemIds = ccData
                    .map((v: CourseCohort) => v.programCohortSemester?.semesterId)
                    .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);
                const semesterData = uniqueSemIds.map((semId: number) => {
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
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }

    function fetchTranscript(programCohortId: number, semesterId: number) {
        setLinearDisplay('block');
        simsAxiosInstance
            .get('/transcripts', {
                params: {
                    programCohortId: programCohortId,
                    semesterId: semesterId
                }
            })
            .then(() => {
                alerts.showSuccess('Downloading transcript');
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }
    const handleBack = () => {
        props.history.goBack();
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
                <div className="">
                    <IconButton aria-label="delete" className={classes.margin} onClick={handleBack} size="small">
                        <ArrowBackIcon fontSize="inherit" /> Back
                    </IconButton>
                </div>
            </Row>
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
                            title={`${programName} of ${anticipatedGraduation} semesters`}
                            columns={columns}
                            data={data}
                            onRowClick={(event: any, row) => {
                                console.log('semesterId called');
                                console.log(row);
                                if (event.target.innerHTML === 'Download Transcript') {
                                    setSemesterId(row.id);
                                    event.stopPropagation();
                                }
                                setSemesterId(row.id);
                                console.log(row.id);
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
                            options={{}}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default ProgramCohortSemesters;
