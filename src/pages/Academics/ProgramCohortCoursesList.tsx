/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {SelectGroup, ValidationForm} from 'react-bootstrap4-form-validation';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1)
        },
        extendedIcon: {
            marginRight: theme.spacing(1)
        },
        root: {
            width: '100%'
        }
    })
);
const CourseCohortsList = (props): JSX.Element => {
    const classes = useStyles();

    interface semester {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
    }

    interface course {
        id: number;
        name: string;
    }

    interface CourseCohort {
        id: number;
        course: course;
        semesterId: number;
        programCohortId: number;
        published: boolean;
        programCohort?: { activationStatus: boolean};
        programCohortSemester?: { semester: semester; id: number, semesterId: number };
    }

    const [selectedRow, setSelectedRow] = useState<CourseCohort>();
    const columns = [
        {title: 'Course cohort ID', field: 'id', hidden: false},
        {title: 'Course code', field: 'course.codePrefix'},
        {title: 'Course Name', field: 'course.name'},
        {title: 'Semester Name', field: 'programCohortSemester.semester.name'},
        {title: 'Start date', render: (rowData) => rowData?.programCohortSemester?.semester?.startDate?.slice(0, 10)},
        {title: 'End date', render: (rowData) => rowData?.programCohortSemester?.semester?.endDate?.slice(0, 10)},
        {
            title: 'Action',
            field: 'internal_action',
            render: (row) => (
                <>
                    {(row.programCohort && (row.programCohort.activationStatus === false)) ? (
                        <>
                            Needs activation
                        </>):(
                        <>
                            {(row.programCohortSemester && (row.programCohortSemester.status).toUpperCase() === 'PUBLISHED') ? (
                                <>
                                Can&apos;t update a published Cohort Semester
                                </>) : (
                                <>
                                    <button
                                        className="btn btn btn-link"
                                        onClick={() => {
                                            handleShow();
                                            setSelectedRow(row);
                                        }}
                                    >
                                        {row.programCohortSemester ? (
                                            <>
                                            Change Semester
                                                <AssignmentTurnedIn fontSize="inherit"
                                                    style={{fontSize: '20px', color: 'black'}}/>
                                            </>) : (
                                            <>
                                            Assign Semester
                                                <AssignmentTurnedIn fontSize="inherit"
                                                    style={{fontSize: '20px', color: 'black'}}/>
                                            </>)
                                        }
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </>
            )
        }
    ];
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [show, setShow] = useState(false);
    const [semester, setSemester] = useState([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState(0);
    const [errorMessages] = useState([]);
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    // const progId = parseInt(localStorage.getItem('programId'));
    const programCohortId = localStorage.getItem('programCohortId');
    const [linearDisplay, setLinearDisplay] = useState('none');
    useEffect(() => {
        setLinearDisplay('block');
        fetchCourseCohortsByProgramCohortId();
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
                setSemester(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);

    function fetchCourseCohortsByProgramCohortId() {
        timetablingAxiosInstance
            .get('/course-cohorts', {
                params: {
                    programCohortId: programCohortId,
                    loadExtras: 'course,semester'
                }
            })
            .then((res) => {
                const ccData = res.data;
                setData(ccData);
                setLinearDisplay('none');
            });
    }

    // const fetchCoursesAssignedToProgram = (progId: number): void => {
    //     setLinearDisplay('block');
    //     timetablingAxiosInstance
    //         .get(`/programs/${progId}courses`)
    //         .then((res) => {
    //             setLinearDisplay('none');
    //             setData(res.data);
    //         })
    //         .catch((error) => {
    //             alerts.showError(error.message);
    //         });
    // };
    const handleAssignSemesterSubmit = () => {
        event.preventDefault();
        setLinearDisplay('block');
        timetablingAxiosInstance
            .patch(`/course-cohorts/${selectedRow.id}`, {
                semesterId: selectedSemesterId,
                programCohortId: selectedRow.programCohortId,
                isActive: true
            })
            .then(() => {
                alerts.showSuccess('Successfully updated course cohort');
                fetchCourseCohortsByProgramCohortId();
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    };

    // const unassignSelectedCourseFromProgram = (selectedCourseId: number): void => {
    //     setLinearDisplay('block');
    //     timetablingAxiosInstance
    //         .put(`/programs/${progId}/courses/${selectedCourseId}`)
    //         .then(() => {
    //             alerts.showSuccess('Successfully removed course');
    //             fetchCoursesAssignedToProgram(progId);
    //             setLinearDisplay('none');
    //         })
    //         .catch((error) => {
    //             alerts.showError(error.message);
    //             setLinearDisplay('none');
    //         });
    // };
    //TODO - confirm unsassigning course cohort calls the correct endpoint
    const resetStateCloseModal = (): void => {
        setShow(false);
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleBack = () => {
        props.history.goBack();
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb/>
                </Col>
            </Row>
            <LinearProgress style={{display: linearDisplay}}/>
            <Row>
                <div className="">
                    <IconButton aria-label="delete" className={classes.margin} onClick={handleBack} size="small">
                        <ArrowBackIcon fontSize="inherit"/> Back
                    </IconButton>
                </div>
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
                        <TableWrapper
                            title={`${programName} of ${anticipatedGraduation} courses`}
                            columns={columns}
                            data={data}
                            // actions={[
                            //     (rowData) => ({
                            //         icon: DeleteIcon,
                            //         tooltip: 'Delete Course',
                            //         onClick: () => {
                            //             unassignSelectedCourseFromProgram(rowData.id);
                            //         }
                            //     })
                            // ]}
                            options={{}}
                        />
                    </Card>
                </Col>
            </Row>
            <ModalWrapper
                show={show}
                closeModal={handleClose}
                title={selectedRow?.programCohortSemester?.semester ? 'Change semester' : 'Assign a semester'}
                noFooter
            >
                <ValidationForm onSubmit={handleAssignSemesterSubmit}>
                    <SelectGroup
                        name="c"
                        id="color"
                        required
                        defaultValue={selectedRow?.programCohortSemester?.semesterId}
                        onChange={(e) => {
                            setSelectedSemesterId(e.target.value);
                        }}
                    >
                        <option value="">-- select a semester --</option>
                        {semester.map((sem) => {
                            return (
                                <option key={sem.name} defaultValue={selectedSemesterId} value={sem.id}>
                                    {sem.name}
                                </option>
                            );
                        })}
                    </SelectGroup>
                    <div className="mt-2" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button className="btn btn-danger " onClick={handleClose}>
                    Close
                        </Button>
                        <Button className="btn btn-info" type='submit'>
                    Submit
                        </Button>
                    </div>
                </ValidationForm>
            </ModalWrapper>
        </>
    );
};

export default CourseCohortsList;
