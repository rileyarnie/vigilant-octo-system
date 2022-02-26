/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import { useState, useEffect, forwardRef } from 'react';
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
import { Button, LinearProgress } from '@material-ui/core';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';

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
const alerts: Alerts = new ToastifyAlerts();
const AssignCourse = (): JSX.Element => {
    const timetablingSrv = Config.baseUrl.timetablingSrv;
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
    const [, setCourseName] = useState('');
    const [courseId, setCourseId] = useState(null);
    const [iserror] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [selectedRows, setSelectedRows] = useState([]);
    const [errorMessages] = useState([]);
    const progId = JSON.parse(localStorage.getItem('programId'));
    useEffect(() => {
        axios
            .get(`${timetablingSrv}/courses`)
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
        axios
            .get(`${timetablingSrv}/courses`)
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

    const assignSelectedCoursesToProgram = (selectedCourses: Array<number>) => {
        setLinearDisplay('block');
        axios
            .put(`${timetablingSrv}/programs/${programId}/courses`, { courses: selectedCourses })
            .then((res) => {
                setLinearDisplay('block');
                alerts.showSuccess('Course assignment successful');
                fetchCourses();
                return res;
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
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
                        <MaterialTable
                            title="Assign Courses List"
                            columns={columns}
                            data={data}
                            options={{
                                selection: true,
                                showSelectAllCheckbox: false,
                                showTextRowsSelected: false
                            }}
                            onSelectionChange={(rows) => handleRowSelection(rows[0]?.name, rows[0]?.id, rows)}
                            icons={tableIcons}
                        />
                    </Card>
                </Col>
            </Row>

            <Button
                style={{ display: !courseId ? 'none' : 'block' }}
                variant="contained"
                color="secondary"
                onClick={() => {
                    assignSelectedCoursesToProgram(selectedRows);
                }}
            >
                Assign courses
            </Button>
        </>
    );
};
export default AssignCourse;
