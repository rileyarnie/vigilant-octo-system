/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Modal, ProgressBar, Button } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import Config from '../../config';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import LinearProgress from '@material-ui/core/LinearProgress';

import { DeactivateCourseCohort } from './DeactivateCourseCohort';
const tableIcons = {
    Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref: any) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref: any) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref: any) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref: any) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref: any) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: any) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: any) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: any) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: any) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: any) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: any) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: any) => <ViewColumn {...props} ref={ref} />)
};

function ProgramCohortCoursesList() {

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
            render: (row:any) => (
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
    ];
    const [data, setData] = useState([]);
    const [programId, setProgramId] = useState();
    const [courseName, setCourseName] = useState('');
    const [courseId] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [iserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const progId = JSON.parse(localStorage.getItem('programId'));
    const programCohortCode = localStorage.getItem('program_cohort_code');
    const [showPublishModal, setShowPublish] = useState(false);
    const [showDialog, setDialog] = useState(false);
    const [selectedSemester, setSelectedemester] = useState('Please select semester');
    const [progressBar, setProgress] = useState(0);
    const [loadingBar, setLoadingBar] = useState('block');
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

    const publishSemester = () => {
        console.log('publish semester');
        toggleDialog();
        togglePublishModal();
    };

    const unassignSelectedCourseFromProgram = (selectedCourseId: number): void => {
        axios.put(`${timetablingSrv}/programs/${selectedCourseId}/${programId}`)
            .then(res => {
                alert('Succesfully removed course ' + res.data);
                fetchCoursesAssignedToProgram(progId); 
            })
            .catch((err) => {
                setErrorMessages(['Unassigning course failed!']);
                console.log(err);
            });
    };
    const togglePublishModal = () => {
        showPublishModal ? setShowPublish(false) : setShowPublish(true);
    };
    const toggleDialog = () => {
        showDialog ? setDialog(false) : setDialog(true);
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
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
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
                        <Button variant="secondary" onClick={() => publishSemester()}>Continue to publish</Button>
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
                centered
            >
                <ProgressBar animated now={progressBar} variant="info"/>
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
                        </div>
                        <div className='form-group'>
                            <button
                                className="btn btn-danger float-left"
                                onClick={(e) => {
                                    toggleDialog();
                                
                                }}
                            >
								Publish
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-info float-right" onClick={togglePublishModal}>
						Close
                    </button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ProgramCohortCoursesList;
