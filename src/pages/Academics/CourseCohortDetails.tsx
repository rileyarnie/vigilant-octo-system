/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Col, Row} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import CreateMarksModal from './CreateMarksModal';
import Select from 'react-select';
import CertificationType from './enums/CertificationType';
import ProgramCohortGraduationList from './ProgramCohortGraduationList';
import {simsAxiosInstance} from '../../utlis/interceptors/sims-interceptor';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

const CourseCohortsDetails = (props: any): JSX.Element => {
    const [data, setData] = useState([]);

    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('block');
    const [certificationType, setCertificationType] = useState('');
    const [showGraduating, setShowGraduating] = useState(false);

    let enterredMarks;
    let selectedMarks;
    let programs;

    const shortTermMarks = [
        { value: 'complete', label: 'complete' },
        { value: 'incomplete', label: 'incomplete' }
    ];

    const competencyBasedMarks = [
        { value: 'pass', label: 'pass' },
        { value: 'fail', label: 'fail' }
    ];

    function renderSwitch(rowData) {
        switch (rowData.certificationType) {
        case CertificationType.shortTerm:
            return (
                <Select
                    options={shortTermMarks}
                    isMulti={false}
                    placeholder="Select short term marks"
                    noOptionsMessage={() => 'No available short term marks options'}
                    onChange={(e) => handleSelect(e)}
                    defaultValue={rowData.certificationType}
                />
            );

        case CertificationType.competencyBased:
            return (
                <Select
                    options={competencyBasedMarks}
                    isMulti={false}
                    noOptionsMessage={() => 'No available competency based marks options'}
                    onChange={(e) => handleSelect(e)}
                    defaultValue={rowData.certificationType}
                />
            );
        default:
            return <input type="text" defaultValue={rowData.marks} onChange={(e) => handleMarksChange(e)} />;
        }
    }
    const columns = [
        { title: 'Course Cohort ID', render: () => props.match.params?.id, hidden: false, editable: 'never' as const },
        { title: 'Certification Type', field: 'certificationType', hidden: true },
        { title: 'Id', field: 'id', hidden: true },
        { title: 'Marks', field: 'marks', editComponent: (tableData) => renderSwitch(tableData?.rowData) },
        { title: 'Grade', field: 'grade', editable: 'never' as const }
    ];

    useEffect(() => {
        setLinearDisplay('block');
        fetchcourseCohortsRegistrations();
        fetchProgramByCourseCohortId();
    }, []);

    const courseCohortId = props.match.params.id;

    const fetchProgramByCourseCohortId = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/programs', {
                params: {
                    courseCohortId: courseCohortId,
                    loadExtras: 'program'
                }
            })
            .then((res: any) => {
                const program = res.data[0];
                setCertificationType(program.certificationType);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.response.data);
                setLinearDisplay('none');
            });
    };

    const fetchcourseCohortsRegistrations = (): void => {
        setLinearDisplay('block');
        simsAxiosInstance
            .get('/course-cohort-registrations', { params: { loadExtras: 'marks', courseCohortIds: courseCohortId } })
            .then((res) => {
                const ccData = res.data;
                setData(ccData);
                setLinearDisplay('none');
            });
    };

    const toggleGraduationList = () => {
        setShowGraduating((prevState) => !prevState);
    };

    const updateMarks = async (id: number, marks: string) => {
        setLinearDisplay('block');
        simsAxiosInstance
            .put(`/course-cohort-registration-marks/${id}`, { marks: marks })
            .then(() => {
                fetchcourseCohortsRegistrations();
                alerts.showSuccess('Successfuly updated marks');
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.response.data);
                setLinearDisplay('none');
            });
    };

    const handleMarksChange = (e) => {
        enterredMarks = parseInt(e.target.value);
    };
    const handleSelect = (e) => {
        selectedMarks = e.target.value;
    };
    return (
        <>
            {!showGraduating ? (
                <div>
                    <Row className="align-items-center page-header">
                        <Col>
                            <Breadcrumb />
                        </Col>

                        <Col>
                            <Row>
                                <Col>
                                    <CreateMarksModal
                                        fetchcourseCohortsRegistrations={fetchcourseCohortsRegistrations}
                                        setLinearDisplay={setLinearDisplay}
                                        courseCohortId={courseCohortId}
                                        certificationType={certificationType}
                                    ></CreateMarksModal>
                                </Col>
                                <Col>
                                    <Button
                                        className="float-right"
                                        variant="primary"
                                        onClick={() => {
                                            toggleGraduationList();
                                        }}
                                    >
                                        Show Graduating Students
                                    </Button>
                                </Col>
                            </Row>
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
                                    title="Course Cohort Student/Marks Details"
                                    columns={columns}
                                    data={data}
                                    options={{ actionsColumnIndex: 0,}}
                                    editable={{
                                        onRowUpdate: (newData) => updateMarks(newData.id, enterredMarks || selectedMarks)
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <ProgramCohortGraduationList toggleGraduationList={toggleGraduationList} />
            )}
        </>
    );
};

export default CourseCohortsDetails;
