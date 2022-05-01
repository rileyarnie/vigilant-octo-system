/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Edit from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Switch } from '@material-ui/core';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_DEPARTMENT, ACTION_GET_DEPARTMENTS, ACTION_UPDATE_DEPARTMENT } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import { customSelectTheme } from '../lib/SelectThemes';
import Select from 'react-select';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const Department = (): JSX.Element => {
    interface department {
        name: string;
        id: number;
        isActive: boolean;
    }
    const columns = [
        { title: 'ID', field: 'id', hidden: true },
        { title: 'Department name', field: 'name' },
        { title: 'HOD', field: 'hodTrainerId' },
        {
            title: 'Activation Status',
            field: 'isActive',
            render: (row: department) => (
                <>
                    <Switch
                        defaultChecked={row.isActive}
                        color="secondary"
                        inputProps={{'aria-label': 'controlled'}}
                        onChange={(event) => {
                            handleActivationStatusToggle(event, row);
                            toggleActivationModal();
                        }}
                    />
                    <ConfirmationModalWrapper
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
    const options = [];
    const [status, setStatus] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [deptname, setDeptName] = useState('');
    const [showModal, setModal] = useState(false);
    const [deptId, setDeptId] = useState(null);
    const [hod, setHod] = useState(null);
    const [selectedDeptName, setSelectedDeptName] = useState('');
    const [selectedHoD, setSelectedHoD] = useState(null);
    const [users, setUsers] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [errorMessages] = useState([]);
    const [, setDisabled] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    let activationStatus: boolean;
    const [disabledButton, setDisabledButton] = useState(false);


    const handleActivationStatusToggle = (event, row: department) => {
        setStatus(!row.isActive);
        toggleActivationModal();
    };

    const handleToggleStatusSubmit = (row: department) => {
        const departmentStatus = {
            name: row.name,
            status
        };
        setDisabledButton(true);
        
        timetablingAxiosInstance
            .put(`/departments/${row.id}`, departmentStatus)
            .then(() => {
                setDisabledButton(false);
                const msg = isActive ? 'Department activated successfully' : 'Department deactivated successfully';
                alerts.showSuccess(msg);
                setActivationModal(false);
                setDisabled(false);
                fetchDepartments();
            })
            .catch((error) => {
                setDisabledButton(false);
                console.error(error);
                alerts.showError(error.message);
                setDisabled(false);
            });
    };
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/departments')
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        timetablingAxiosInstance
            .get('/trainers')
            .then((res) => {
                setLinearDisplay('none');
                console.log('trainers', res.data);
                setUsers(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);
    users.map((hod) => {
        return options.push({ value: hod.tr_id, label: hod.stf_name });
    });
    const updateDepartment = (deptId, updates) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/departments/${deptId}`, updates)
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated department');
                fetchDepartments();
                resetStateCloseModal();
            })
            .catch((error) => {
                setLinearDisplay('block');
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const fetchDepartments = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/departments')
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                setLinearDisplay('block');
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const handleCreate = (e) => {
        e.preventDefault();
        const department = {
            name: deptname,
            hodTrainerId: hod,
            activation_status: activationStatus,
            isActive: isActive
        };
        createDepartment(department);
    };
    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            name: deptname === '' ? selectedDeptName : deptname,
            hodTrainerID: selectedHoD,
            isActive: isActive
        };
        updateDepartment(deptId, updates);
    };
    const createDepartment = (departmentData) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/departments', departmentData)
            .then(() => {
                setLinearDisplay('block');
                fetchDepartments();
                alerts.showSuccess('Successfully created Department');
                resetStateCloseModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                setLinearDisplay('block');
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const handleChange = (hod) => {
        setHod(hod);
    };
    const resetStateCloseModal = () => {
        setDeptId(null);
        setDeptName('');
        setSelectedHoD(null);
        setModal(false);
        setConfirmModal(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const toggleActivationModal = () => {
        activationModal ? resetStateCloseModal() : setActivationModal(true);
    };
    const handleCloseModal = () => {
        setActivationModal(false);
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
                    {canPerformActions(ACTION_CREATE_DEPARTMENT.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create Department
                        </Button>
                    )}
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_DEPARTMENTS.name) && (
                <>
                    <LinearProgress style={{ display: linearDisplay }} />
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
                                <TableWrapper
                                    title="Departments"
                                    columns={columns}
                                    data={data}
                                    options={{ actionsColumnIndex: -1 }}
                                    actions={
                                        canPerformActions(ACTION_UPDATE_DEPARTMENT.name)
                                            ? [
                                                {
                                                    icon: Edit,
                                                    tooltip: 'Edit Row',
                                                    onClick: (event, rowData) => {
                                                        setDeptId(rowData.id);
                                                        setSelectedDeptName(rowData.name);
                                                        setSelectedHoD(rowData.hodTrainerId);
                                                        setIsActive(rowData.isActive);
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
                backdrop="static"
                show={showModal}
                onHide={toggleCreateModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{deptId ? 'Edit department' : 'Create a department'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="departmentName">Department name</label>
                            <TextInput
                                name="departmentName"
                                id="departmentName"
                                type="text"
                                value={deptId ? selectedDeptName : deptname}
                                placeholder={deptId ? selectedDeptName : 'Enter department name'}
                                onChange={(e) => (deptId ? setSelectedDeptName(e.target.value) : setDeptName(e.target.value))}
                                required
                            />
                            <br />
                        </div>
                        <div className="form-group">
                            <label htmlFor="trainerType">Select a HoD</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={options}
                                isMulti={false}
                                placeholder="Select a HOD."
                                noOptionsMessage={() => 'No HODs available'}
                                onChange={handleChange}
                            />
                        </div>
                    </ValidationForm>
                    <Col>
                        <button disabled={disabledButton} className="btn btn-danger float-left" onClick={() => toggleCreateModal()}>
                            Cancel
                        </button>
                        <button disabled={disabledButton} className="btn btn-info float-right" onClick={toggleConfirmModal}>
                            Submit
                        </button>
                    </Col>
                </Modal.Body>
            </Modal>
            <ConfirmationModalWrapper
                submitButton
                submitFunction={(e) => (deptId ? handleEdit(e) : handleCreate(e))}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                {deptId ? `Are you sure you want to edit ${selectedDeptName} ?` : 'Are you sure you want to create a new department ?'}
            </ConfirmationModalWrapper>
        </>
    );
};
export default Department;
