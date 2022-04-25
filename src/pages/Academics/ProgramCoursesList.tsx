/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from 'react';
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
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LoadingBar from 'react-top-loading-bar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
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
    const [courseName, setCourseName] = useState('');
    const [courseId] = useState(null);
    const [iserror] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [, setSelectedRows] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const progId = JSON.parse(localStorage.getItem('programId'));

    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get(`/programs/${progId}/courses`)
            .then((res) => {
                setData(res.data);
                console.log('Program Courses', res.data);
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
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                setErrorMessages([error]);
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const unassignSelectedCoursesFromTrainer = (selectedCourseId: number) => {
        timetablingAxiosInstance
            .put(`/programs/${programId}/courses/${selectedCourseId}`)
            .then((res) => {
                alerts.showSuccess('Succesfully removed course');

                fetchCoursesAssignedToProgram(progId);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
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
                                        unassignSelectedCoursesFromTrainer(rowData.id);
                                    }
                                })
                            ]}
                            options={{}}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProgramCoursesList;
