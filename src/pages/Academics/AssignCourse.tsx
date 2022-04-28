/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import { Button, LinearProgress } from '@material-ui/core';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();
const AssignCourse = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'id', hidden: false },
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { title: 'Training Hours', field: 'trainingHours' },
        { title: 'Timetableable', render: (row) => <>{row.isTimetablable === true ? 'Yes' : 'No'}</> },
        { title: 'Technical Assistant', render: (row) => <>{row.needsTechnicalAssistant === true ? 'Yes' : 'No'}</> }
    ];
    const [data, setData] = useState([]);
    const [programId, setProgramId] = useState();
    const [, setCourseName] = useState('');
    const [courseId, setCourseId] = useState(null);
    const [iserror] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [selectedRows, setSelectedRows] = useState([]);
    const [errorMessages] = useState([]);
    const progId = JSON.parse(localStorage.getItem('programId'));
    console.log('program id ', progId);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        timetablingAxiosInstance
            .get('/courses')
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
                setProgramId(progId);
            })
            .catch((error) => {
                setLinearDisplay('block');
                console.error(error);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);

    const fetchCourses = () => {
        timetablingAxiosInstance
            .get('/courses')
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleRowSelection = (courseName: string, courseId: number, rows) => {
        const courseIds = rows.map((row) => row.id);
        const uniq = [...new Set(courseIds)];
        setSelectedRows(uniq);

        setCourseName(courseName);
        setCourseId(courseId);
    };

    const assignSelectedCoursesToProgram = () => {
        setLinearDisplay('block');
        setDisabled(true);
        timetablingAxiosInstance
            .put(`/programs/${programId}/courses`, { courses: selectedRows })
            .then((res) => {
                setDisabled(false);
                setLinearDisplay('block');
                alerts.showSuccess('Course assignment successful');
                fetchCourses();
                toggleCloseConfirmModal();
                setSelectedRows([]);
                setLinearDisplay('none');
                return res;
            })
            .catch((error) => {
                setDisabled(false);
                alerts.showError(error.message);
            });
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
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
                            title="Assign Courses List"
                            columns={columns}
                            data={data}
                            options={{
                                selection: true,
                                showSelectAllCheckbox: false,
                                showTextRowsSelected: false
                            }}
                            onSelectionChange={(rows) => handleRowSelection(rows[0]?.name, rows[0]?.id, rows)}
                        />
                    </Card>
                </Col>
            </Row>
            {selectedRows.length > 0 && (
                <>
                    <Button
                        style={{ display: !courseId ? 'none' : 'block' }}
                        variant="contained"
                        color="secondary"
                        onClick={toggleConfirmModal}
                        disabled={disabled}
                    >
                        Assign courses
                    </Button>
                    <ConfirmationModalWrapper
                        submitButton
                        submitFunction={assignSelectedCoursesToProgram}
                        closeModal={toggleCloseConfirmModal}
                        show={confirmModal}
                    >
                        <>
                            <h6 className="text-center">Are you sure you want assign these courses ?</h6>
                        </>
                    </ConfirmationModalWrapper>
                </>
            )}
        </>
    );
};
export default AssignCourse;
