/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from 'react';
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
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import { Icons } from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import Config from '../../config';
import SelectCurrency from 'react-select-currency';
import { DeactivateCourseCohort } from './DeactivateCourseCohort';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { financeAxiosInstance } from '../../utlis/interceptors/finance-interceptor';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
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
        programCohortSemester?: { semester: semester; id: number };
    }

    const [selectedRow, setSelectedRow] = useState<CourseCohort>();
    const columns = [
        { title: 'Course cohort ID', field: 'id', hidden: false },
        { title: 'Course code', field: 'course.codePrefix' },
        { title: 'Course Name', field: 'course.name' },
        { title: 'Semester id', field: 'programCohortSemester.semesterId' },
        { title: 'Start date', render: (rowData) => rowData?.programCohortSemester?.semester?.startDate?.slice(0, 10) },
        { title: 'End date', render: (rowData) => rowData?.programCohortSemester?.semester?.endDate?.slice(0, 10) },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row) => <DeactivateCourseCohort programName={programName} selectedRow={row} />
        },
        {
            title: 'Action',
            field: 'internal_action',
            render: (row) => (
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
                            <AssignmentTurnedIn fontSize="inherit" style={{ fontSize: '20px', color: 'black' }} />
                        </>
                    ) : (
                        <>
                            Assign Semester
                            <AssignmentTurnedIn fontSize="inherit" style={{ fontSize: '20px', color: 'black' }} />
                        </>
                    )}
                </button>
            )
        }
    ];
    const [data, setData] = useState([]);
    const [programId, setProgramId] = useState();
    const [courseName, setCourseName] = useState('');
    const [courseId] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [iserror] = useState(false);
    const [show, setShow] = useState(false);
    const [semester, setSemester] = useState([]);
    const [semesterId, setSemesterId] = useState(0);
    const [selectedSemesterId, setSelectedSemesterId] = useState(0);
    const [, setDisabled] = useState(false);
    const [, setSelectedRows] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const progId = parseInt(localStorage.getItem('programId'));
    const programCohortCode = localStorage.getItem('program_cohort_code');
    const [showPublishModal, setShowPublish] = useState(false);
    const [showDialog, setDialog] = useState(false);
    const [narrative, setNarrative] = useState('');
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('KES');
    const programCohortId = localStorage.getItem('programCohortId');
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [valObj, setValObj] = useState({});
    let programCohortSemesterId: number;
    useEffect(() => {
        setLinearDisplay('block');
        console.log(programCohortId);
        fetchCourseCohortsByProgramCohortId();
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
                setSemester(res.data);
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    }, []);
    function fetchCourseCohortsByProgramCohortId() {
        timetablingAxiosInstance
            .get('/course-cohorts', { params: { programCohortId: programCohortId, loadExtras: 'course,semester' } })
            .then((res) => {
                const ccData = res.data;
                console.log(ccData);
                setData(ccData);
                setLinearDisplay('none');
            });
    }
    const fetchCoursesAssignedToProgram = (progId: number): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get(`/programs/${progId}courses`)
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const fetchSemesters = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
                setLinearDisplay('none');
                console.log(res.data);
                setSemesters(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const publishSemesterAndFeeItems = async (e) => {
        e.preventDefault();
        console.log('publish semester');
        await handleFeeItemsPost();
        toggleDialog();
        togglePublishModal();
    };

    const handleAssignSemesterSubmit = (e) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .patch(`/course-cohorts/${selectedRow.id}`, {
                semesterId: selectedSemesterId,
                programCohortId: selectedRow.programCohortId,
                isActive: true
            })
            .then((res) => {
                alerts.showSuccess('Succesfully updated course cohort');
                setLinearDisplay('none');
                fetchCourseCohortsByProgramCohortId();
                resetStateCloseModal();
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    };
    const unassignSelectedCourseFromProgram = (selectedCourseId: number): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/programs/${programId}/courses/${selectedCourseId}`)
            .then((res) => {
                setLinearDisplay('none');
                alerts.showSuccess('Succesfully removed course');
                fetchCoursesAssignedToProgram(progId);
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    };
    const handleSemesterUpdate = () => {
        const courseSemester = {
            ModifyProgramCohortSemesterRequest: {
                semesterId: semesterId
            }
        };
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/program-cohort-semesters/${selectedRow.programCohortSemester.id}`, courseSemester)
            .then(() => {
                alerts.showSuccess('Successfully changed semester');
                setLinearDisplay('none');
                fetchCoursesAssignedToProgram(progId);
                resetStateCloseModal();
                setDisabled(false);
            })
            .catch((error) => {
                alerts.showError(error.message);
                console.log(error);
            });
    };

    const handleFeeItemsPost = async () => {
        financeAxiosInstance
            .post('/',{
                createFeeItemRequest: {
                    narrative: narrative,
                    amount: amount,
                    currency: currency,
                    programCohortSemesterId: programCohortSemesterId
                }
            })
            .then(() => {
                alerts.showSuccess('Successfully posted fee items');
            })
            .catch((error) => {
                alerts.showError(error.message);
                console.log(error);
            });
    };

    const resetStateCloseModal = (): void => {
        setSemesterId(null);
        setShow(false);
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const togglePublishModal = () => {
        showPublishModal ? setShowPublish(false) : setShowPublish(true);
    };
    const toggleDialog = () => {
        showDialog ? setDialog(false) : setDialog(true);
    };
    const handleBack = () => {
        props.history.goBack();
    };
    const onSelectedCurrency = (currencyAbbrev) => {
        setCurrency(currencyAbbrev);
    };

    const handleNarrativeChange = (event) => {
        setNarrative(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const selectStyle = {
        width: '100%',
        height: '30px'
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
                            {iserror && (
                                <Alert severity="error">
                                    {errorMessages.map((msg, i) => {
                                        return <div key={i}>{msg}</div>;
                                    })}
                                </Alert>
                            )}
                        </div>
                        <MaterialTable
                            title={`${programName} of ${anticipatedGraduation} courses`}
                            columns={columns}
                            data={data}
                            actions={[
                                (rowData) => ({
                                    icon: DeleteIcon,
                                    tooltip: 'Delete Course',
                                    onClick: () => {
                                        unassignSelectedCourseFromProgram(rowData.id);
                                    }
                                })
                            ]}
                            options={{ pageSize: 50 }}
                            icons={tableIcons}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                show={showDialog}
                onHide={toggleDialog}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm publish</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Publishing a semester for {programCohortCode} will disable you from adding semesters to this semester for the
                            course, continue?
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e) => publishSemesterAndFeeItems(e)}>
                            Continue to publish
                        </Button>
                        <Button variant="primary" onClick={() => toggleDialog()}>
                            Continue editing
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
            <Modal
                show={showPublishModal}
                onHide={togglePublishModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Publish {programName} {programCohortCode}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="startDate">
                                <b>Anticipated Start Date</b>
                            </label>
                            <br />
                            <TextInput name="startDate" id="startDate" type="date" required />
                            <br />
                            <label htmlFor="Date">
                                <b>Number of slots</b>
                            </label>
                            <br />
                            <TextInput
                                name="numSlots"
                                id="numSlots"
                                type="text"
                                placeholder="number of slots"
                                required
                                onChange={(e) => {
                                    console.log(e.target.value);
                                }}
                            />
                            <br />
                            <label htmlFor="semester">
                                <b>Semester</b>
                            </label>
                            <br />
                            <SelectGroup
                                name="semester"
                                id="semester"
                                required
                                errorMessage="Please select semester"
                                onChange={(e) => setSelectedSemesterId(e.target.value)}
                                defaultValue={''}
                            >
                                {semesters.map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.name}
                                    </option>
                                ))}
                            </SelectGroup>
                            <hr />
                            <label htmlFor="narrative">
                                <b>Narrative</b>
                            </label>
                            <br />
                            <TextInput
                                name="narrative"
                                id="narrative"
                                type="text"
                                value={narrative}
                                onChange={handleNarrativeChange}
                                required
                            />
                            <br />

                            <label htmlFor="amount">
                                <b>Amount</b>
                            </label>
                            <br />
                            <TextInput name="amount" id="amount" type="number" value={amount} onChange={handleAmountChange} required />
                            <br />

                            <label htmlFor="currency">
                                <b>Currency</b>
                            </label>
                            <br />
                            <SelectCurrency style={selectStyle} name="currency" value={currency} onChange={onSelectedCurrency} />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-info float-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDialog();
                                }}
                            >
                                Publish
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-right" onClick={togglePublishModal}>
                        Close
                    </button>
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {' '}
                        {selectedRow?.programCohortSemester?.semester ? 'Change semester' : 'Assign a semester'}{' '}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <SelectGroup
                            name="c"
                            id="color"
                            required
                            onChange={(e) => {
                                setSemesterId(e.target.value);
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
                        <br></br>
                        {selectedRow?.programCohortSemester?.semester ? (
                            <Button className="btn btn-info float-right" onClick={(e) => handleSemesterUpdate()}>
                                Submit
                            </Button>
                        ) : (
                            <Button className="btn btn-info float-right" onClick={(e) => handleAssignSemesterSubmit(e)}>
                                Submit
                            </Button>
                        )}

                        <Button className="btn btn-danger float-left" onClick={handleClose}>
                            Close
                        </Button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CourseCohortsList;
