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
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Icons } from 'material-table';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Switch } from '@material-ui/core';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_DEPARTMENT, ACTION_GET_DEPARTMENTS, ACTION_UPDATE_DEPARTMENT } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import { customSelectTheme } from '../lib/SelectThemes';
import Select from 'react-select';

const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
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
            field: 'internal_action',
            render: (row: department) => (
                <Switch
                    onChange={(event) => handleActivationStatusToggle(event, row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={row.isActive === true}
                />
            )
        }
    ];
    const options = [];
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [deptname, setDeptName] = useState('');
    const [showModal, setModal] = useState(false);
    const [deptId, setDeptId] = useState(null);
    const [hod, setHod] = useState(null);
    const [selectedDeptName, setSelectedDeptName] = useState('');
    const [selectedHoD, setSelectedHoD] = useState(null);
    const [users, setUsers] = useState([]);
    const [isActive, setSelectedStatus] = useState(false);
    const [errorMessages] = useState([]);
    const [, setDisabled] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [rowData, setRowData] = useState<department>();
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: department) => {
        setDisabled(true);
        if (row.isActive) {
            activationStatus = false;
            toggleActivationModal();
            setRowData(row);
        }
        if (!row.isActive) {
            activationStatus = true;
            toggleActivationModal();
            setRowData(row);
        }
    };
    const handleToggleStatusSubmit = (row: department) => {
        const departmentStatus = {
            name: row.name,
            isActive: activationStatus
        };
        timetablingAxiosInstance
            .put(`/departments/${row.id}`, departmentStatus)
            .then(() => {
                const msg = activationStatus ? 'Department activated successfully' : 'Department deactivated successfully';
                alerts.showSuccess(msg);
                setActivationModal(false);
                fetchDepartments();
                setDisabled(false);
            })
            .catch((error) => {
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
                console.log('trainers',res.data);
                setUsers(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);
    users.map((hod) => {
        return options.push({ value: hod.tr_id, label: hod.tr_id });
    });
    const updateDepartment = (deptId, updates) => {
        setLinearDisplay('block');
        console.log('fucking updates object ', updates);
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
                //handle error using logging library
                setLinearDisplay('block');
                console.error(error);
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
                                <MaterialTable
                                    title="Departments"
                                    columns={columns}
                                    data={data}
                                    icons={tableIcons}
                                    options={{ actionsColumnIndex: -1, pageSize: 50 }}
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
                                                        setSelectedStatus(rowData.isActive);
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
                            /><br/>
                        </div>
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-danger" onClick={() => toggleCreateModal()}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={(e) => (deptId ? handleEdit(e) : handleCreate(e))}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
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
                        <p className="text-center">A you sure you want to change the status of <b>{rowData?.name}</b> ?</p>
                        <Button className="btn btn-danger float-left" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button className="btn btn-primary float-right" onClick={() => {
                            handleToggleStatusSubmit(rowData);
                        }}>
                            Confirm
                        </Button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default Department;
