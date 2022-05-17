/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Card, Col, Row} from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1)
        },
        extendedIcon: {
            marginRight: theme.spacing(1)
        }
    })
);
const ProgramCoursesList = (props): JSX.Element => {
    const classes = useStyles();
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
    const [courseId, setCourseId] = useState(0);
    const [iserror] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [errorMessages, setErrorMessages] = useState([]);
    const progId = JSON.parse(localStorage.getItem('programId'));
    const programName = localStorage.getItem('programName');

    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get(`/programs/${progId}/courses`)
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
                setProgramId(progId);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);

    const fetchCoursesAssignedToProgram = (progId: number) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get(`/programs/${progId}/courses`)
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                setErrorMessages([error]);
                alerts.showError(error.message);
            });
    };
    const unassignSelectedCoursesFromTrainer = (selectedCourseId: number) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/programs/${programId}/courses/${selectedCourseId}`)
            .then(() => {
                alerts.showSuccess('Succesfully removed course');
                fetchCoursesAssignedToProgram(progId);
                toggleCloseConfirmModal();
                setDisabled(false);
                setLinearDisplay('none');
            })
            .catch((error) => {
                setDisabled(false);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    const handleBack = () => {
        // eslint-disable-next-line react/prop-types
        props.history.goBack();
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row>
                <div className="">
                    <IconButton aria-label="delete" className={classes.margin} onClick={handleBack} size="small">
                        <ArrowBackIcon fontSize="inherit" /> Back
                    </IconButton>
                </div>
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
                            title="Program Courses List"
                            columns={columns}
                            data={data}
                            actions={[
                                (rowData) => ({
                                    icon: DeleteIcon,
                                    tooltip: 'Delete Course',
                                    onClick: () => {
                                        setCourseId(rowData.id);
                                        toggleConfirmModal();
                                    }
                                })
                            ]}
                            options={{}}
                        />
                        <ConfirmationModalWrapper disabled={disabled}
                            submitButton
                            submitFunction={() => {unassignSelectedCoursesFromTrainer(courseId);}}
                            closeModal={toggleCloseConfirmModal}
                            show={confirmModal}
                        >
                            <>
                                <h6 className="text-center">Are you sure you want remove this course from {programName}?</h6>
                            </>
                        </ConfirmationModalWrapper>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProgramCoursesList;
