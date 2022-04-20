/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Edit from '@material-ui/icons/Edit';
import { LinearProgress, Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_SEMESTERS, ACTION_GET_SEMESTERS, ACTION_UPDATE_SEMESTERS } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();

const SemesterList = (): JSX.Element => {
    interface Semester {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
        activation_status: boolean;
    }

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Semester name', field: 'name' },
        { title: 'Start Date', render: (row) => row.startDate.slice(0, 10) },
        { title: 'End Date', render: (row) => row.endDate.slice(0, 10) },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: Semester) =>
                canPerformActions(ACTION_UPDATE_SEMESTERS.name) && (
                    <Switch
                        onChange={(event) => handleActivationStatusToggle(event, row)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        defaultChecked={row.activation_status === true}
                    />
                )
        }
    ];
    const [, setDisabled] = useState(false);
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
    const [selectedSemester, setSelectedSemester] = useState<Semester>();
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [activationModal, setActivationModal] = useState(false);
    const [rowData, setRowData] = useState<Semester>();
    const today = new Date().toISOString().slice(0, 10);
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: Semester) => {
        setDisabled(true);
        if (row.activation_status) {
            activationStatus = false;
            toggleActivationModal();
            setRowData(row);
        }
        if (!row.activation_status) {
            activationStatus = true;
            toggleActivationModal();
            setRowData(row);
        }
    };
    const handleToggleStatusSubmit = (row: Semester) => {
        const semester = {
            activation_status: activationStatus
        };
        timetablingAxiosInstance
            .put(`/semesters/${row.id}`, { body: semester })
            .then(() => {
                const msg = activationStatus ? 'Successfully activated semester' : 'Successfully Deactivated semester';
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
    useEffect(() => {
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
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
        timetablingAxiosInstance
            .put(`/semesters/${semesterId}`, { body: updates })
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated Semester');
                fetchSemesters();
                resetStateCloseModal();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const fetchSemesters = () => {
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
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
            endDate: endDate
        };
        createSemester(semester);
    };
    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            name: semesterName === '' ? selectedSemesterName : semesterName,
            startDate: startDate == '' ? selectedStartDate : startDate,
            endDate: endDate == '' ? selectedEndDate : endDate
        };
        updateSemester(semesterId, updates);
    };
    const createSemester = (semesterData) => {
        console.log(semesterData);
        timetablingAxiosInstance
            .post('/semesters', semesterData)
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
    const getName = (semesterName?: string, semesterId?: number) => {
        return semesterId ? semesterName : selectedSemesterName;
    };
    const getEndDate = (date?: string, semesterId?: number) => {
        return semesterId ? date?.slice(0, 10) : selectedEndDate;
    };
    const getStartDate = (date?: string, semesterId?: number) => {
        return semesterId ? date?.slice(0, 10) : selectedStartDate;
    };
    const toggleActivationModal = () => {
        activationModal ? resetStateCloseModal() : setActivationModal(true);
    };
    const handleCloseModal = () => {
        fetchSemesters();
        setActivationModal(false);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    {canPerformActions(ACTION_CREATE_SEMESTERS.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create Semester
                        </Button>
                    )}
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_SEMESTERS.name) && (
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
                                    title="Semesters"
                                    columns={columns}
                                    data={data}
                                    options={{ actionsColumnIndex: -1, pageSize: 50 }}
                                    actions={
                                        canPerformActions(ACTION_UPDATE_SEMESTERS.name)
                                            ? [
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
                                            ]
                                            : []
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

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
                        <div className="form-group">
                            <label htmlFor="name">
                                <b>Semester name</b>
                            </label>
                            <TextInput
                                name="semesterName"
                                id="semesterName"
                                type="text"
                                required
                                defaultValue={getName(selectedSemester?.name, semesterId)}
                                onChange={(e) => {
                                    setSemesterName(e.target.value);
                                }}
                            />
                            <br />
                            <label htmlFor="Date">
                                <b>Start Date</b>
                            </label>
                            <br />
                            <TextInput
                                name="startDate"
                                id="startDate"
                                type="date"
                                min={today}
                                required
                                defaultValue={getStartDate(selectedSemester?.startDate, semesterId)}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                }}
                            />
                            <br />
                            <label htmlFor="Date">
                                <b>End Date</b>
                            </label>
                            <br />
                            <TextInput
                                name="endDate"
                                id="endDate"
                                type="date"
                                min={today && startDate}
                                required
                                defaultValue={getEndDate(selectedSemester?.endDate, semesterId)}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                }}
                            />
                            <br />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info float-right" onClick={(e) => (semesterId ? handleEdit(e) : handleCreate(e))}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-left" onClick={handleClose}>
                        Close
                    </button>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={activationModal}
                onHide={toggleActivationModal}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">{}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <p className="text-center">A you sure you want to change the status of {rowData?.name} ?</p>
                        <Button className="btn btn-danger float-left" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            className="btn btn-primary float-right"
                            onClick={() => {
                                handleToggleStatusSubmit(rowData);
                            }}
                        >
                            Confirm
                        </Button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default SemesterList;
