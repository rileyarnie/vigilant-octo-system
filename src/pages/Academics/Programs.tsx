/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TextInput, ValidationForm } from 'react-bootstrap4-form-validation';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_ASSIGN_COURSE_TO_PROGRAM, ACTION_CREATE_PROGRAM, ACTION_GET_PROGRAMS } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import { certType, customSelectTheme, selectOptions } from '../lib/SelectThemes';
import Select from 'react-select';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import { LinearProgress, MenuItem, Select as MUISelect } from '@material-ui/core';

const alerts: Alerts = new ToastifyAlerts();

const Programs = (): JSX.Element => {
    interface Program {
        name?: string;
        id?: number;
        codePrefix: string;
        description?: string;
        prerequisiteDocumentation?: number;
        requiresClearance?: boolean;
        certificationType?: string;
        activationStatus?: boolean;
        approval_status?: boolean;
        duration?: string;
        department: { name: string };
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
    const [selectedRow, setSelectedRow] = useState<Program>();
    const [, setProgramId] = useState(null);
    const [, setDisabled] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState();
    let activationStatus: boolean;
    const [disabledButton, setDisabledButton] = useState(false);
    const [status, setStatus] = useState(false);
    const [programDetailsModal, setProgramDetailsModal] = useState(false);

    const handleActivationStatusToggle = (event, row: Program) => {
        setStatus(!row.activationStatus);
    };
    const handleToggleStatusSubmit = () => {
        const program = {
            activationStatus: status
        };
        setDisabledButton(true);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/programs/${selectedRow.id}`, program)
            .then(() => {
                const msg = activationStatus ? 'Successfully activated program' : 'Successfully Deactivated program';
                alerts.showSuccess(msg);
                setSelectedRow(null);
                fetchPrograms();
                toggleCloseConfirmModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabled(false);
                setLinearDisplay('none');
                setDisabledButton(false);
            });
    };

    const columns = [
        {
            title: 'Code',
            render: (row) => `${row.codePrefix}-${row.id}`
        },
        { title: 'Program Name', field: 'name' },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: Program) => (
                <>
                    <CustomSwitch
                        defaultChecked={row.activationStatus}
                        color="secondary"
                        inputProps={{ 'aria-label': 'controlled' }}
                        onChange={(event) => {
                            handleActivationStatusToggle(event, row);
                            setSelectedRow(row);
                            toggleActivationModal();
                        }}
                    />
                    <ConfirmationModalWrapper
                        disabled={disabledButton}
                        submitButton
                        submitFunction={() => handleToggleStatusSubmit()}
                        closeModal={handleCloseModal}
                        show={activationModal}
                    >
                        <h6 className="text-center">
                            A you sure you want to change the status of <>{!selectedRow ? '' : selectedRow.name}</> ?
                        </h6>
                    </ConfirmationModalWrapper>
                </>
            )
        },
        {
            title: 'Actions',
            render: (row) => (
                <MUISelect defaultValue="" value="" labelId="demo-simple-select-label" id="demo-simple-select" style={{ width: 100 }}>
                    {canPerformActions(ACTION_GET_PROGRAMS.name) && (
                        <MenuItem
                            value="assignCourses"
                            onClick={() => {
                                setSelectedRow(row);
                                toggleProgramDetailsModal();
                            }}
                        >
                            View Program Details
                        </MenuItem>
                    )}
                    {canPerformActions(ACTION_ASSIGN_COURSE_TO_PROGRAM.name) && (
                        <Link to={'/assigncourses'} onClick={() => localStorage.setItem('programId', row.id)} style={{ color: 'black' }}>
                            <MenuItem value="assignCourses">Assign Courses</MenuItem>
                        </Link>
                    )}
                    {canPerformActions(ACTION_GET_PROGRAMS.name) && (
                        <Link to={'/programcourses'} onClick={() => {localStorage.setItem('programId', row.id);localStorage.setItem('programName', row.name);}} style={{ color: 'black' }}>
                            <MenuItem value="viewCourses">View Courses</MenuItem>
                        </Link>
                    )}
                </MUISelect>
            )
        }
    ];
    const [errorMessages] = useState([]);
    useEffect(() => {
        setLinearDisplay('block');
        fetchPrograms();
        timetablingAxiosInstance
            .get('/departments')
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);
    departments.map((dept) => {
        return departmentOptions.push({ value: dept.id, label: dept.name });
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
            .get('/programs', { params: { includeDeactivated: true, loadExtras: 'departments' } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
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
        setDisabledButton(true);
        timetablingAxiosInstance
            .post('/programs', programData)
            .then(() => {
                alerts.showSuccess('Program created succesfully');
                fetchPrograms();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisabledButton(false);
                resetStateCloseModal();
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

    const toggleProgramDetailsModal = () => setProgramDetailsModal(!programDetailsModal);
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
            <ModalWrapper show={showModal} closeModal={toggleCreateModal} modalSize="lg" title="Create a program" noFooter>
                <ValidationForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        toggleConfirmModal();
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="name">
                            <b>
                                Program Name<span className="text-danger">*</span>
                            </b>
                        </label>
                        <TextInput
                            name="name"
                            id="name"
                            value={programName}
                            required
                            type="text"
                            placeholder="Enter name"
                            onChange={(e) => setProgramName(e.target.value)}
                        />
                        <br />
                        <label htmlFor="description">
                            <b>
                                Description<span className="text-danger">*</span>
                            </b>
                        </label>
                        <TextInput
                            name="description"
                            id="desc"
                            multiline
                            rows="3"
                            required
                            type="text"
                            value={description}
                            placeholder="enter description"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <br />
                        <label htmlFor="cou">
                            <b>
                                Prerequisite Documentation<span className="text-danger">*</span>
                            </b>
                        </label>
                        <TextInput
                            name="prerequisiteDocumentation"
                            id="prerequisiteDocumentation"
                            multiline
                            rows="3"
                            required
                            value={prerequisiteDocumentation}
                            onChange={(e) => setPrerequisiteDocumentation(e.target.value)}
                            type="textarea"
                            placeholder="Enter prerequisite documentation separate with ,"
                        />
                        <br />
                        <label htmlFor="certificationType">
                            <b>
                                Certification Type<span className="text-danger">*</span>
                            </b>
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
                        />
                        <br />
                        <label htmlFor="tiimetablelable">
                            <b>
                                Department<span className="text-danger">*</span>
                            </b>
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
                        />
                        <br />
                        <label htmlFor="requiresClearance">
                            <b>
                                Requires Clearance<span className="text-danger">*</span>
                            </b>
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
                        />
                        <br />
                        <br />
                        <label htmlFor="duration">
                            <b>
                                Program duration<span className="text-danger">*</span>
                            </b>
                        </label>
                        <br />
                        <TextInput
                            name="duration"
                            value={duration}
                            required
                            id="programDuration"
                            type="textarea"
                            placeholder="Enter program duration e.g 4w2d"
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <br />
                        <br />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-info float-right">Submit</button>
                        <button className="btn btn-danger float-left" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </ValidationForm>
            </ModalWrapper>
            <ModalWrapper
                title={`Program Details for ${selectedRow?.name}`}
                modalSize="lg"
                closeModal={toggleProgramDetailsModal}
                show={programDetailsModal}
            >
                <Row>
                    <div className="col-md-12">
                        <ListGroup>
                            <ListGroup.Item>Program Code: {`${selectedRow?.codePrefix}-${selectedRow?.id}`}</ListGroup.Item>
                            <ListGroup.Item>Program Name: {`${selectedRow?.name}`}</ListGroup.Item>
                            <ListGroup.Item>Program Name: {`${selectedRow?.department?.name}`}</ListGroup.Item>
                            <ListGroup.Item>Certification Type: {`${selectedRow?.certificationType}`}</ListGroup.Item>
                            <ListGroup.Item>Program Duration: {`${selectedRow?.duration}`}</ListGroup.Item>
                            <ListGroup.Item>Requires Clearance: {`${selectedRow?.requiresClearance ? 'Yes' : 'No'}`}</ListGroup.Item>
                            <ListGroup.Item>Program Description: {`${selectedRow?.description}`}</ListGroup.Item>
                        </ListGroup>
                    </div>
                </Row>
            </ModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabledButton}
                submitButton
                submitFunction={(e) => handleCreate(e)}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">
                    A you sure you want to create <b>program :</b> <i>{programName}</i> ?
                </h6>
            </ConfirmationModalWrapper>
        </>
    );
};
export default Programs;
