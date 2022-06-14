/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Edit from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_CREATE_DEPARTMENT, ACTION_UPDATE_DEPARTMENT} from '../../authnz-library/timetabling-actions';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import {customSelectTheme} from '../lib/SelectThemes';
import Select from 'react-select';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const Department = (): JSX.Element => {
    interface department {
        name: string;
        id: number;
        isActive: boolean;
        activationStatus: boolean;
        hodTrainerId: number

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
                    <CustomSwitch
                        defaultChecked={row.activationStatus}
                        color="secondary"
                        inputProps={{ 'aria-label': 'controlled' }}
                        checked={row.activationStatus}
                        onChange={(event) => {
                            handleActivationStatusToggle(event, row);
                            setSelectedRow(row);
                            toggleConfirmModal();
                        }}
                    />
                    <ConfirmationModalWrapper
                        disabled={disabledButton}
                        submitButton
                        submitFunction={() => handleToggleStatusSubmit()}
                        closeModal={() => fetchDepartments()}
                        show={confirmModal}
                    >
                        <h6 className="text-center">
                            A you sure you want to change the status of <>{!selectedRow ? '' : selectedRow.name}</> ?
                        </h6>
                    </ConfirmationModalWrapper>
                </>
            )
        }
    ];
    const deptAssigned = [];
    const options = [];
    const [status, setStatus] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [deptname, setDeptName] = useState('');
    const [showModal, setModal] = useState(false);
    const [deptId, setDeptId] = useState(null);
    const [hod, setHod] = useState(0);
    const [selectedDeptName, setSelectedDeptName] = useState('');
    const [selectedHoD, setSelectedHoD] = useState(0);
    const [users, setUsers] = useState([]);
    const [editConfirm, setEditConfirm] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [selectedRow, setSelectedRow] = useState<department>();
    const [errorMessages] = useState([]);
    const [, setDisabled] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    let activationStatus: boolean;
    const [disabledButton, setDisabledButton] = useState(false);
    const handleActivationStatusToggle = (event, row: department) => {
        setStatus(!row.activationStatus);
    };
    const assignedDept: { hodTrainerId: number }[] = [
        { hodTrainerId: selectedHoD}
    ];
    assignedDept.map((dpt) => {
        return deptAssigned.push({ value: dpt.hodTrainerId, label: dpt.hodTrainerId });
    });
    const handleToggleStatusSubmit = () => {
        setLinearDisplay('block');
        const departmentStatus = {
            activationStatus: status
        };
        setDisabledButton(true);

        timetablingAxiosInstance
            .put(`/departments/${selectedRow.id}`, departmentStatus)
            .then(() => {
                setDisabledButton(false);
                const msg = isActive ? 'Department activated successfully' : 'Department deactivated successfully';
                alerts.showSuccess(msg);
                setConfirmModal(false);
                setDisabled(false);
                fetchDepartments();
                setLinearDisplay('none');
            })
            .catch((error) => {
                setDisabledButton(false);
                alerts.showError(error.message);
                setDisabled(false);
            })
            .finally(() => {
                setSelectedRow(null);
                setLinearDisplay('none');
            });
    };
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/departments', { params: { includeDeactivated: true } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
        timetablingAxiosInstance
            .get('/trainers')
            .then((res) => {
                setLinearDisplay('none');
                setUsers(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);
    users.map((hod) => {
        return options.push({ value: hod.tr_id, label: hod.stf_name });
    });
    const updateDepartment = (deptId, updates) => {
        setLinearDisplay('block');
        setDisabledButton(true);
        timetablingAxiosInstance
            .put(`/departments/${deptId}`, updates)
            .then(() => {
                alerts.showSuccess('Successfully updated department');
                fetchDepartments();
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabledButton(false);
                setLinearDisplay('none');
                resetStateCloseModal();
            });
    };
    const fetchDepartments = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/departments', { params: { includeDeactivated: true } })
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                setLinearDisplay('block');
                alerts.showError(error.message);
                setLinearDisplay('none');
            })
            .finally(() => {
                setConfirmModal(false);
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
            hodTrainerId: hod === 0 ? selectedHoD : hod,
            isActive: isActive
        };
        updateDepartment(deptId, updates);
    };
    const createDepartment = (departmentData) => {
        setLinearDisplay('block');
        setDisabledButton(true);

        timetablingAxiosInstance
            .post('/departments', departmentData)
            .then(() => {
                fetchDepartments();
                alerts.showSuccess('Successfully created Department');
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisabledButton(false);
            });
    };
    const handleChange = (hod) => {
        setHod(hod.value);
    };
    const resetStateCloseModal = () => {
        setDeptId(null);
        setDeptName('');
        setSelectedHoD(null);
        setModal(false);
        setConfirmModal(false);
        setEditConfirm(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };

    const toggleConfirmModal = () => {
        confirmModal ? setConfirmModal(false) : setConfirmModal(true);
    };

    const toggleEditConfirmModal = () => {
        editConfirm ? setEditConfirm(false) : setEditConfirm(true);
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
            <ModalWrapper
                show={showModal}
                title={deptId ? 'Edit department' : 'Create a department'}
                closeModal={toggleCreateModal}
                modalSize="lg"
                noFooter={true}
            >
                <ValidationForm onSubmit={(e) => { e.preventDefault();toggleEditConfirmModal();}}>
                    <div className="form-group">
                        <label htmlFor="departmentName"><b>Department name<span className="text-danger">*</span></b></label>
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
                        <label htmlFor="trainerType"><b>Select a HoD</b></label>
                        <Select
                            theme={customSelectTheme}
                            defaultValue={deptAssigned}
                            options={options}
                            isMulti={false}
                            placeholder="Select a HOD."
                            noOptionsMessage={() => 'No HODs available'}
                            onChange={handleChange}
                            isClearable={true}
                        />
                    </div>
                    <div className="form-group">
                        <button disabled={disabledButton} className="btn btn-info float-right">
                            Submit
                        </button>
                        <button className="btn btn-danger float-left" onClick={(e) => { e.preventDefault();toggleCreateModal();}}>
                            Cancel
                        </button>
                    </div>
                </ValidationForm>
            </ModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabledButton}
                submitButton
                submitFunction={(e) => (deptId ? handleEdit(e) : handleCreate(e))}
                closeModal={() => setEditConfirm(false)}
                show={editConfirm}
            >
                {deptId ? `Are you sure you want to edit ${selectedDeptName} ?` : 'Are you sure you want to create a new department ?'}
            </ConfirmationModalWrapper>
        </>
    );
};
export default Department;
