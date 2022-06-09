/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {MTableToolbar} from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../../App/components/Breadcrumb';
import {Row, Col, Modal, Button, Card} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../../lib/Alert';
import TableWrapper from '../../../utlis/TableWrapper';
import {timetablingAxiosInstance} from '../../../utlis/interceptors/timetabling-interceptor';
import {simsAxiosInstance} from '../../../utlis/interceptors/sims-interceptor';
import {CourseCohortService} from '../../services/CourseCohortsService';

const alerts: Alerts = new ToastifyAlerts();
const PublishedSemester = (): JSX.Element => {
    interface Semester {
        id: number;
        name: string;
    }

    interface programCohortSemester {
        id: number;
        semesterId: number;
        semester: Semester;
    }

    interface registration {
        registrationStatus: string;
        id: number
    }
    interface course {
        id: number;
        name: string;
        codePrefix: string;
    }

    interface CourseCohort {
        programCohortSemester: programCohortSemester;
        status: string;
        registration: registration;
        course: course
    }

    const columns = [
        {title: 'ID', field: 'id'},
        {title: 'Semester name', field: 'name'},
        {title: 'Start Date', render: (row) => row?.startDate.slice(0, 10)},
        {title: 'End Date', render: (row) => row?.endDate.slice(0, 10)}
    ];
    const [data, setData] = useState([]);
    const [childData, setChildData] = useState(new Map<number, CourseCohort[]>());
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [courseCohortIds, setCourseCohortIds] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [programCohortSemesterId, setProgramCohortSemesterId] = useState();
    const [applicationId, setApplicationId] = useState();
    const queryParams = new URLSearchParams(window.location.search);
    const studentName = queryParams.get('studentName');
    const studentId = parseInt(queryParams.get('studentId'));
    const programCohortId = queryParams.get('programCohortId');
    const progCohortApplicationId = queryParams.get('applicationId');
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        setApplicationId(JSON.parse(progCohortApplicationId));
        getCourseCohorts();
    }, [programCohortId]);

    function getCourseCohorts() {
        timetablingAxiosInstance.get('/course-cohorts', {
            params: {
                studentId: studentId,
                programCohortId: programCohortId,
                loadExtras: 'course,semester,student,registrations'
            }
        })
            .then((res) => {
                const myData = res.data;
                const uniqueSemIds = myData
                    .filter(cc => cc?.programCohortSemester && cc?.programCohortSemester?.semesterId)
                    .map((v: CourseCohort) => v?.programCohortSemester?.semesterId)
                    .filter((value, index, self) => self.indexOf(value) === index);
                const semesterData = uniqueSemIds.map((semId) => {
                    const cc = myData.filter((v: CourseCohort) => v?.programCohortSemester?.semesterId === semId)[0];
                    return {
                        id: cc?.programCohortSemester?.semester?.id,
                        name: cc?.programCohortSemester?.semester?.name,
                        startDate: cc?.programCohortSemester?.semester?.startDate,
                        endDate: cc?.programCohortSemester?.semester?.endDate
                    };
                });
                setData(semesterData);
                const childData = new Map<number, CourseCohort[]>();
                uniqueSemIds.forEach((semId) => {
                    const courses = myData.filter((v: CourseCohort) => v?.programCohortSemester?.semesterId === semId);
                    childData.set(semId, courses);
                });
                setChildData(childData);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }
    function getTranscript(programCohortId: string, semesterId: number) {
        CourseCohortService.getTranscript(programCohortId, semesterId);
    }
    const resetStateCloseModal = () => {
        setModalShow(false);
    };
    const handleRegistration = () => {
        const register = {
            applicationId: applicationId,
            courseCohortIds: courseCohortIds,
            registrationStatus: 'registered',
            studentId: studentId
        };
        simsAxiosInstance.post(`/program-cohort-semesters/${programCohortSemesterId}/registrations`, register)
            .then(() => {
                alerts.showSuccess('Successfully registered for courses');
            })
            .catch((error) => {
                alerts.showError(error?.response?.data || error.message);
                setLinearDisplay('none');
            }).finally(() => {
                getCourseCohorts();
                resetStateCloseModal();
                setLinearDisplay('none');
            });
    };
    const handleRowSelection = (rows) => {
        const courseCohortIds = rows.map((row) => row.id);
        setCourseCohortIds(courseCohortIds);
        setProgramCohortSemesterId(rows[0]?.programCohortSemesterId);
    };
    const toggleRegisterModal = () => {
        modalShow ? resetStateCloseModal() : setModalShow(true);
    };
    const handleCloseModal = () => {
        modalShow ? resetStateCloseModal() : setModalShow(false);
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
                            title={`${studentName} courses`}
                            columns={columns}
                            data={data}
                            options={{}}
                            detailPanel={[
                                {
                                    render: (row) => {
                                        return (
                                            <TableWrapper
                                                title="Course Cohorts"
                                                columns={[
                                                    {title: 'ID', field: 'id'},
                                                    {title: 'Course Code', field: 'course.codePrefix'},
                                                    {title: 'Course Name', field: 'course.name'},
                                                    {
                                                        title: 'Registration Status',
                                                        render: (row) => <>{!row?.registration?.registrationStatus ? 'Not Registered' : row?.registration?.registrationStatus}</>
                                                    }
                                                ]}
                                                data={childData.get(row.id)}
                                                options={{
                                                    selection: true,
                                                    showSelectAllCheckbox: false,
                                                    showTextRowsSelected: false,
                                                    selectionProps: rowData => ({
                                                        disabled: rowData.registration?.registrationStatus === 'registered',
                                                        color: 'primary'
                                                    })
                                                }}
                                                onSelectionChange={(rows) => handleRowSelection(rows)}
                                                components={{
                                                    Toolbar: (props) => (
                                                        <div>
                                                            <MTableToolbar {...props} />
                                                            <div style={{padding: '0px 10px'}}>
                                                                {props.selectedRows.length === 0 ?
                                                                    <p className="btn btn-light btn-default float-center">Select Courses to register</p>
                                                                    :
                                                                    <Button
                                                                        className="btn btn-info btn-default float-center"
                                                                        onClick={() => {
                                                                            toggleRegisterModal();
                                                                        }}
                                                                    >
                                                                        Register
                                                                    </Button>
                                                                }
                                                                <Button
                                                                    className="btn btn-info btn-default float-right"
                                                                    onClick={() => {
                                                                        getTranscript(programCohortId, row.id);
                                                                    }}
                                                                >
                                                                    Download Transcript
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )
                                                }}
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
                show={modalShow}
                onHide={toggleRegisterModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-center" id="contained-modal-title-vcenter">Course
                        Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">
                        You are about to request for registration of the courses selected<br/> Select <b>Submit</b> to
                        confirm. No
                        action will be taken if you select cancel
                    </p>
                    <Button className="btn btn-danger btn-rounded float-left" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button className="btn btn-info btn-rounded float-right" onClick={() => handleRegistration()}>
                        Submit
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default PublishedSemester;
