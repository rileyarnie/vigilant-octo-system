/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
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
import { Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal, ProgressBar } from 'react-bootstrap';
import Config  from '../../config';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import {Icons} from 'material-table';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
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
function SemesterList() {
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    interface Semester {
        id: number;
        name: string;
        startDate: Date;
        endDate: Date;
        activation_status: boolean;
    }

    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: Semester) => {
        setDisabled(true);
        if (row.activation_status) {
            activationStatus = false;
            handleToggleStatusSubmit(event, row);
        }
        if (!row.activation_status) {
            activationStatus = true;
            handleToggleStatusSubmit(event, row);
        }
    };
    const handleToggleStatusSubmit = (e, row: Semester) => {
        const semester = {
            activation_status: activationStatus,
        };
        axios
            .put(`${timetablingSrv}/semesters/${row.id}`, semester)
            .then(() => {
                const msg = activationStatus? 'Successfully activated semester' : 'Successfully Deactivated semester';
                alerts.showSuccess(msg);
                fetchSemesters();
                setDisabled(false);

            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                setDisabled(false);
            });
    };

    const columns = [
        { title: 'ID', field: 'id'},
        { title: 'Semester name', field: 'name' },
        { title: 'Start Date', field: 'startDate' },
        { title: 'End Date', field: 'endDate' },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row:Semester) => (
                <Switch
                    onChange={(event) => handleActivationStatusToggle(event, row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={row.activation_status===true}
                />
            )
        }
    ];
    const [progress, setProgress] = useState(0);
    const[,setDisabled] = useState(false);
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [semesterName, setSemesterName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setModal] = useState(false);
    const [semesterId, setSemesterId] = useState(null);
    const [errorMessages] = useState([]);
    const [selectedSemesterName, setSelectedSemesterName] = useState('');
    const [selectedStartDate] = useState('');
    const [selectedEndDate] = useState('');
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        axios.get(`${timetablingSrv}/semesters`)
            .then(res => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        fetchProgramCohorts();
        fetchPrograms();
    }, []);
    const updateSemester = (semesterId, updates) => {
        axios.put(`${timetablingSrv}/semesters/${semesterId}`, updates)
            .then(() => {
                setProgress(100);
                alerts.showSuccess('Successfully updated Semester');
                fetchSemesters();
                resetStateCloseModal();
                setProgress(0);
            })
            .catch(error => {
                console.error(error);
                setProgress(0);
                alerts.showError(error.message);
            });
    };
    const fetchSemesters = () => {
        axios.get(`${timetablingSrv}/semesters`)
            .then(res => {
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const fetchProgramCohorts = () => {
        axios.get(`${timetablingSrv}/program-cohorts`)
            .then(res=>{
                console.log(res.data);
                setData(res.data);
            })
            .catch((error)=>{
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const fetchPrograms = () => {
        axios.get(`${timetablingSrv}/programs`)
            .then(res=>{
                console.log(programs);
                setPrograms(res.data);
            })
            .catch((error)=>{
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const handleCreate = (e) => {
        e.preventDefault();
        const semester = { 
            name: semesterName,
            startDate: startDate,
            endDate: endDate,
        };

        createSemester(semester);
    };
    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            name: semesterName === '' ? selectedSemesterName : semesterName,
            startDate: startDate == '' ? selectedStartDate: startDate,
            endDate: endDate == '' ? selectedEndDate: endDate,
        };
        updateSemester(semesterId, updates);
    };
    const createSemester = (semesterData) => {
        console.log(semesterData);
        axios
            .post(`${timetablingSrv}/semesters`, semesterData)
            .then(() => {
                setProgress(100);
                alerts.showSuccess('Successfully created semesters');
                fetchSemesters();
                resetStateCloseModal();
                setProgress(0);
            })
            .catch((error) => {
                setProgress(0);
                alerts.showError(error.message);
            });
    };

    const resetStateCloseModal = () => {
        setSemesterId(null);
        setSemesterName('');
        setModal(false);
    };

    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const handleClose = () => setModal(false);

    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create Semester
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <div>
                            {iserror &&
                            <Alert severity='error'>
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>;
                                })}
                            </Alert>
                            }
                        </div>
                        <MaterialTable
                            title='Semesters'
                            columns={columns}
                            data={data}
                            options={{actionsColumnIndex: -1}}
                            icons={tableIcons}
                            actions={[
                                {
                                    icon: Edit,
                                    tooltip: 'Edit Row',
                                    onClick: (event, rowData) => {
                                        setSemesterId(rowData.id);
                                        setSelectedSemesterName(rowData.name);
                                        toggleCreateModal();
                                    }

                                }

                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                show={showModal}
                onHide={toggleCreateModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <ProgressBar animated now={progress} variant="info" />
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{semesterId ? 'Edit Semester' : 'Create a Semester'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor='name'><b>Semester name</b></label>
                            <TextInput name='semesterName' id='semesterName' type='text' required
                                placeholder={semesterId ? selectedSemesterName : semesterName} onChange={(e) => {
                                    setSemesterName(e.target.value);
                                }}/><br />
                            <label htmlFor='Date'><b>Start Date</b></label><br />
                            <TextInput name='startDate'  id='startDate'  type="date" required
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                }}/><br />
                            <label htmlFor='Date'><b>End Date</b></label><br />
                            <TextInput name='endDate'  id='endDate' type="date" required
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                }}/><br />
                        </div>
                        <div className='form-group'>
                            <button className="btn btn-danger float-left" onClick={(e) => semesterId ? handleEdit(e) : handleCreate(e)}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-info float-right" onClick={handleClose}>
                        Close
                    </button>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default SemesterList;