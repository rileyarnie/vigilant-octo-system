/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Edit from '@material-ui/icons/Edit';
import { LinearProgress, Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { TextInput, ValidationForm } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_SEMESTERS, ACTION_GET_SEMESTERS, ACTION_UPDATE_SEMESTERS } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const SemesterList = (): JSX.Element => {
    interface Semester {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
        activationStatus: boolean;
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
                    <>
                        <Switch
                            defaultChecked={row.activationStatus}
                            color="secondary"
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={(event) => {
                                handleActivationStatusToggle(event, row);
                                setRowData(row);
                                toggleActivationModal();
                            }}
                        />
                        <ConfirmationModalWrapper
                            disabled={disabledButton}
                            submitButton
                            submitFunction={() => handleToggleStatusSubmit(row)}
                            closeModal={handleCloseModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                A you sure you want to change the status of <>{row.name}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
        }
    ];
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [semesterName, setSemesterName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setModal] = useState(false);
    const [semesterId, setSemesterId] = useState(null);
    const [errorMessages] = useState([]);
    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedSemesterName, setSelectedSemesterName] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedSemester, setSelectedSemester] = useState<Semester>();
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [activationModal, setActivationModal] = useState(false);
    const [, setRowData] = useState<Semester>();
    const today = new Date().toISOString().slice(0, 10);
    const [status, setStatus] = useState(false);
    let activationStatus: boolean;
    const [disabledButton, setDisabledButton] = useState(false);

    const handleActivationStatusToggle = (event, row: Semester) => {
        setStatus(!row.activationStatus);
    };
    const handleToggleStatusSubmit = (row: Semester) => {
        setLinearDisplay('block');
        const semester = {
            activationStatus: status
        };
        setDisabledButton(true);
        timetablingAxiosInstance
            .put(`/semesters/${row.id}`, { body: semester })
            .then(() => {
                const msg = activationStatus ? 'Successfully activated semester' : 'Successfully Deactivated semester';
                alerts.showSuccess(msg);
                fetchSemesters();
                handleCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisabledButton(false);
            });
    };
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/semesters')
            .then((res) => {
                console.log(res.data);
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);
    const updateSemester = (semesterId, updates) => {
        setLinearDisplay('block');
        setDisabledButton(true);
        timetablingAxiosInstance
            .put(`/semesters/${semesterId}`, { body: updates })
            .then(() => {
                setDisabledButton(false);
                alerts.showSuccess('Successfully updated Semester');
                fetchSemesters();
                resetStateCloseModal();
                toggleCloseConfirmModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                setDisabledButton(false);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const fetchSemesters = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/semesters', { params: { includeDeactivated: true } })
            .then((res) => {
                setData(res.data);
                setActivationModal(false);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setActivationModal(false);
                setLinearDisplay('none');
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
        setLinearDisplay('block');
        setDisabledButton(true);
        timetablingAxiosInstance
            .post('/semesters', semesterData)
            .then(() => {
                alerts.showSuccess('Successfully created semesters');
                fetchSemesters();
                resetStateCloseModal();
                toggleCloseConfirmModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisabledButton(false);
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
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
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

            <ModalWrapper
                show={showModal}
                modalSize="lg"
                closeModal={toggleCreateModal}
                title={semesterId ? `Edit ${getName(selectedSemester?.name, semesterId)}` : 'Create a Semester'}
                submitButton
                submitFunction={toggleConfirmModal}
            >
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
                </ValidationForm>
            </ModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabledButton}
                submitButton
                submitFunction={(e) => (semesterId ? handleEdit(e) : handleCreate(e))}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">
                    {semesterId
                        ? `Are you sure you want to edit ${getName(selectedSemester?.name, semesterId)} ?`
                        : 'Are you sure you want to create a semester ?'}
                </h6>
            </ConfirmationModalWrapper>
        </>
    );
};
export default SemesterList;
