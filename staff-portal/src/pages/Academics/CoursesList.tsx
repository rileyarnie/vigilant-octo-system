import React, { useState, useEffect, useRef } from 'react';
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
import { Row, Col, Card, Form, Button, Modal, ProgressBar } from 'react-bootstrap';
import Config from '../../config';
import { Switch } from '@material-ui/core';
import CourseCreation from './CreateCourse';
import EditCourse from './EditCourse';
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

function CoursesList(props) {
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const ACTIVE = 'ACTIVE';
    const INACTIVE = 'INACTIVE';

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
    }
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        axios
            .get(`${timetablingSrv}/courses`)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                // alert(error.message)
                console.error(error);
            });
    };
    const [data, setData] = useState([]);
    const [showModal, setModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);
    const [checked, setChecked] = useState(true);
    const [progress, setProgress] = useState(0);
    const[disabled,setDisabled] = useState(false)
    //const [selectedCourse,setSelectedCourse] = useState({} as Course)
    let approvalStatus: boolean;
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: Course) => {
        setDisabled(true)
        if (row.activation_status) {
            activationStatus = false;
            approvalStatus=row.approval_status
            handleToggleStatusSubmit(event, row);
        }
        if (!row.activation_status) {
            activationStatus = true;
            approvalStatus=row.approval_status
            handleToggleStatusSubmit(event, row);
        }
    };
    const handleApprovalStatusToggle = (event, row: Course) => {
        setDisabled(true)
        if (row.approval_status) {
            approvalStatus = false;
            activationStatus=row.activation_status            
            handleToggleStatusSubmit(event, row);
        }
        if (!row.approval_status) {
            approvalStatus = true;
            activationStatus=row.activation_status            
            handleToggleStatusSubmit(event, row);
        }
    };

    const handleToggleStatusSubmit = (e, row: Course) => {       
        const course = {
            activation_status: activationStatus,
            approval_status: approvalStatus
        };
        axios
            .put(`${timetablingSrv}/courses/${row.id}`, course)
            .then((res) => {
                alert('Success')
                fetchCourses();
                setDisabled(false)
                
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error);
                setDisabled(false)
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
                    defaultChecked={row.activation_status === true ? true : false}
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
                    defaultChecked={row.approval_status === true ? true : false}
                    disabled={disabled}
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
                            // @ts-ignore
                            icons={tableIcons}
                            actions={[
                                {
                                    icon: Edit,
                                    tooltip: 'Edit Row',
                                    onClick: (event, rowData) => {
                                        // Code to display custom Dialog here
                                        // setSelectedCourse(rowData)
                                        setEditModal(true);
                                    }
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal} backdrop="static">
                <ProgressBar striped variant="info" animated now={progress} />
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CourseCreation setModal={setModal} setProgress={setProgress} fetchCourses={fetchCourses}></CourseCreation> 
                </Modal.Body>
            </Modal>
            {/* <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered show={showEditModal}  backdrop="static">
            <ProgressBar striped variant="info" animated now={progress} />
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Edit {selectedCourse.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
				<EditCourse setEditModal={setEditModal} setProgress = {setProgress} fetchCourses={fetchCourses} selectedCourse={selectedCourse}></EditCourse>
                </Modal.Body>
            </Modal>             */}
        </>
    );
}
export default CoursesList;
