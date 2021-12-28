/* eslint-disable react/display-name */
import React, { useState, useEffect} from 'react';
import { forwardRef } from 'react';
import MaterialTable, { Icons } from 'material-table';
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
import { Row, Col, Card, Button, Modal} from 'react-bootstrap';
import Config from '../../config';
import { Switch } from '@material-ui/core';
import CourseCreation from './CreateCourse';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
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
const CoursesList = ():JSX.Element => {
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    interface Course {
        name: string;
        id: number;
        prerequisiteCourses: string;
        description: string;
        trainingHours: number;
        isTimetableable: boolean;
        needsTechnicalAssistant: boolean;
        activation_status: boolean;
        approval_status: boolean;
        isElective:boolean;
    }
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/courses`)
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const [data, setData] = useState([]);
    const [showModal, setModal] = useState(false);
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    //const [selectedCourse,setSelectedCourse] = useState({} as Course)
    let approvalStatus: boolean;
    let activationStatus: boolean;
    let isElective:boolean;
    let msg:string;
    const handleActivationStatusToggle = (event, row: Course) => {
        if (row.activation_status) {
            msg = 'Successfully Deactivated Course';
            activationStatus = false;
            approvalStatus=row.approval_status;
            isElective = row.isElective; 
            handleToggleStatusSubmit(event, row);
        }
        if (!row.activation_status) {
            msg = 'Successfully Activated Course';
            activationStatus = true;
            approvalStatus=row.approval_status;
            isElective = row.isElective; 
            handleToggleStatusSubmit(event, row);
        }
    };
    const handleApprovalStatusToggle = (event, row: Course) => {      
        if (row.approval_status) {
            msg = 'Successfully Declined Course';
            approvalStatus = false;
            activationStatus=row.activation_status;  
            isElective = row.isElective;          
            handleToggleStatusSubmit(event, row);
        }
        if (!row.approval_status) {
            msg = 'Successfully Approved Course';
            approvalStatus = true;
            activationStatus=row.activation_status;  
            isElective = row.isElective;            
            handleToggleStatusSubmit(event, row);
        }
    };

    const handleToggleStatusSubmit = (e, row: Course) => {       
        const course = {
            activation_status: activationStatus,
            approval_status: approvalStatus,  
            isElective: isElective          
        }; 


        setLinearDisplay('block');
        axios
            .put(`${timetablingSrv}/courses/${row.id}`, course)
            .then(() => {                
                alerts.showSuccess(msg);
                setLinearDisplay('none');
                fetchCourses();
                
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Course name', field: 'name' },
        { title: 'Status', field: 'activation_status' },
        {
            title: 'Toggle Activation Status',
            field: 'internal_action',
            render: (row: Course) => (
                <Switch
                    onChange={(event) => handleActivationStatusToggle(event, row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={row.activation_status===true}
                />
            )
        },
        {
            title: 'Toggle Approval Status',
            field: 'internal_action',
            render: (row: Course) => (
                <Switch
                    onChange={(event) => handleApprovalStatusToggle(event, row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={row.approval_status===true}                   
                />
            )
        }
    ];

    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create Course
                    </Button>
                </Col>
            </Row>
            <LinearProgress  style={{display: linearDisplay}} /> 
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
                            title="Courses"
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal} backdrop="static">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CourseCreation setModal={setModal} linearDisplay={linearDisplay} setLinearDisplay={setLinearDisplay} fetchCourses={fetchCourses}> </CourseCreation>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default CoursesList;
