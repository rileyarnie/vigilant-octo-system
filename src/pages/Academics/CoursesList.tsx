/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, Modal, Row} from 'react-bootstrap';
import CourseCreation from './CreateCourse';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_CREATE_COURSE, ACTION_GET_COURSES, ACTION_UPDATE_COURSE} from '../../authnz-library/timetabling-actions';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import {ValidationForm} from 'react-bootstrap4-form-validation';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';

const alerts: Alerts = new ToastifyAlerts();

const CoursesList = (): JSX.Element => {
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
        isElective: boolean;
    }
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/courses',{ params: { includeDeactivated: true } })
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
    const [rowData] = useState<Course>();
    const [status, setStatus] = useState(true);
    let isElective: boolean;
    let msg: string;
    const [disabled, setDisabled] = useState(false);

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Course name', field: 'name' },
        {
            title: 'Toggle Activation Status',
            field: 'internal_action',
            render: (row: Course) =>
                canPerformActions(ACTION_UPDATE_COURSE.name) && (
                    <>
                        <CustomSwitch
                            defaultChecked={row.activation_status}
                            color="secondary"
                            inputProps={{'aria-label': 'controlled'}}
                            onChange={(event) => {
                                handleActivationStatusToggle(event, row);
                                toggleActivationModal();
                            }}
                        />
                        <ConfirmationModalWrapper disabled={disabled}
                            submitButton
                            submitFunction={() => handleToggleStatusSubmit(row)}
                            closeModal={handleCloseModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                Are you sure you want to change the status of <>{row.name}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
        }
    ];
    const handleActivationStatusToggle = (event, row: Course) => {
        setStatus(!row.activation_status);
    };
    const handleToggleStatusSubmit = (row: Course) => {
        const course = {
            activation_status: status,
            isElective: isElective
        };
        setLinearDisplay('block');
        setDisabled(true);
        timetablingAxiosInstance
            .put(`/courses/${row.id}`, course)
            .then(() => {
                setDisabled(false);
                alerts.showSuccess(msg);
                fetchCourses();
                setLinearDisplay('none');
            })
            .catch((error) => {
                setDisabled(false);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const toggleActivationModal = () => {
        setActivationModal(true);
    };
    const handleCloseModal = () => {
        fetchCourses();
        setActivationModal(false);
    };
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
            {canPerformActions(ACTION_GET_COURSES.name) && (
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
            )}
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
                show={activationModal}
                onHide={toggleActivationModal}
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
                        <Button disabled={disabled} className="btn btn-danger float-left" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button disabled={disabled}
                            className="btn btn-primary float-right"
                            onClick={() => {
                                handleToggleStatusSubmit(rowData);
                            }}
                        >
                            Confirm
                        </Button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default CoursesList;
