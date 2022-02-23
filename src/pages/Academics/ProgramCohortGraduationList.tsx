/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { LinearProgress } from '@mui/material';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
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
import { ProgramCohortService } from '../services/ProgramCohortService';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
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

interface Props {
    toggleGraduationList: () => void;
}

const ProgramCohortGraduationList: React.FunctionComponent<Props> = ({ toggleGraduationList }) => {
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [errorMessages] = useState([]);
    const [isError] = useState(false);
    const [graduands, setGraduands] = useState([]);
    const programCohortId = JSON.parse(localStorage.getItem('programCohortId'));

    useEffect(() => {
        ProgramCohortService.getGraduands({ programCohortId })
            .then((res) => {
                setGraduands(res.data);
            })
            .catch((error) => {
                console.log('error', error);
                alerts.showError(error.message);
            });
    }, []);

    const columns = [
        { title: 'ID', field: 'studentId' },
        { title: 'Student Name', field: 'studentName' },
        { title: 'Grades', field: 'grades' }
    ];

    const data = graduands.map((graduand) => {
        return {
            studentId: graduand.name,
            studentName: `${graduand.applications_firstName} ${graduand.applications_lastName}`,
            grades: graduand.averageMarks
        };
    });

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button
                        className="float-right"
                        variant="primary"
                        onClick={() => {
                            toggleGraduationList();
                        }}
                    >
                        Show All Students
                    </Button>
                </Col>
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
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
                        <MaterialTable
                            title="List of Graduating Students"
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            options={{ actionsColumnIndex: -1 }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProgramCohortGraduationList;
