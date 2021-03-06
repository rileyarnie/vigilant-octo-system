/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import {LinearProgress} from '@mui/material';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import {ProgramCohortService} from '../services/ProgramCohortService';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

interface Props {
    toggleGraduationList: () => void;
    programCohortId:number
}

const ProgramCohortGraduationList: React.FunctionComponent<Props> = ({ toggleGraduationList, programCohortId }) => {
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [errorMessages] = useState([]);
    const [isError] = useState(false);
    const [graduands, setGraduands] = useState([]);

    useEffect(() => {
        setLinearDisplay('block');
        ProgramCohortService.getGraduands({ programCohortId })
            .then((res) => {
                setGraduands(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);

    const columns = [
        { title: 'ID', field: 'studentId' },
        { title: 'Student Name', field: 'studentName' },
        { title: 'Grades', field: 'grades' }
    ];

    const data = graduands.map((graduand) => {
        return {
            studentId: graduand.studentId,
            studentName: `${graduand.firstName} ${graduand.lastName}`,
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
                        <TableWrapper
                            title="List of Graduating Students"
                            columns={columns}
                            data={data}
                            options={{ actionsColumnIndex: -1, pageSize: 50 }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProgramCohortGraduationList;
