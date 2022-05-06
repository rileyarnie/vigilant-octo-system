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
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const CourseCohortsDetails = (props: any): JSX.Element => {
    const [data, setData] = useState([]);

    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('block');
    const [certificationType, setCertificationType] = useState('');
    const [showGraduating, setShowGraduating] = useState(false);
    const [courseCohort, setCourseCohort] = useState([]);
    const [isMarkEntryUnlocked, setIsMarkEntryUnlocked] = useState(false);
    const [showMarksLockedModal, setMarksLockedModal] = useState(false);
    let enterredMarks;
    let selectedMarks;
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
        fetchProgramByCourseCohortId();
        fetchCourseCohortById();
    }, []);

    const courseCohortId = props.match.params.id;

    const handleMarksEntryUnlockedEdit = (id: number, isMarkEntryUnlocked: boolean,courseCohort) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .patch(`/course-cohorts/${id}`, {
                isMarksEntryUnlocked: isMarkEntryUnlocked,
                programCohortId: courseCohort.programCohortId
            })
            .then(res => {
                alerts.showSuccess('Successfuly updated marks entry lock status');
                setLinearDisplay('none');
                return res.data;
            })
            .catch(err => {
                console.log(err);
                setLinearDisplay('none');
                alerts.showError('Error updating marks entry lock status');
            });
    };

    const fetchCourseCohortById = () => {
        timetablingAxiosInstance
            .get('/course-cohorts', {
                params: {
                    courseCohortIds: courseCohortId,
                    loadExtras: 'semester'
                }
            })
            .then(res => {
                console.log('gotten course cohort ', res.data);
                setCourseCohort(res.data[0]);
                setIsMarkEntryUnlocked(res.data[0].isMarkEntryUnlocked);
            })
            .catch(err => err);
    };
    const fetchProgramByCourseCohortId = () => {
        const courseCohortIdArr = [parseInt(courseCohortId)];
        
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/programs', {
                params: {
                    courseCohortId: JSON.stringify(courseCohortIdArr),
                    loadExtras: 'program'
                }
            })
            .then((res: any) => {
                const program = res.data[0];
                setCertificationType(program.certificationType);
                
                fetchcourseCohortsRegistrations(program.certificationType);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.response.data);
                setLinearDisplay('none');
            });
    };

    const fetchcourseCohortsRegistrations = (certificationTypeParam:string): void => {
        setLinearDisplay('block');
        simsAxiosInstance
            .get('/course-cohort-registrations', { params: { loadExtras: 'marks', certificationType: certificationTypeParam, courseCohortIds: courseCohortId } })
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
                fetchcourseCohortsRegistrations(certificationType);
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
                                    <Button
                                        className="float-right"
                                        variant="primary"
                                        onClick={() => {
                                            isMarkEntryUnlocked ? handleMarksEntryUnlockedEdit(courseCohortId, false,courseCohort ) : handleMarksEntryUnlockedEdit(courseCohortId, true,courseCohort); 
                                        }}
                                    >
                                        {isMarkEntryUnlocked ? 'Lock Marks Entry' : 'Unlock Marks Entry'} 
                                    </Button>
                                </Col>
                                <Col>
                                    <CreateMarksModal
                                        fetchcourseCohortsRegistrations={() => fetchcourseCohortsRegistrations(certificationType)}
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
            <ConfirmationModalWrapper
                show={showMarksLockedModal}
                closeModal={() => setMarksLockedModal(false)}
                //closeModal={() => setMarksLockedModal(false)}
            >
                <p>Marks entry is locked. Please unlock mark entry to continue.</p>
            </ConfirmationModalWrapper>
        </>
    );
};

export default CourseCohortsDetails;
