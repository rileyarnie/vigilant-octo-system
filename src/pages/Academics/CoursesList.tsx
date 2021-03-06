/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, ListGroup, Modal, Row} from 'react-bootstrap';
import CourseCreation from './CreateCourse';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_CREATE_COURSE, ACTION_UPDATE_COURSE} from '../../authnz-library/timetabling-actions';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import {ValidationForm} from 'react-bootstrap4-form-validation';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import {Interweave} from 'interweave';

const alerts: Alerts = new ToastifyAlerts();

const CoursesList = (): JSX.Element => {
    interface Course {
        name: string;
        id: number;
        code: string;
        codePrefix: string;
        prerequisiteCourses: { id: number; name: string; codePrefix: string }[];
        description: string;
        trainingHours: number;
        isTimetableable: boolean;
        needsTechnicalAssistant: boolean;
        activationStatus: boolean;
        approval_status: boolean;
        isElective: boolean;
        courseOutline: string;
        department: { name: string };
    }
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/courses', { params: { includeDeactivated: true, loadExtras: 'semsters,departments,prerequisiteCourses' } })
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
    const [activationModal, setActivationModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [rowData] = useState<Course>();
    const [status, setStatus] = useState(true);
    const [selectedRow, setSelectedRow] = useState<Course>();
    let isElective: boolean;
    let msg: string;
    const [disabled, setDisabled] = useState(false);
    const [courseDetailsModal, setCourseDetailsModal] = useState(false);

    const columns = [
        { title: 'Code', render: (row) => `${row.codePrefix}-${row.id}` },
        { title: 'Course name', field: 'name' },
        {
            title: 'Toggle Activation Status',
            field: 'internal_action',
            render: (row: Course) =>
                canPerformActions(ACTION_UPDATE_COURSE.name) && (
                    <>
                        <CustomSwitch
                            defaultChecked={row.activationStatus}
                            color="secondary"
                            inputProps={{ 'aria-label': 'controlled' }}
                            checked={row.activationStatus}
                            onChange={(event) => {
                                handleActivationStatusToggle(event, row);
                                setSelectedRow(row);
                                toggleActivationModal();
                            }}
                        />
                        <ConfirmationModalWrapper
                            disabled={disabled}
                            submitButton
                            submitFunction={() => handleToggleStatusSubmit()}
                            closeModal={handleCloseModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                Are you sure you want to change the status of <>{!selectedRow ? '' : selectedRow.name}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
        },
        {
            title: 'Actions',
            render: (row) => (
                <Button
                    className="btn btn-info"
                    size="sm"
                    onClick={() => {
                        setSelectedRow(row);
                        toggleCourseDetailsModal();
                    }}
                >
                    View Course Details
                </Button>
            )
        }
    ];
    const handleActivationStatusToggle = (event, row: Course) => {
        setStatus(!row.activationStatus);
    };
    const handleToggleStatusSubmit = () => {
        const course = {
            activationStatus: status,
            isElective: isElective
        };
        setLinearDisplay('block');
        setDisabled(true);
        timetablingAxiosInstance
            .put(`/courses/${selectedRow.id}`, course)
            .then(() => {
                msg = status ? 'Course activated successfully' : 'Course deactivated successfully';
                alerts.showSuccess(msg);
                fetchCourses();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabled(false);
                setSelectedRow(null);
                setLinearDisplay('none');
                handleCloseModal();
            });
    };
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const toggleEditModal = () => {
        editModal ? setEditModal(false) : setEditModal(true);
    };
    const toggleActivationModal = () => {
        activationModal ? setActivationModal(false) : setActivationModal(true);
    };
    const handleCloseModal = () => {
        fetchCourses();
        setActivationModal(false);
    };

    const toggleCourseDetailsModal = () => setCourseDetailsModal(!courseDetailsModal);
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    {canPerformActions(ACTION_CREATE_COURSE.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create Course
                        </Button>
                    )}
                </Col>
            </Row>
            <>
                <LinearProgress style={{ display: linearDisplay }} />
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
                            <TableWrapper title="Courses" columns={columns} data={data} options={{}} />
                        </Card>
                    </Col>
                </Row>
            </>
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal} backdrop="static">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CourseCreation
                        setModal={setModal}
                        linearDisplay={linearDisplay}
                        setLinearDisplay={setLinearDisplay}
                        fetchCourses={fetchCourses}
                    >
                        {' '}
                    </CourseCreation>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={editModal}
                onHide={toggleEditModal}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">{}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <p className="text-center">Are you sure you want to change the status of {rowData?.name} ?</p>
                        <Button disabled={disabled} className="btn btn-danger float-left" onClick={toggleEditModal}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled}
                            className="btn btn-primary float-right"
                            onClick={() => {
                                handleToggleStatusSubmit();
                            }}
                        >
                            Confirm
                        </Button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
            <ModalWrapper
                show={courseDetailsModal}
                title={`Details for ${selectedRow?.name}`}
                modalSize="lg"
                closeModal={toggleCourseDetailsModal}
            >
                <Row>
                    <div className="col-md-6">
                        <ListGroup>
                            <ListGroup.Item>Course Code: {`${selectedRow?.codePrefix}-${selectedRow?.id}`}</ListGroup.Item>
                            <ListGroup.Item>Course Name: {`${selectedRow?.name}`}</ListGroup.Item>
                            <ListGroup.Item>Department: {`${selectedRow?.department?.name}`}</ListGroup.Item>
                            <ListGroup.Item>Course Description: {`${selectedRow?.description}`}</ListGroup.Item>
                            <ListGroup.Item>Training Hours: {`${selectedRow?.trainingHours}`}</ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className="col-md-6">
                        <ListGroup>
                            <ListGroup.Item>Approval Status Code: {`${selectedRow?.approval_status}`}</ListGroup.Item>
                            <ListGroup.Item>
                                Needs Techincal Assistant: {`${selectedRow?.needsTechnicalAssistant ? 'Yes' : 'No'}`}
                            </ListGroup.Item>
                            <ListGroup.Item>Is Elective: {`${selectedRow?.isElective ? 'Yes' : 'No'}`}</ListGroup.Item>
                            <ListGroup.Item>is TimeTabelable: {`${selectedRow?.isTimetableable ? 'Yes' : 'No'}`}</ListGroup.Item>
                        </ListGroup>
                    </div>
                    {selectedRow?.courseOutline && (
                        <div>
                            <h5 style={{ marginTop: '0.8rem' }}>Course Outline</h5>
                            <Interweave content={selectedRow?.courseOutline} />
                        </div>
                    )}
                    {selectedRow?.prerequisiteCourses.length > 0 && (
                        <div>
                            <h5 style={{ marginTop: '0.8rem' }}>Prerequisite Courses</h5>
                            <ul>
                                {selectedRow?.prerequisiteCourses.map((course) => (
                                    <li key={course.id}>
                                        {course.name} : {course.codePrefix}-{course.id}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Row>
            </ModalWrapper>
        </>
    );
};
export default CoursesList;
