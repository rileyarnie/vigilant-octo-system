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
import { Link } from 'react-router-dom';
import { MenuItem, Select} from '@material-ui/core';
import ChangeExamCutOffModal from './ChangeExamCutOffModal';
import CustomSwitch from '../../assets/switch/CustomSwitch';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

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
    const [selectedRow,setselectedRow] = useState<{id:number, programCohortSemesterId:number, programCohortSemester:{id:number}}>();
    const [disabled, setDisabled] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const [switchStatus,setSwitchStatus] = useState<boolean>();
    const [showCutOffModal, setShowCutOffModal] = useState<boolean>();
    function handleCloseActivationModal () {
        setActivationModal(false);
    }
    const [programCohortSemesterId, setProgramCohortSemesterId] = useState(0);

    
    async function updatePCS(pcsId: number, updates:unknown){
        setDisabled(true);
        try {
            try {
                await simsAxiosInstance
                    .put(`/program-cohort-semesters/${pcsId}/activation`, updates);
                alerts.showSuccess('Successfully updated course cohort');
                fetchProgramCohortSemester('semester', programCohortId);
                setLinearDisplay('none');
            } catch (error) {
                alerts.showError((error as Error).message);
            }
        } finally {
            setDisabled(false);
            setActivationModal(false);
        }
    }
    const classes = useStyles();
    const columns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Name', field: 'name' },
        { title: 'Start Date', render: (rowData: { startDate: string | unknown[] }) => rowData?.startDate?.slice(0, 10) },
        { title: 'End Date', render: (rowData: { endDate: string | unknown[] }) => rowData?.endDate?.slice(0, 10) },

        {
            title: 'Action',
            render: (row) => (
                <Select>
                    <Link
                        onClick={() => {
                            setSemesterId(row.id);
                            localStorage.setItem('programName', programName);
                            localStorage.setItem('programCohortCode', programCohortCode);
                            localStorage.setItem('semesterId', row.id);
                            localStorage.setItem('programCohortSemesterId', row.programCohortSemesterId);
                            localStorage.setItem('semStartDate', row.startDate.slice(0, 10));
                            localStorage.setItem('semEndDate', row.endDate.slice(0, 10));
                            localStorage.setItem('programCohortId', row.programCohortId);
                        }}
                        to={'/pcsdetails'}
                    >
                        <MenuItem value="view details">View Details</MenuItem>
                    </Link>
                    <a className="btn btn btn-link"
                        onClick={() => {
                            fetchTranscript(parseInt(programCohortId), row.id);
                        }}>
                        <MenuItem value="download">Download Transcript</MenuItem>
                    </a>
                    <br></br>
                    <a className="btn btn btn-link"
                        onClick={() => {
                            setselectedRow(row);
                            setProgramCohortSemesterId(row.programCohortSemesterId);
                            setShowCutOffModal(true);
                        }}>
                        <MenuItem value="download">Change Exam Cut Off Date</MenuItem>
                    </a>
                </Select>
            )
        },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row) =>
                (
                    <>
                        <CustomSwitch
                            defaultChecked={row.activationStatus}
                            color="secondary"
                            inputProps={{'aria-label': 'controlled'}}
                            checked={row.activationStatus}
                            onChange={(event) => {
                                setselectedRow(row);
                                setActivationModal(true);
                                setSwitchStatus(event.target.checked);
                                
                            }}
                        />
                        <ConfirmationModalWrapper
                            disabled={disabled}
                            submitButton
                            submitFunction={() => updatePCS(selectedRow?.id,{activationStatus:switchStatus})}
                            closeModal={handleCloseActivationModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                Are you sure you want to change the status of Program Cohort Semester Id: <>{selectedRow?.id}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
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
                    .map((v: CourseCohort) => v?.programCohortSemester?.semesterId)
                    .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);
                const semesterData = uniqueSemIds.map((semId: number) => {
                    const cc = ccData.filter((v: CourseCohort) => v?.programCohortSemester?.semester?.id === semId)[0];
                    return {
                        id: cc?.programCohortSemester?.semester.id,
                        name: cc?.programCohortSemester?.semester.name,
                        startDate: cc?.programCohortSemester?.semester.startDate,
                        endDate: cc?.programCohortSemester?.semester.endDate,
                        programCohortId: cc?.programCohortId,
                        programCohortSemesterId: cc?.programCohortSemesterId,
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
                            options={{}}
                        />
                    </Card>
                </Col>
            </Row>

            <ChangeExamCutOffModal 
                programCohortSemesterId={programCohortSemesterId}
                showCutOffModal={showCutOffModal}         
                setShowModal = {setShowCutOffModal}    
                modalTitle= {`Change ${programName} of ${anticipatedGraduation} semester Exam Cut Off Date`}
            >                
            </ChangeExamCutOffModal>
        </>
    );
}
export default ProgramCohortSemesters;
