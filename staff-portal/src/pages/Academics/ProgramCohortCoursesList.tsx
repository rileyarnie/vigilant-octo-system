/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState, useEffect,forwardRef } from 'react';
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
import {ValidationForm,SelectGroup,TextInput} from 'react-bootstrap4-form-validation';
import { Row, Col, Card, Modal, ProgressBar, Button } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import Config from '../../config';
import { makeStyles } from '@material-ui/core';
import SelectCurrency from 'react-select-currency';

import { DeactivateCourseCohort } from './DeactivateCourseCohort';
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
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
const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});
function ProgramCohortCoursesList() {
    const classes = useStyles();
    interface programCohortCourse{
        program_cohort_Id:number,
        id: number;
        published:boolean,
        activation_status:boolean,
        semester_id:number,
        courseName:string, 
        programName:string, 
        semesterName: string,
    }
    const columns = [
        { title: 'Course cohort code', field: 'courseCohortCode', hidden: false },
        { title: 'Course code', field: 'code' },
        { title: 'Name', field: 'name' },
        { title: 'Semester name', field: 'semName' },
        { title: 'Start date', field: 'startDate' },
        { title: 'End date', field: 'endDate' },
        {
            title: 'Publish',
            field: 'internal_action',
            render: (row:programCohortCourse) => (
                <Button variant="danger" onClick={() => togglePublishModal()}>
                                        Publish Semester
                </Button>
            )
        },
        { title: 'Action', field: 'action' },
        {
            title:'Activation Status',
            field:'internal_action',
            render:(row)=>(
                <DeactivateCourseCohort selectedRow={row}/>
            )
        },
        {
            title: 'Action',
            field: 'internal_action',
            render: (row:programCohortCourse) => (
                <button className="btn btn btn-link" onClick={handleShow}>
                    {row.semester_id ? <>Change Semester<AssignmentTurnedIn fontSize="inherit" style={{ fontSize: '20px', color: 'black' }} /></> : <>Assign Semester<AssignmentTurnedIn fontSize="inherit" style={{ fontSize: '20px', color: 'black' }} /></>}
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
    const [semester,setSemester]=useState([]);
    const [semesterId, setSemesterId] = useState('');
    const [selectedSemesterId, setSelectedSemesterId] = useState('');
    const [,setDisabled]=useState(false);
    const [progressBar, setProgress] = useState(0);
    const [loadingBar, setLoadingBar] = useState('block');
    const [, setSelectedRows] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const financeSrv = Config.baseUrl.financeSrv;
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const progId = JSON.parse(localStorage.getItem('programId'));
    const programCohortCode = localStorage.getItem('program_cohort_code');
    const [showPublishModal, setShowPublish] = useState(false);
    const [showDialog, setDialog] = useState(false);
    const [selectedSemester, setSelectedemester] = useState('Please select semester');
    const [narrative, setNarrative] = useState('');
    const [amount, setAmount] = useState(0);
    const [currency,setCurrency] = useState('KES');
    let programCohortSemesterId:number;
    useEffect(() => {
        axios.get(`${timetablingSrv}/programs/courses/${progId}`)
            .then(res => {
                setData(res.data);
                setProgramId(progId);
                setLoadingBar('none');
            })
            .catch((err) => {
                setErrorMessages(['Failed to fetch courses']);
                console.log(err);
            });
        axios.get(`${timetablingSrv}/semesters`)
            .then(res => {
                setSemester(res.data);
            })
            .catch((err) => {
                alert(err.message);
                console.log(err);
            });
        fetchSemesters();
    }, []);

    const fetchCoursesAssignedToProgram = (progId: number): void => {
        setLoadingBar('block');
        axios.get(`${timetablingSrv}/programs/courses/${progId}`)
            .then(res => {
                setLoadingBar('none');
                setData(res.data);
            })
            .catch((error) => {
                setErrorMessages([error]);
                console.error(error);
            });
    };

    const fetchSemesters = () => {
        setLoadingBar('block');
        axios.get(`${timetablingSrv}/semesters`)
            .then(res => {
                setData(res.data);
                setLoadingBar('none');
                console.log(res.data);
                setSemesters(res.data);
            })
            .catch((error) => {
                console.error(error);
                alert(error.message);
            });
    };

    const publishSemesterAndFeeItems = async () => {
        console.log('publish semester');
        await handleFeeItemsPost();
        toggleDialog();
        togglePublishModal();
    };

    const assignSemester = (e) => {
        e.preventDefault();
        const courseCohort = {
            'program-cohort-semester': {
                program_cohort_Id: progId,
                published:true,
                semester_id: semesterId
            }
        };
        setCourseCohort(courseCohort);
    };
    const setCourseCohort = (semesterData) => {
        console.log(semesterData);
        axios
            .post(`${timetablingSrv}/program-cohort-semesters`, semesterData)
            .then((res) => {
                alert('Succesfully Assigned semester');
                setProgress(100);
                fetchCoursesAssignedToProgram(progId);
                resetStateCloseModal();
            })
            .catch((error) => {
                console.log(error);
                setProgress(0);
                alert(error.message);
            });
    };
    const unassignSelectedCourseFromProgram = (selectedCourseId: number): void => {
        axios.put(`${timetablingSrv}/programs/${programId}/courses/${selectedCourseId}`)
            .then(res => {
                alert('Succesfully removed course ' + res.data);
                fetchCoursesAssignedToProgram(progId); 
            })
            .catch((err) => {
                setErrorMessages(['Unassigning course failed!']);
                console.log(err);
            });
    };
    const handleSemesterUpdate=(e,row:programCohortCourse)=>{
        const courseSemester = {
            'program-cohort-semester': {
                semester_id: semesterId
            }
        };
        axios
            .patch(`${timetablingSrv}/course-cohorts/${row.id}`, courseSemester)
            .then(()=>{
                alert('Successfully changed semester ');
                fetchCoursesAssignedToProgram(progId);
                resetStateCloseModal();
                setDisabled(false);
            });
    };

    const handleFeeItemsPost = async () => {
        axios
            .post(financeSrv,{'createFeeItemRequest':{
                narrative:narrative,
                amount: amount,
                currency:currency,
                programCohortSemesterId: programCohortSemesterId
            }
            })
            .then(()=>{
                alert('Successfully posted fee items');
            })
            .catch((err) => {
                setErrorMessages(['Post fee items failed!']);
                console.log(err);
            });
    };

    const resetStateCloseModal=(): void =>{
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

    const onSelectedCurrency = currencyAbbrev => {
        setCurrency(currencyAbbrev);
    };

    const handleNarrativeChange = (event) => {
        setNarrative(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const selectStyle = {
        width:'100%',
        height: '30px'
    };
    return (
        <>
            <LinearProgress style={{display: loadingBar }} />
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
                        <MaterialTable
                            title={`${programName} of ${anticipatedGraduation} courses`}
                            columns={columns}
                            data={data}
                            actions={[
                                rowData => ({
                                    icon: DeleteIcon,
                                    tooltip: 'Delete Course',
                                    onClick: () => {unassignSelectedCourseFromProgram(rowData.id);},
                                })
                            ]}
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
                        <p>Publishing a semester for {programCohortCode} will disable you from adding semesters to this semester for the course, continue?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => publishSemesterAndFeeItems()}>Continue to publish</Button>
                        <Button variant="primary" onClick={() => toggleDialog()}>Continue editing</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
            <Modal
                show={showPublishModal}
                onHide={togglePublishModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Publish {programName} {programCohortCode}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor='startDate'><b>Anticipated Start Date</b></label><br />
                            <TextInput name='startDate'  id='startDate'  type="date" required /><br />
                            <label htmlFor='Date'><b>Number of slots</b></label><br />
                            <TextInput name='numSlots' id='numSlots' type="text" placeholder="number of slots" required
                                onChange={(e)=>{
                                    console.log(e.target.value);
                                }}/><br/>
                            <label htmlFor='semester'><b>Semester</b></label><br />    
                            <SelectGroup
                                name="semester"
                                id="semester"
                                required
                                errorMessage="Please select semester"
                                onChange={(e) => setSelectedemester(e.target.value)}
                            >
                                <option value={selectedSemester}>{selectedSemester}</option>
                                {
                                    semesters.map(semester => (
                                        <option key={semester.id} value={semester.id}>{semester.name}</option>
                                    ))
                                }
                            </SelectGroup>
                            <hr/>
                            <label htmlFor='narrative'><b>Narrative</b></label><br />
                            <TextInput name='narrative'  id='narrative'  type="text" value = {narrative} onChange = {handleNarrativeChange} required /><br />

                            <label htmlFor='amount'><b>Amount</b></label><br />
                            <TextInput name='amount'  id='amount'  type="number" value = {amount} onChange = {handleAmountChange} required /><br />

                            <label htmlFor='currency'><b>Currency</b></label><br />     
                            <SelectCurrency style = {selectStyle} name= 'currency' value={currency} onChange={onSelectedCurrency} />
                        </div>
                        <div className='form-group'>
                            <button
                                className="btn btn-info float-left"
                                onClick={(e) => {
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
            <Modal
                backdrop="static"
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <LinearProgress className={classes.root} variant="determinate" value={progressBar} />
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Assign semester </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <SelectGroup name="c" id="color" required onChange={(e)=>{
                            setSemesterId(e.target.value);
                            setSelectedSemesterId(e.target.value);
                        }} >
                            {
                                semester.map(sem => {
                                    return(
                                        <option key={sem.name} defaultValue={selectedSemesterId} value={sem.id} >{sem.name}</option>
                                    );
                                })
                            }
                        </SelectGroup><br></br>
                        <div className='form-group'>
                            <Button className='btn btn-info float-right' onClick={(e) => assignSemester(e)}>Submit
                            </Button>
                        </div>
                        <Button className="btn btn-danger float-left" onClick={handleClose}>
                            Close
                        </Button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ProgramCohortCoursesList;
