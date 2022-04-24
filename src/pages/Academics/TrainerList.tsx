/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
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
import TableWrapper from '../../utlis/TableWrapper';
import { customSelectTheme, trainerTypes } from '../lib/SelectThemes';
import Select from 'react-select';

const alerts: Alerts = new ToastifyAlerts();

// enum TrainerType {
//     Lecturer = 'LECTURER',
//     Trainer = 'TRAINER',
//     Assistant = 'ASSISTANT'
// }

const TrainerList = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'tr_id', hidden: false },
        { title: 'Trainer AADAlias', render: (rowData) => rowData.stf_email },
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
                                console.log('trainer row', row);
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
    const staffOptions = [];
    const departmentOptions = [];
    const trainerTypeOptions = [];
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [staff, setStaff] = useState([]);
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

        timetablingAxiosInstance
            .get('/staff')
            .then((res) => {
                setStaff(res.data);
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
    staff.map((staff) => {
        return staffOptions.push({value: staff.id, label: staff.email});
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
            staffId: selectedUser,
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

    const handleDelete = async (trainerId: number) => {
        const departmentsWithHoDTrainer = await DepartmentService.getDepartmentByHODTrainerId(trainerId);
        console.log(departmentsWithHoDTrainer);
        setDepartmentsWithHoDTrainer(departmentsWithHoDTrainer);
        if (departmentsWithHoDTrainer) {
            toggleCantDeleteModal();
            return;
        }
        toggleDeleteModal();
    };

    const deleteTrainer = (trainerId: number) => {
        setLinearDisplay('block');
        timetablingAxiosInstance.delete(`trainers/${trainerId}`).then(() => {
            alerts.showSuccess('Succesfully removed trainer');
            toggleDeleteModal();
            fetchTrainers();
            setLinearDisplay('none');
        });
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
                            <TableWrapper title="Trainers" columns={columns} data={data} editable={{}} options={{}} />
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
                            <label htmlFor="user">Select staff</label>
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={staffOptions}
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
                    <button className="btn btn-danger float-left">Close</button>
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
                    <p>Please change the HoD for {departmentsWithHoDTrainer?.name} before attempting to remove this trainer</p>

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
                        Are you sure you want to remove this trainer? Removing the trainer will remove them from all courses and
                        course-cohorts that they are assigned to
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
