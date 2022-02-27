/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from 'react';
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
import { Row, Col, Card } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LoadingBar from 'react-top-loading-bar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
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
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
    }),
);
const ProgramCoursesList = (props): JSX.Element => {
    const classes = useStyles();
    const columns = [
        { title: 'ID', field: 'id', hidden: false },
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { title: 'Training Hours', field: 'trainingHours' },
        { title: 'Timetableable', render: (row) =>(<>{row.isTimetablable === true ? 'Yes' : 'No'}</>)},
        { title: 'Technical Assistant', render: (row) =>(<>{row.needsTechnicalAssistant === true ? 'Yes' : 'No'}</>)},
    ];
    const [data, setData] = useState([]);
    const [programId, setProgramId] = useState();
    const [courseName, setCourseName] = useState('');
    const [courseId] = useState(null);
    const [iserror] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [, setSelectedRows] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const progId = JSON.parse(localStorage.getItem('programId'));

    useEffect(() => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/programs/${progId}/courses`)
            .then((res) => {
                setData(res.data);
                console.log('Program Courses',res.data);
                setLinearDisplay('none');
                setProgramId(progId);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);

    const fetchCoursesAssignedToProgram = (progId: number) => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/programs/${progId}/courses`)
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
        axios
            .put(`${timetablingSrv}/programs/${programId}/courses/${selectedCourseId}`)
            .then((res) => {
                alerts.showSuccess('Succesfully removed course');

                fetchCoursesAssignedToProgram(progId);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };
    const  handleBack = () => {
        props.history.goBack()
    }
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
                        <MaterialTable
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
                            icons={tableIcons}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProgramCoursesList;
