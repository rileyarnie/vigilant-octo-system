/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { useState, useEffect,forwardRef } from 'react';
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
import { Row, Col, Card } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import Config from '../../config';

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

function ProgramCohortCoursesList() {

    const columns = [
        { title: 'Course cohort code', field: 'courseCohortCode', hidden: false },
        { title: 'Course code', field: 'code' },
        { title: 'Name', field: 'name' },
        { title: 'Semester name', field: 'semName' },
        { title: 'Start date', field: 'startDate' },
        { title: 'End date', field: 'endDate' },
        { title: 'Action', field: 'action' }
    ];
    const [data, setData] = useState([]);
    const [programId, setProgramId] = useState();
    const [courseName, setCourseName] = useState('');
    const [courseId] = useState(null);
    const [iserror] = useState(false);
    const [, setSelectedRows] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const programName = localStorage.getItem('programName');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const progId = JSON.parse(localStorage.getItem('programId'));
    console.log(progId);
    useEffect(() => {
        axios.get(`${timetablingSrv}/programs/courses/${progId}`)
            .then(res => {
                setData(res.data);
                setProgramId(progId);
            })
            .catch((err) => {
                setErrorMessages(['Failed to fetch courses']);
                console.log(err);
            });
    }, []);

    const fetchCoursesAssignedToProgram = (progId: number): void => {
        axios.get(`${timetablingSrv}/programs/courses/${progId}`)
            .then(res => {
                setData(res.data);
            })
            .catch((error) => {
                setErrorMessages([error]);
                console.error(error);
            });
    };


    const unassignSelectedCourseFromProgram = (selectedCourseId: number): void => {
        axios.put(`${timetablingSrv}/programs/${selectedCourseId}/${programId}`)
            .then(res => {
                alert('Succesfully removed course ' + res.data);
                fetchCoursesAssignedToProgram(progId); 
            })
            .catch((err) => {
                setErrorMessages(['Unassigning course failed!']);
                console.log(err);
            });
    };
    
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
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
                            title={`${programName} of ${anticipatedGraduation} courses`}
                            columns={columns}
                            data={data}
                            actions={[
                                rowData => ({
                                    icon: DeleteIcon,
                                    tooltip: 'Delete Course',
                                    onClick: () => {unassignSelectedCourseFromProgram(rowData.id);},
                                })
                            ]}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            icons={tableIcons}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default ProgramCohortCoursesList;