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
import { Icons } from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import {MenuItem, Select} from '@material-ui/core';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Modal, Button, Card} from 'react-bootstrap';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
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
const CourseCohortSemester = ():JSX.Element => {
    interface semester {
        id: number;
        name: string;
    }
    interface course {
        semester: semester;
        id: number;
        name: string;
        codePrefix: string;
        isRegistered:string;

    }
    enum RegistrationStatus {
        registered = 'registered',
        deferred = 'deferred',
    }
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Semester name', field: 'name' },
        { title: 'Start Date', render:(row)=>row.startDate.slice(0,10) },
        { title: 'End Date', render:(row)=>row.endDate.slice(0,10) },
    ];
    const childColumns = [
        { title: 'ID', field: 'course.id' },
        { title: 'Course Code', field: 'course.codePrefix' },
        { title: 'Course Name', field:'course.name' },
        { title: 'Registration status',  render:(row:course)=> (
            <p>{row.isRegistered === RegistrationStatus.registered  ? 'Registered' :  'not registered'}</p>
        )
        },
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => (
                <Select>
                    {row.isRegistered === true ?
                        <button className="btn btn btn-link" onClick={() => {toggleDeferModal();setCourseName(row.c_name);setCourseCode(row.c_codePrefix);}}>
                            <MenuItem value="Edit">Defer</MenuItem></button>
                        :
                        <button className="btn btn btn-link" onClick={() => {toggleRegisterModal();setCourseName(row.c_name);setCourseCohortId(row.cc_id);setCourseCode(row.c_codePrefix);}}><MenuItem value="register">Register</MenuItem></button>
                    }
                    <Link to='/cohortsCourses'>
                        <MenuItem value="View courses">Transfer credits</MenuItem>
                    </Link>
                </Select>
            )
        }
    ];
    const [data, setData] = useState([]);
    const [childData, setChildData] = useState(new Map<number,course[]>());
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const simsSrv = Config.baseUrl.simsSrv;
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [studentId, setStudentId] = useState(1);
    const [courseCode, setCourseCode] = useState('');
    const [courseCohortId, setCourseCohortId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [showModal, setModal] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const programName = localStorage.getItem('programName');
    const programCohortId = localStorage.getItem('programCohortId');
    const programCode = localStorage.getItem('programCode');
    const [linearDisplay, setLinearDisplay] = useState('none');


    useEffect(() => {
        axios.get(`${timetablingSrv}/course-cohorts`,{params:{studentId:studentId, programCohortId:programCohortId, loadExtras:'course,semester'}})
            .then(res => {
                const myData = res.data;
                const uniqueSemIds = myData.map((v:course) => v.semester.id)
                    .filter((value, index, self) => self.indexOf(value) === index);
                const semesterData = uniqueSemIds.map(semId=> {
                    const cc = myData.filter((v:course) => v.semester.id === semId )[0];
                    return {id: cc.semester.id, name: cc.semester.name, startDate: cc.semester.startDate, endDate: cc.semester.endDate};
                });
                setData(semesterData);
                const childData = new Map<number, course[]>();
                uniqueSemIds.forEach(semId => {
                    const courses = myData.filter((v:course) => v.semester.id === semId);
                    childData.set(semId, courses);
                });
                setChildData(childData);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);
    const resetStateCloseModal = () => {
        setModal(false);
        setModalShow(false);
        setCourseCode('');
        setCourseName('');
        setStudentId(1);
    };
    const handleRegistration=()=>{
        const register = {
            'createCourseCohortRegistration': {
                studentId: studentId,
                courseCohortId:courseCohortId,
                registrationStatus:true
            }
        };
        axios
            .post(`${simsSrv}/course-cohort-registration`, register)
            .then(()=>{
                alerts.showSuccess('Course registration successfully');
                resetStateCloseModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                console.log(error);
                setLinearDisplay('none');
            });
    };
    const handleDefer=()=>{
        const defer = {
            'createCourseCohortRegistration': {
                studentId: studentId,
                courseCohortId:courseCohortId,
                registrationStatus:false
            }
        };
        axios
            .post(`${simsSrv}/course-cohort-registrations`, defer)
            .then(()=>{
                alerts.showSuccess('Course registration successfully');
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
                console.log(error);
            });
    };
    const toggleDeferModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const toggleRegisterModal = () => {
        modalShow ? resetStateCloseModal() : setModalShow(true); setModal(false);
    };
    const handleClose = () => {
        showModal ? resetStateCloseModal() : setModal(false);
    };
    const handleCloseModal = () => {
        modalShow ? resetStateCloseModal() : setModalShow(false);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <LinearProgress style={{display: linearDisplay }} />
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
                            title={`${programCode} ${programName} courses`}
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            detailPanel={[
                                {
                                    render: row => {
                                        return (
                                            <MaterialTable
                                                title='Course Cohorts'
                                                icons={tableIcons}
                                                columns={childColumns}
                                                data={childData.get(row.id)}
                                            />
                                        );
                                    }
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                show={showModal}
                onHide={toggleDeferModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Deferment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-cen">You are about to request for deferral of <b>{courseCode}</b> <b>{courseName}</b>
                        {' '}Select submit to confirm. No action will be taken if you select cancel</p>
                    <Button className="btn btn-danger btn-rounded float-left" onClick={handleClose}>Cancel</Button>
                    <Button className="btn btn-info btn-rounded float-right" onClick={() => handleDefer()}>Submit</Button>
                </Modal.Body>
            </Modal>
            <Modal
                show={modalShow}
                onHide={toggleRegisterModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-cen">You are about to request for registration of <b>{courseCode}</b> <b>{courseName}</b>
                        {' '}Select submit to confirm. No action will be taken if you select cancel</p>
                    <Button className="btn btn-danger btn-rounded float-left" onClick={handleCloseModal}>Cancel</Button>
                    <Button className="btn btn-info btn-rounded float-right" onClick={() => handleRegistration()}>Submit</Button>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default CourseCohortSemester;