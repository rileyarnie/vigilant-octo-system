/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {MTableToolbar} from 'material-table';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Col, Row} from 'react-bootstrap';
import {InputLabel, MenuItem, Select} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {LinearProgress} from '@mui/material';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import CustomSwitch from '../../assets/switch/CustomSwitch';

const alerts: Alerts = new ToastifyAlerts();
const CourseCohorts = (): JSX.Element => {
    const [data, setData] = useState([]);
    const [trainersData, setTrainers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [switchStatus,setSwitchStatus] = useState<boolean>();
    const [activationModal, setActivationModal] = useState(false);
    const handleCloseActivationModal = () => {
        setActivationModal(false);
    };
    const [selectedRow,setselectedRow] = useState<{id:number}>();
    const [disabled, setDisabled] = useState(false);

    function updateCourseCohort(courseCohortId: number, updates:unknown){
        setDisabled(true);
        return timetablingAxiosInstance
            .patch(`/course-cohorts/${courseCohortId}`,updates)
            .then(() => {
                alerts.showSuccess('Successfully updated course cohort');
                fetchcourseCohorts();                
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);                
            })
            .finally(() => {
                setDisabled(false);
                setActivationModal(false);
            });
    }

    const columns = [
        { title: 'Course cohort ID', field: 'id', hidden: false },
        { title: 'Course code', field: 'course.codePrefix' },
        { title: 'Course Name', field: 'course.name' },
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => (
                <Select>
                    <Link to= {{ 
                        pathname: `/coursecohortdetails/${row.id}`,
                        state:{programCohortId:row.programCohortId}
                    }} >
                        <MenuItem value="View courses">View details</MenuItem>
                    </Link>
                </Select>
            )
        },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row) =>
                (
                    <>
                        <CustomSwitch
                            defaultChecked={row.activationStatus}
                            color="secondary"
                            inputProps={{'aria-label': 'controlled'}}
                            checked={row.activationStatus}
                            onChange={(event) => {
                                setselectedRow(row);
                                setActivationModal(true);
                                setSwitchStatus(event.target.checked);
                                
                            }}
                        />
                        <ConfirmationModalWrapper
                            disabled={disabled}
                            submitButton
                            submitFunction={() => updateCourseCohort(selectedRow?.id,{activationStatus:switchStatus})}
                            closeModal={handleCloseActivationModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                Are you sure you want to change the status of Course Cohort Id: <>{selectedRow?.id}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
        }
    ];
    useEffect(() => {
        setLinearDisplay('block');
        fetchcourseCohorts();
        fetchTrainers();
        fetchSemesters();
    }, []);
    const fetchcourseCohorts = (): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance.get('/course-cohorts', { params: { loadExtras: 'trainer,program' } }).then((res) => {
            const ccData = res.data;
            setData(ccData);
            setLinearDisplay('none');
        })
            .catch((error) => {
                console.log('Failed to fetch course cohorts,',error);
                alerts.showError('Something went wrong fetching marks. Please contact system administrator.');
            });
    };

    const fetchcourseCohortsByTrainerId = (trainerId: number): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance.get('/course-cohorts', { params: { trainerId: trainerId } }).then((res) => {
            const ccData = res.data;
            setData(ccData);
            setLinearDisplay('none');
        });
    };

    const fetchcourseCohortsBySemesterId = (semesterId: number): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance.get('/course-cohorts', { params: { semesterId: semesterId } }).then((res) => {
            const ccData = res.data;
            setData(ccData);
            setLinearDisplay('none');
        });
    };

    const fetchTrainers = (): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance.get('/trainers').then((res) => {
            const trData = res.data;
            setTrainers(trData);
            setLinearDisplay('none');
        });
    };

    const fetchSemesters = (): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance.get('/semesters').then((res) => {
            const semData = res.data;
            setSemesters(semData);
            setLinearDisplay('none');
        });
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <>
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
                                title="Course Cohorts"
                                columns={columns}
                                data={data}
                                options={{ actionsColumnIndex: -1}}
                                components={{
                                    Toolbar: (props) => (
                                        <div>
                                            <MTableToolbar {...props} />
                                            <div style={{ display: 'flex', padding: '0px 0px' }}>
                                                <InputLabel id="demo-simple-select-label">Trainer</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    style={{ width: 150, textAlign: 'center' }}
                                                    onChange={(e) => {
                                                        fetchcourseCohortsByTrainerId(e.target.value as number);
                                                    }}
                                                >
                                                    {trainersData.map((tr) => {
                                                        return (
                                                            <MenuItem key={tr.tr_id} value={tr.tr_id}>
                                                                {tr.stf_name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>

                                                <InputLabel id="demo-simple-select-label">Semester</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    style={{ width: 150, textAlign: 'center' }}
                                                    onChange={(e) => {
                                                        fetchcourseCohortsBySemesterId(e.target.value as number);
                                                    }}
                                                >
                                                    {semesters.map((sem) => {
                                                        return (
                                                            <MenuItem key={sem.id} value={sem.id}>
                                                                {sem.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </>
        </>
    );
};

export default CourseCohorts;
