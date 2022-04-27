/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import { useState, useEffect } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_ASSIGN_COURSE_TO_PROGRAM, ACTION_CREATE_PROGRAM, ACTION_GET_PROGRAMS } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import { customSelectTheme, selectOptions, certType } from '../lib/SelectThemes';
import Select from 'react-select';
const alerts: Alerts = new ToastifyAlerts();

const Programs = (): JSX.Element => {
    interface Program {
        name: string;
        id: number;
        description: string;
        prerequisiteDocumentation: number;
        requiresClearance: boolean;
        certificationType: string;
        activation_status: boolean;
        approval_status: boolean;
        duration: string;
    }

    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const departmentOptions = [];
    const selectionOptions = [];
    const certificationTypes = [];
    const [confirmModal, setConfirmModal] = useState(false);
    const [programName, setProgramName] = useState('');
    const [description, setDescription] = useState('');
    const [prerequisiteDocumentation, setPrerequisiteDocumentation] = useState('');
    const [requiresClearance, setRequiresClearance] = useState('');
    const [certificationType, setCertificationType] = useState('');
    const [duration, setDuration] = useState('');
    const [departments, setDepartments] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [showModal, setModal] = useState(false);
    const [, setProgramId] = useState(null);
    const [, setDisabled] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const [rowData, setRowData] = useState<Program>();
    const [selectedDepartment, setSelectedDepartment] = useState();
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: Program) => {
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
    const handleToggleStatusSubmit = (row: Program) => {
        const program = {
            activation_status: activationStatus
        };
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/programs/${row.id}`, program)
            .then(() => {
                const msg = activationStatus ? 'Successfully activated program' : 'Successfully Deactivated program';
                setLinearDisplay('none');
                alerts.showSuccess(msg);
                fetchPrograms();
                setDisabled(false);
            })
            .catch((error) => {
                setLinearDisplay('block');
                console.error(error);
                alerts.showError(error.message);
                setDisabled(false);
                setLinearDisplay('none');
            });
    };

    const columns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Program Name', field: 'name' },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: Program) => (
                <Switch
                    onChange={(event) => handleActivationStatusToggle(event, row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={row.activation_status === true}
                />
            )
        },
        {
            title: 'Assign courses',
            field: 'internal_action',
            render: (row) =>
                canPerformActions(ACTION_ASSIGN_COURSE_TO_PROGRAM.name) && (
                    <Link to={'/assigncourses'} onClick={() => localStorage.setItem('programId', row.id)}>
                        <button className="btn btn btn-link">Assign courses</button>
                    </Link>
                )
        },
        {
            title: 'View courses',
            field: 'internal_action',
            render: (row) =>
                canPerformActions(ACTION_GET_PROGRAMS.name) && (
                    <Link to={'/programcourses'} onClick={() => localStorage.setItem('programId', row.id)}>
                        <button className="btn btn btn-link">View courses</button>
                    </Link>
                )
        }
    ];
    const [errorMessages] = useState([]);
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/programs')
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });

        timetablingAxiosInstance
            .get('/departments')
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);
    departments.map((dept) => {
        return departmentOptions.push({value: dept.id, label: dept.name});
    });
    selectOptions.map((sel) => {
        return selectionOptions.push({ value: sel.value, label: sel.label });
    });
    certType.map((sel) => {
        return certificationTypes.push({ value: sel.value, label: sel.label });
    });
    const fetchPrograms = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/programs')
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const handleCreate = (e) => {
        e.preventDefault();
        const program = {
            name: programName,
            description: description,
            departmentId: selectedDepartment,
            prerequisiteDocumentation: prerequisiteDocumentation,
            requiresClearance: requiresClearance,
            certificationType: certificationType,
            duration: duration
        };

        createProgram(program);
    };
    const createProgram = (programData) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/programs', programData)
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Program created succesfully');
                fetchPrograms();
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };
    const resetStateCloseModal = () => {
        setProgramId(null);
        setProgramName('');
        setDescription('');
        setPrerequisiteDocumentation('');
        setRequiresClearance('');
        setCertificationType('');
        setDuration('');
        setConfirmModal(false);
        setModal(false);
    };
    const handleChange = (selectedDepartment) => {
        setSelectedDepartment(selectedDepartment.value);
    };
    const handleClearance = (requiresClearance) => {
        setRequiresClearance(requiresClearance.value);
    };
    const handleCertType = (certType) => {
        setCertificationType(certType.value);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const toggleActivationModal = () => {
        activationModal ? resetStateCloseModal() : setActivationModal(true);
    };
    const handleCloseModal = () => {
        fetchPrograms();
        setActivationModal(false);
    };
    const handleClose = () => setModal(false);
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
                    {canPerformActions(ACTION_CREATE_PROGRAM.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create Program
                        </Button>
                    )}
                </Col>
            </Row>

            {canPerformActions(ACTION_GET_PROGRAMS.name) && (
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
                                <TableWrapper title="Programs" columns={columns} data={data} options={{}} />
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
                    <Modal.Title id="contained-modal-title-vcenter">Create a Program</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="name">
                                <b>Program Name</b>
                            </label>
                            <TextInput
                                name="name"
                                id="name"
                                value={programName}
                                type="text"
                                placeholder="Enter name"
                                onChange={(e) => setProgramName(e.target.value)}
                            />
                            <br />
                            <label htmlFor="description">
                                <b>Description</b>
                            </label>
                            <TextInput
                                name="description"
                                id="desc"
                                multiline
                                rows="3"
                                type="text"
                                value={description}
                                placeholder="enter description"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <br />
                            <label htmlFor="cou">
                                <b>Prerequisite Documentation</b>
                            </label>
                            <TextInput
                                name="prerequisiteDocumentation"
                                id="prerequisiteDocumentation"
                                multiline
                                rows="3"
                                value={prerequisiteDocumentation}
                                onChange={(e) => setPrerequisiteDocumentation(e.target.value)}
                                type="textarea"
                                placeholder="Enter prerequisite documentation separate with ,"
                            />
                            <br />
                            <label htmlFor="certificationType">
                                <b>Certification Type</b>
                            </label>
                            <br />
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={certificationTypes}
                                isMulti={false}
                                isClearable
                                placeholder="Please select CertificationType."
                                noOptionsMessage={() => 'No types available'}
                                onChange={handleCertType}
                            /><br/>
                            <label htmlFor="tiimetablelable">
                                <b>Department</b>
                            </label>
                            <br />
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
                            <label htmlFor="requiresClearance">
                                <b>Requires Clearance</b>
                            </label>
                            <br />
                            <Select
                                theme={customSelectTheme}
                                defaultValue=""
                                options={selectionOptions}
                                isMulti={false}
                                isClearable
                                placeholder="Please select"
                                noOptionsMessage={() => 'No option available'}
                                onChange={handleClearance}
                            /><br/>
                            <br />
                            <label htmlFor="duration">
                                <b>Program duration</b>
                            </label>
                            <br />
                            <TextInput
                                name="duration"
                                value={duration}
                                id="programDuration"
                                type="textarea"
                                placeholder="Enter program duration e.g 4w2d"
                                onChange={(e) => setDuration(e.target.value)}
                            />
                            <br />
                            <br />
                        </div>
                    </ValidationForm>
                    <Col>
                        <button className="btn btn-info float-right" onClick={toggleConfirmModal}>
                            Submit
                        </button>
                        <button className="btn btn-danger float-danger" onClick={handleClose}>
                            Close
                        </button>
                    </Col>
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
            <Modal
                show={confirmModal}
                onHide={toggleConfirmModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>{' '}</Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">A you sure you want to create <b>program :</b> <i>{programName}</i> ?</h6>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseConfirmModal}>
                        Continue editing
                    </Button>
                    <button className="btn btn-info float-right" onClick={(e) => handleCreate(e)}>
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default Programs;
