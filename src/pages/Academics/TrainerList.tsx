/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable, { Icons } from 'material-table';
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
import Department from '../services/Department';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Modal, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { ValidationForm} from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_TRAINER, ACTION_UPDATE_TRAINER } from '../../authnz-library/timetabling-actions';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import { DepartmentService } from '../services/DepartmentService';
import { customSelectTheme, trainerTypes } from '../lib/SelectThemes';
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
const TrainerList = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'tr_id', hidden: false },
        { title: 'Trainer AADAlias', render: (rowData) => getAADAlias(rowData.tr_userId) },
        { title: 'Trainer type', field: 'tr_trainerType' },
        { title: 'Department ID', field: 'tr_departmentId' },
        {
            title: ' Actions',
            render: (row:{tr_departmentId:number, tr_trainerType:string, tr_id:number}) => (
                <DropdownButton id="dropdown-basic-button" variant="Secondary" title="Actions">
                    {canPerformActions(ACTION_UPDATE_TRAINER.name) && (
                        <div
                            className=""
                            onClick={() => {
                                console.log('trainer row',row);
                                setDept(row.tr_departmentId);
                                setTrainerType(row.tr_trainerType);
                                toggleEditModal();
                            }}
                        >
                            <Dropdown.Item>Edit trainer</Dropdown.Item>
                        </div>
                    )}
                    {canPerformActions(ACTION_UPDATE_TRAINER.name) && (
                        <div
                            className=""
                            onClick={() => {
                                setTrainerId(row.tr_id);
                                handleDelete(row.tr_id);
                            }}
                        >
                            <Dropdown.Item>Remove trainer</Dropdown.Item>
                        </div>
                    )}
                </DropdownButton>
            )
        }
    ];
    const userOptions = [];
    const departmentOptions = [];
    const trainerTypeOptions = [];
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedUser, setSelectedUser] = useState(0);
    const [selectedDept, setDept] = useState<number>();
    const [trainerType, setTrainerType] = useState<string>();
    const [showModal, setModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [errorMessages] = useState([]);
    const [trainerId, setTrainerId] = useState(0);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showCantDeleteModal, setCantDeleteModal] = useState(false);
    const [departmentsWithHoDTrainer, setDepartmentsWithHoDTrainer] = useState<Department>();
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/trainers')
            .then((res) => {
                setLinearDisplay('none');
                console.log(res.data);
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });

        authnzAxiosInstance
            .get('/users')
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.log('Error: ' + error);
                alerts.showError(error.message);
            });

        timetablingAxiosInstance
            .get('/departments')
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);
    users.map((user) => {
        return userOptions.push({value: user.id, label: user.aadAlias});
    });
    departments.map((dept) => {
        return departmentOptions.push({value: dept.id, label: dept.name});
    });
    trainerTypes.map((tt) => {
        return trainerTypeOptions.push({value: tt.value, label: tt.label});
    });
    const fetchTrainers = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/trainers')
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trainer = {
            userId: selectedUser,
            departmentId: selectedDept,
            trainerType: trainerType
        };
        createTrainer(trainer);
    };

    const createTrainer = (trainerData) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/trainers', trainerData)
            .then(() => {
                alerts.showSuccess('Trainer created successfully');
                fetchTrainers();
                setModal(false);
                setLinearDisplay('none');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleDelete = async (trainerId:number) => {
        const departmentsWithHoDTrainer = await DepartmentService.getDepartmentByHODTrainerId(trainerId);
        console.log(departmentsWithHoDTrainer);
        setDepartmentsWithHoDTrainer(departmentsWithHoDTrainer);
        if (departmentsWithHoDTrainer) {
            toggleCantDeleteModal();
            return;
        }
        toggleDeleteModal();
    };

    const deleteTrainer = (trainerId:number) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .delete(`trainers/${trainerId}`)
            .then(() => {
                alerts.showSuccess('Succesfully removed trainer');
                toggleDeleteModal();
                fetchTrainers();
                setLinearDisplay('none');
            });
    };

    const getAADAlias = (id: number) => {
        return users.filter((user) => user.id === id).map((user) => user.aadAlias)[0];
    };
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const handleCloseModal = () => {
        setModal(false);
    };
    const handleChange = (selectedDept) => {
        setDept(parseInt(selectedDept));
    };
    const handleUser = (selectedUser) => {
        setSelectedUser(selectedUser);
    };
    const handleTrainerType = (trainerTyp) => {
        setTrainerType(trainerTyp);
    };
    const toggleEditModal = () => {
        showEditModal ? setEditModal(false) : setEditModal(true);
    };
    const toggleCantDeleteModal = () => {
        showCantDeleteModal ? setCantDeleteModal(false) : setCantDeleteModal(true);
    };
    const toggleDeleteModal = () => {
        showDeleteModal ? setDeleteModal(false) : setDeleteModal(true);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    {canPerformActions(ACTION_CREATE_TRAINER.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create trainer
                        </Button>
                    )}
                </Col>
            </Row>

            <LinearProgress style={{ display: linearDisplay }} />
            <Row>
                <Col>
                    {canPerformActions(ACTION_CREATE_TRAINER.name) && (
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
                            <MaterialTable
                                title="Trainers"
                                columns={columns}
                                data={data}
                                icons={tableIcons}
                                editable={{}}
                                options={{ pageSize: 50 }}
                            />
                        </Card>
                    )}
                </Col>
            </Row>
            <Modal
                show={showModal}
                onHide={toggleCreateModal}
                onBackdropClick={toggleCreateModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Create a trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="user">Select a user</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={userOptions}
                                isMulti={false}
                                placeholder="Select a user."
                                noOptionsMessage={() => 'No users available'}
                                isClearable
                                onChange={handleUser}
                            /><br/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Select a department</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={departmentOptions}
                                isMulti={false}
                                isClearable
                                placeholder="Select a department."
                                noOptionsMessage={() => 'No department available'}
                                onChange={handleChange}
                            /><br/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="trainerType">Select Trainer type</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={trainerTypeOptions}
                                isMulti={false}
                                isClearable
                                placeholder="Select trainer type."
                                noOptionsMessage={() => 'No types available'}
                                onChange={handleTrainerType}
                            /><br/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary float-right" onClick={(e) => handleSubmit(e)}>
                                Submit
                            </button>
                        </div>
                        <button className="btn btn-danger float-left" onClick={handleCloseModal}>
                            Cancel
                        </button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
            <Modal
                show={showEditModal}
                onHide={toggleEditModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Edit Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="department">Select a department</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={departmentOptions}
                                isMulti={false}
                                placeholder="Select a Program."
                                noOptionsMessage={() => 'No Programs available'}
                                onChange={handleChange}
                            /><br/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="trainerType">Select Trainer type</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={trainerTypeOptions}
                                isMulti={false}
                                placeholder="Select trainer type."
                                noOptionsMessage={() => 'No types available'}
                                onChange={handleTrainerType}
                            /><br/>
                        </div>

                    </ValidationForm>
                    <button className="btn btn-danger float-left" >
                        Close
                    </button>
                </Modal.Body>
            </Modal>
            <Modal
                show={showCantDeleteModal}
                onHide={toggleCantDeleteModal}
                size="lg"
                backdrop="static"
                onBackdropClick={toggleCantDeleteModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remove trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                          Please change the HoD for {departmentsWithHoDTrainer?.name} before attempting to remove this trainer
                    </p>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => toggleCantDeleteModal()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
            <Modal
                show={showDeleteModal}
                onHide={toggleDeleteModal}
                size="lg"
                backdrop="static"
                onBackdropClick={toggleDeleteModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remove trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                    Are you sure you want to remove this trainer? Removing the trainer will remove them from all courses and course-cohorts that they are assigned to
                    </p>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => toggleDeleteModal()}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => deleteTrainer(trainerId)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default TrainerList;
