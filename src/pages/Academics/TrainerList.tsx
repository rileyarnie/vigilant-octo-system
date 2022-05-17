/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Department from '../services/Department';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { ValidationForm, SelectGroup } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_TRAINER, ACTION_UPDATE_TRAINER } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import { customSelectTheme, trainerTypes } from '../lib/SelectThemes';
import Select from 'react-select';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import { DepartmentService } from '../services/DepartmentService';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';

const alerts: Alerts = new ToastifyAlerts();

const TrainerList = (): JSX.Element => {
    const [switchStatus, setSwitchStatus] = useState<boolean>();
    const [activationModal, setActivationModal] = useState(false);
    const [selectedRow, setselectedRow] = useState<{ tr_id: number }>();
    const handleCloseActivationModal = () => {
        setActivationModal(false);
    };

    const updateTrainer = (trainerId, updates) => {
        setDisabled(true);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .patch(`/trainers/${trainerId}`, updates)
            .then(() => {
                alerts.showSuccess('Successfully updated trainer');
                fetchTrainers();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setActivationModal(false);
                setDisabled(false);
            });
    };
    const columns = [
        { title: 'ID', field: 'tr_id', hidden: false },
        { title: 'Trainer AADAlias', render: (rowData) => rowData.stf_email },
        { title: 'Trainer type', field: 'tr_trainerType' },
        { title: 'Department ID', field: 'tr_departmentId' },
        {
            title: ' Actions',
            render: (row: { tr_departmentId: number; tr_trainerType: string; tr_id: number; tr_staffId: number; stf_name: string }) => (
                <DropdownButton id="dropdown-basic-button" variant="Secondary" title="Actions">
                    {canPerformActions(ACTION_UPDATE_TRAINER.name) && (
                        <div
                            className=""
                            onClick={() => {
                                console.log('row', row);
                                setSelectedDept(departments.filter((department) => department.id === row.tr_departmentId)[0]);
                                setSelectedTrainer(row);
                                setSelectedTrainerId(row.tr_id);
                                setTrainerType(row.tr_trainerType);
                                setSelectedStaffId(row.tr_staffId);

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
                                // toggleDeleteModal();
                                setTrainerId(row.tr_id);
                                handleDelete(row.tr_id);
                            }}
                        >
                            <Dropdown.Item>Remove trainer</Dropdown.Item>
                        </div>
                    )}
                </DropdownButton>
            )
        },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row) => (
                <>
                    <CustomSwitch
                        defaultChecked={row.tr_activationStatus}
                        color="secondary"
                        inputProps={{ 'aria-label': 'controlled' }}
                        checked={row.tr_activationStatus}
                        onChange={(event) => {
                            setselectedRow(row);
                            setActivationModal(true);
                            setSwitchStatus(event.target.checked);
                        }}
                    />
                    <ConfirmationModalWrapper
                        disabled={disabled}
                        submitButton
                        submitFunction={() => updateTrainer(selectedRow?.tr_id, { activationStatus: switchStatus })}
                        closeModal={handleCloseActivationModal}
                        show={activationModal}
                    >
                        <h6 className="text-center">
                            Are you sure you want to change the status of Trainer Id: <>{selectedRow?.tr_id}</> ?
                        </h6>
                    </ConfirmationModalWrapper>
                </>
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
    const [selectedDept, setSelectedDept] = useState<{ id: number; name: string }>();
    const [trainerType, setTrainerType] = useState('');
    const [showModal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [errorMessages] = useState([]);
    const [trainerId, setTrainerId] = useState(0);
    const [selectedTrainerId, setSelectedTrainerId] = useState<string | number>('');
    const [selectedTrainer, setSelectedTrainer] = useState<{
        tr_departmentId: number | string;
        tr_trainerType: string;
        tr_id: number | string;
        tr_staffId: number | string;
        stf_name: string;
    }>();
    const [selectedStaffId, setSelectedStaffId] = useState<number | string>('');
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showCantDeleteModal, setCantDeleteModal] = useState(false);
    const [departmentsWithHoDTrainer, setDepartmentsWithHoDTrainer] = useState<Department>();
    const [disabled, setDisabled] = useState(false);

    const [user, setUser] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/trainers', { params: { includeDeactivated: true } })
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
        return staffOptions.push({ value: staff.id, label: staff.name });
    });
    departments.map((dept) => {
        return departmentOptions.push({ value: dept.id, label: dept.name });
    });
    trainerTypes.map((tt) => {
        return trainerTypeOptions.push({ value: tt.value, label: tt.label });
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
        setDisabled(true);
        e.preventDefault();
        const trainer = {
            staffId: user,
            departmentId: department,
            trainerType: trainerType
        };
        createTrainer(trainer);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setLinearDisplay('block');
        const updates = {
            staffId: selectedStaffId,
            departmentID: selectedDept?.id,
            trainerType: trainerType
        };

        editTrainer(updates, selectedTrainerId);
    };

    const handleDelete = async (trainerId: number) => {
        try {
            const departmentsWithHoDTrainer = await DepartmentService.getDepartmentByHODTrainerId(trainerId);
            setDepartmentsWithHoDTrainer(departmentsWithHoDTrainer);
            if (departmentsWithHoDTrainer) {
                toggleCantDeleteModal();
                return;
            }
            toggleDeleteModal();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // eslint disabled: TS Message => Catch clause variable type annotation must be 'any' or 'unknown' if specified.
            console.log('error', error);
            alerts.showError(error.message);
        }
    };

    const createTrainer = (trainerData) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/trainers', trainerData)
            .then(() => {
                alerts.showSuccess('Trainer created successfully');
                fetchTrainers();
                setModal(false);
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabled(false);
                setLinearDisplay('none');
                setConfirmModal(false);
            });
    };

    const editTrainer = (updates, trainerId) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .patch(`/trainers/${trainerId}`, updates)
            .then(() => {
                alerts.showSuccess('Succesfully edited trainer');
                fetchTrainers();
                toggleEditModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setConfirmModal(false);
                setDisabled(false);
                setLinearDisplay('none');
            });
    };

    const deleteTrainer = (trainerId: number) => {
        setDisabled(true);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .delete(`trainers/${trainerId}`)
            .then(() => {
                alerts.showSuccess('Succesfully removed trainer');
                toggleDeleteModal();
                fetchTrainers();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                toggleDeleteModal();
                setDisabled(false);
                setLinearDisplay('none');
            });
    };

    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const handleCloseModal = () => {
        setModal(false);
    };

    const handleEditStaff = (selectedStaff) => {
        setSelectedStaffId(parseInt(selectedStaff.value));
    };

    const handleChange = (selectedDept) => {
        setSelectedDept(selectedDept);
    };

    const handleTrainerType = (trainerTyp) => {
        console.log('trainerType', trainerType);
        setTrainerType(trainerTyp.value);
    };
    const toggleEditModal = () => {
        if (showEditModal) {
            setEditModal(false);
            setSelectedDept({ name: '', id: 0 });
            setSelectedTrainer({ stf_name: '', tr_departmentId: '', tr_id: '', tr_staffId: '', tr_trainerType: '' });
            setSelectedTrainerId('');
            setTrainerType('');
            setSelectedStaffId(0);
        } else {
            setEditModal(true);
        }
    };
    const toggleCantDeleteModal = () => {
        showCantDeleteModal ? setCantDeleteModal(false) : setCantDeleteModal(true);
    };
    const toggleDeleteModal = () => {
        showDeleteModal ? setDeleteModal(false) : setDeleteModal(true);
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
            <ModalWrapper show={showModal} closeModal={toggleCreateModal} modalSize="lg" title="Create a trainer" noFooter>
                <ValidationForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        toggleConfirmModal();
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="user">
                            Select staff<span className="text-danger">*</span>
                        </label>
                        <SelectGroup
                            defaultValue={user}
                            name="user"
                            id="user"
                            required
                            onChange={(e) => {
                                setUser(e.target.value);
                            }}
                            errorMessage="Please select a user"
                        >
                            <option value="">- Please select -</option>
                            {staffOptions.map((staffOption) => (
                                <option key={staffOption.value} value={staffOption.value}>
                                    {staffOption.label}
                                </option>
                            ))}
                        </SelectGroup>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">
                            Select a department<span className="text-danger">*</span>
                        </label>
                        <SelectGroup
                            defaultValue={department}
                            name="department"
                            id="department"
                            required
                            onChange={(e) => {
                                setDepartment(e.target.value);
                            }}
                            errorMessage="Please select a department"
                        >
                            <option value="">- Please select -</option>
                            {departmentOptions.map((departmentOption) => (
                                <option key={departmentOption.value} value={departmentOption.value}>
                                    {departmentOption.label}
                                </option>
                            ))}
                        </SelectGroup>
                    </div>
                    <div>
                        <label htmlFor="trainerType">
                            Select a trainer type<span className="text-danger">*</span>
                        </label>
                        <SelectGroup
                            defaultValue={trainerType}
                            name="trainerType"
                            id="trainerType"
                            required
                            onChange={(e) => {
                                setTrainerType(e.target.value);
                            }}
                            errorMessage="Please select trainer type"
                        >
                            <option value="">- Please select -</option>
                            {trainerTypeOptions.map((trainerTypeOption) => (
                                <option key={trainerTypeOption.value} value={trainerTypeOption.value}>
                                    {trainerTypeOption.label}
                                </option>
                            ))}
                        </SelectGroup>
                    </div>
                    <Col className="mt-4">
                        <button className="btn btn-danger float-left" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button className="btn btn-info float-right">Submit</button>
                    </Col>
                </ValidationForm>
            </ModalWrapper>
            <ModalWrapper title="Edit Trainer" show={showEditModal} closeModal={toggleEditModal} modalSize="lg" noFooter>
                <ValidationForm>
                    <div className="form-group">
                        <label htmlFor="staff">
                            Select a staff<span className="text-danger">*</span>
                        </label>
                        <Select
                            theme={customSelectTheme}
                            defaultValue={{ value: selectedTrainer?.tr_staffId, label: selectedTrainer?.stf_name }}
                            options={staffOptions}
                            isMulti={false}
                            placeholder="Select a staff."
                            noOptionsMessage={() => 'No staff available'}
                            onChange={handleEditStaff}
                        />
                        <br />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">
                            Select a department<span className="text-danger">*</span>
                        </label>
                        <Select
                            theme={customSelectTheme}
                            defaultValue={{ value: selectedDept?.id, label: selectedDept?.name }}
                            options={departmentOptions}
                            isMulti={false}
                            placeholder="Select a department."
                            noOptionsMessage={() => 'No Departments available'}
                            onChange={handleChange}
                        />
                        <br />
                    </div>

                    <div className="form-group">
                        <label htmlFor="trainerType">
                            Select Trainer type<span className="text-danger">*</span>
                        </label>
                        <Select
                            theme={customSelectTheme}
                            defaultValue={{ value: trainerType, label: trainerType }}
                            options={trainerTypeOptions}
                            isMulti={false}
                            placeholder="Select trainer type."
                            noOptionsMessage={() => 'No types available'}
                            onChange={handleTrainerType}
                        />
                        <br />
                    </div>
                </ValidationForm>
                <button className="btn btn-danger float-left" onClick={toggleEditModal}>
                    Close
                </button>
                <button className="btn btn-info float-right" onClick={toggleConfirmModal}>
                    Submit
                </button>
            </ModalWrapper>
            <ModalWrapper show={showCantDeleteModal} title="Remove Trainer" modalSize="lg" closeModal={toggleCantDeleteModal}>
                <p>Please change the HoD for {departmentsWithHoDTrainer?.name} before attempting to remove this trainer</p>
            </ModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabled}
                title="Remove trainer"
                submitButton
                submitFunction={() => deleteTrainer(trainerId)}
                closeModal={toggleDeleteModal}
                show={showDeleteModal}
            >
                <p>
                    Are you sure you want to remove this trainer? Removing the trainer will remove them from all courses and course-cohorts
                    that they are assigned to
                </p>{' '}
            </ConfirmationModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={(e) => (selectedTrainer?.stf_name ? handleEdit(e) : handleSubmit(e))}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <p>
                    {selectedTrainer?.stf_name
                        ? `Are you sure you want to edit trainer ${selectedTrainer?.stf_name}?`
                        : 'Are you sure you want to create a new trainer'}
                </p>
            </ConfirmationModalWrapper>
        </>
    );
};
export default TrainerList;
