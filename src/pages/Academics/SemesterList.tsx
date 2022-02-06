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
import { LinearProgress, Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
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
const SemesterList = ():JSX.Element => {
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    interface Semester {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
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
            .put(`${timetablingSrv}/semesters/${row.id}`, {'body': semester})
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
        { title: 'Start Date',  render:(row)=>row.startDate.slice(0,10) },
        { title: 'End Date',  render:(row)=>row.endDate.slice(0,10) },
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
    const[,setDisabled] = useState(false);
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [semesterName, setSemesterName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setModal] = useState(false);
    const [semesterId, setSemesterId] = useState(null);
    const [errorMessages] = useState([]);
    const [selectedSemesterName, setSelectedSemesterName] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedSemester,setSelectedSemester] = useState<Semester>();
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        axios.get(`${timetablingSrv}/semesters`)
            .then(res => {
                console.log(res.data);
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);
    const updateSemester = (semesterId, updates) => {
        axios.put(`${timetablingSrv}/semesters/${semesterId}`,{'body': updates})
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated Semester');
                fetchSemesters();
                resetStateCloseModal();
            })
            .catch(error => {
                console.error(error);
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
                setLinearDisplay('none');
                alerts.showSuccess('Successfully created semesters');
                fetchSemesters();
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };

    const resetStateCloseModal = () => {
        setSemesterId(null);
        setSemesterName('');
        setSelectedSemesterName('');
        setModal(false);
    };

    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const handleClose = () => {
        showModal ? resetStateCloseModal() : setModal(false);
    };
    const getName = (semesterName?:string, semesterId?:number) => {return semesterId? semesterName : selectedSemesterName; };
    const getEndDate = (date?:string, semesterId?:number) => {return semesterId? date?.slice(0,10) : selectedEndDate; };
    const getStartDate = (date?:string, semesterId?:number) => {return semesterId? date?.slice(0,10) : selectedStartDate; };
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
            <LinearProgress style={{display: linearDisplay}} />
            <Row>
                <Col>
                    <Card>
                        <div>
                            {isError &&
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
                                        setSelectedStartDate(rowData.startDate);
                                        setSelectedEndDate(rowData.endDate);
                                        setSelectedSemester(rowData);
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
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{semesterId ? 'Edit Semester' : 'Create a Semester'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor='name'><b>Semester name</b></label>
                            <TextInput name='semesterName' id='semesterName' type='text' required
                                defaultValue={getName(selectedSemester?.name, semesterId)}
                                onChange={(e) => { setSemesterName(e.target.value);}}
                            /><br />
                            <label htmlFor='Date'><b>Start Date</b></label><br />
                            <TextInput name='startDate'  id='startDate'  type="date" required
                                defaultValue={getStartDate(selectedSemester?.startDate, semesterId)}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                }}/><br />
                            <label htmlFor='Date'><b>End Date</b></label><br />
                            <TextInput name='endDate'  id='endDate' type="date" required
                                defaultValue={getEndDate(selectedSemester?.endDate, semesterId)}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                }}/><br />
                        </div>
                        <div className='form-group'>
                            <button className="btn btn-info float-right" onClick={(e) => semesterId ? handleEdit(e) : handleCreate(e)}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-left" onClick={handleClose}>
                        Close
                    </button>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default SemesterList;