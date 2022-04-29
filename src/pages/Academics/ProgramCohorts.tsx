/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Row, DropdownButton, Dropdown, Col, Modal, Button} from 'react-bootstrap';
import {Switch} from '@material-ui/core';
import {ValidationForm, FileInput, TextInput} from 'react-bootstrap4-form-validation';
import CardPreview from './CardPreview';
import { Link } from 'react-router-dom';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { ProgramCohortService } from '../services/ProgramCohortService';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_PROGRAM_COHORT, ACTION_GET_PROGRAM_COHORTS } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();
import Select from 'react-select';
import { customSelectTheme } from '../lib/SelectThemes';


const ProgramCohorts = (): JSX.Element => {
    interface programCohort {
        program_cohorts_id: number;
        program_cohorts_startDate: string;
        program_cohorts_anticipatedGraduationYear: number;
        program_cohorts_anticipatedGraduationMonth: number;
        program_cohorts_status: string;
        program_cohorts_advertDescription: string;
        pg_name: string;
        program_cohorts_bannerImageUrl: string;
        pg_id: number;
        bannerImageUrl: string;
        program_cohorts_campusId: number;
        cmps_id:number;
        cmps_name:string
    }

    const programOptions = [];
    const campusOptions = [];
    const programAssigned = [];
    const campusAssigned = [];
    const [data, setData] = useState([]);
    const [confirmModal, setConfirmModal] = useState(false);
    const [isError] = useState(false);
    const [, setDisabled] = useState(false);
    const [programId, setProgramId] = useState(0);
    const [campusId, setCampusId] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [banner, setBanner] = useState('');
    const [graduationDate, setGraduationDate] = useState('');
    const [description, setDescription] = useState('');
    const [imageUploaded, setImageUploaded] = useState('');
    const [programs, setPrograms] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [programName, setProgramName] = useState('');
    const [selectedCampusId] = useState(0);
    const [selectedProgramId] = useState(0);
    const [selectedGraduationDate] = useState();
    const [selectedStartDate] = useState();
    const [selectedDescription] = useState();
    const [showModal, setModal] = useState(false);
    const [cohortId, setCohortId] = useState(null);
    const [cohortName, setCohortName] = useState('');
    const [errorMessages] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedProgramCohort, setSelectedProgramCohort] = useState<programCohort>();
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [activationStatus, setStatus] = useState('');
    const year = graduationDate.split('').slice(0, 4).join('');
    const month = graduationDate.slice(5, 7);
    const [activationModal, setActivationModal] = useState(false);
    const [rowData, setRowData] = useState<programCohort>();
    const handleActivationStatusToggle = (event, row: programCohort) => {
        setDisabled(true);
        if (row.program_cohorts_status === 'active') {
            setStatus('canceled');
            toggleActivationModal();
            setRowData(row);
        }
        if (row.program_cohorts_status === 'canceled') {
            setStatus('active');
            toggleActivationModal();
            setRowData(row);
        }
    };
    const handleToggleStatusSubmit = (row: programCohort) => {
        const cohortStatus = {
            status: activationStatus
        };
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/program-cohorts/${row.program_cohorts_id}`, cohortStatus)
            .then(() => {
                const msg =
                    activationStatus === 'canceled' ? 'Successfully Deactivated Program Cohorts' : 'Successfully activated Program Cohort';
                alerts.showSuccess(msg);
                fetchProgramCohorts();
                setDisabled(false);
                setActivationModal(false);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                setDisabled(false);
            });
    };

    const columns = [
        {title: 'ID', field: 'program_cohorts_id'},
        {title: 'Code', field: 'program_cohorts_code'},
        {title: 'Program Name', field: 'pg_name'},
        {title: 'Campus Name', field: 'cmps_name'},
        {title: 'Requires Clearance', field: 'pg_requiresClearance'},
        {title: 'Duration', field: 'pg_duration'},
        {title: 'Certification Type', field: 'pg_certificationType'},
        {title: 'Start Date', render: (rowData) => rowData.program_cohorts_startDate.slice(0, 10)},
        {
            title: 'Anticipated Graduation Date',
            render: (rowData) =>
                rowData.program_cohorts_anticipatedGraduationMonth + '-' + rowData.program_cohorts_anticipatedGraduationYear
        },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: programCohort) => (
                <Switch
                    onChange={(event) => {
                        handleActivationStatusToggle(event, row);
                    }}
                    inputProps={{'aria-label': 'controlled'}}
                    defaultChecked={row.program_cohorts_status !== 'canceled'}
                />
            )
        },
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => (
                <DropdownButton id="dropdown-basic-button" variant="Secondary" title="Actions">
                    <button
                        className="btn btn btn-link"
                        onClick={() => {
                            setCohortId(row.program_cohorts_id);
                            toggleCreateModal();
                            setSelectedProgramCohort(row);
                        }}
                    >
                        <Dropdown.Item>Edit</Dropdown.Item>
                    </button>
                    <button
                        className="btn btn btn-link"
                        onClick={() => {
                            setCohortId(row.program_cohorts_id);
                            setCohortName(row.pg_name);
                            toggleCancelModal();
                            setSelectedProgramCohort(row);
                        }}
                    >
                        <Dropdown.Item>Cancel</Dropdown.Item>
                    </button>
                    <Dropdown.Item>
                        <Link
                            to="/cohortscourses"
                            onClick={() => {
                                localStorage.setItem('programId', row.pg_id);
                                localStorage.setItem('programName', row.pg_name);
                                localStorage.setItem('programCohortId', row.program_cohorts_id);
                                localStorage.setItem('programCohortCode', row.program_cohorts_code);
                                localStorage.setItem(
                                    'anticipatedGraduation',
                                    `${row.program_cohorts_anticipatedGraduationMonth}/${row.program_cohorts_anticipatedGraduationYear}`
                                );
                            }}
                        >
                            View courses
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Link
                            to="/programcohortsemester"
                            onClick={() => {
                                localStorage.setItem('programId', row.pg_id);
                                localStorage.setItem('programName', row.pg_name);
                                localStorage.setItem('semesterId', row.semesterId);
                                localStorage.setItem('programCohortId', row.program_cohorts_id);
                                localStorage.setItem('program_cohort_code', row.program_cohorts_code);
                                localStorage.setItem(
                                    'anticipatedGraduation',
                                    `${row.program_cohorts_anticipatedGraduationMonth}/${row.program_cohorts_anticipatedGraduationYear}`
                                );
                            }}
                        >
                            View semesters
                        </Link>
                    </Dropdown.Item>
                </DropdownButton>
            )
        }
    ];
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/program-cohorts', {params: {loadExtras: 'programs'}})
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        timetablingAxiosInstance
            .get('/programs')
            .then((res) => {
                setPrograms(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        timetablingAxiosInstance
            .get('/campuses')
            .then((res) => {
                setCampuses(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);
    programs.map((prog) => {
        return programOptions.push({value: prog.id, label: prog.name});
    });
    campuses.map((camp) => {
        return campusOptions.push({value: camp.id, label: camp.name});
    });
    const assignedProgram:{ pg_id: number; pg_name: string }[] = [
        {pg_id: selectedProgramCohort?.pg_id, pg_name : selectedProgramCohort?.pg_name},
    ];
    const assignedCampus:{ cmps_id: number; cmps_name: string  }[] = [
        {cmps_id: selectedProgramCohort?.cmps_id, cmps_name : selectedProgramCohort?.cmps_name},
    ];
    assignedProgram.map((prog) => {
        return programAssigned.push({value: prog.pg_id, label: prog.pg_name});
    });
    assignedCampus.map((camp) => {
        return campusAssigned.push({value: camp.cmps_id, label: camp.cmps_name});
    });
    const fetchProgramCohorts = (): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/program-cohorts', {params: {loadExtras: 'programs'}})
            .then((res) => {
                res.data.forEach((program) => {
                    program.name = getProgramName(res.data[0].programId);
                });
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const handleUpload = (): void => {
        const form = new FormData();
        form.append('fileUploaded', imageUploaded);
        const config = {
            headers: {'content-type': 'multipart/form-data'}
        };
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/files', form, config)
            .then((res) => {
                console.log(res.data);
                alerts.showSuccess('successfully uploaded');
                setBanner(res.data);
                setLinearDisplay('none');
                toggleUploadModal();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const updateProgramCohort = (cohortId, updates): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/program-cohorts/${cohortId}`, updates)
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated Cohort');
                fetchProgramCohorts();
                resetStateCloseModal();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const handleEdit = (e): void => {
        e.preventDefault();
        const updates = {
            programId: programId === selectedProgramCohort.pg_id ? selectedProgramCohort.pg_id : selectedProgramId,
            campusId:
                campusId === selectedProgramCohort.program_cohorts_campusId
                    ? selectedProgramCohort.program_cohorts_campusId
                    : selectedCampusId,
            startDate:
                startDate === selectedProgramCohort.program_cohorts_startDate
                    ? selectedProgramCohort.program_cohorts_startDate
                    : selectedStartDate,
            anticipatedGraduationYear: selectedProgramCohort.program_cohorts_anticipatedGraduationYear,
            anticipatedGraduationMonth: selectedProgramCohort.program_cohorts_anticipatedGraduationMonth,
            advertDescription:
                description === selectedProgramCohort.program_cohorts_advertDescription
                    ? selectedProgramCohort.program_cohorts_advertDescription
                    : description,
            bannerImageUrl: banner
        };
        updateProgramCohort(cohortId, updates);
    };
    const handleCreate = (e): void => {
        e.preventDefault();
        const cohort = {
            programId: programId,
            campusId: campusId,
            startDate: startDate,
            anticipatedGraduationYear: year,
            anticipatedGraduationMonth: month,
            advertDescription: description,
            bannerImageUrl: banner
        };
        createCohort(cohort);
    };

    function handleCancellation() {
        const cancelletionData = {
            status: 'canceled'
        };
        ProgramCohortService.cancelProgramCohort(cohortId, cancelletionData)
            .then((res) => {
                console.log(res);
                alerts.showSuccess('Successfully cancelled a program cohort');
                toggleCancelModal();
            })
            .catch((error) => {
                alerts.showError(error.response.data);
                console.log(error);
            });
    }

    const createCohort = (cohortData): void => {
        console.log(cohortData);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/program-cohorts', cohortData)
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully created Program Cohort');
                fetchProgramCohorts();
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };
    const handleProgramChange = (programId) => {
        setProgramId(parseInt(programId.value));
    };
    const handleCampusChange = (campusId) => {
        setCampusId(parseInt(campusId.value));
    };
    const resetStateCloseModal = (): void => {
        setCohortId(null);
        setProgramId(0);
        setCampusId(0);
        setStartDate('');
        setDescription('');
        setBanner('');
        setModal(false);
        setProgramName('');
        setConfirmModal(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const toggleUploadModal = () => {
        showModal ? setShowUploadModal(false) : setShowUploadModal(true);
    };
    const toggleCancelModal = () => {
        cancelModal ? setCancelModal(false) : setCancelModal(true);
    };
    const getProgramName = (id: number): string => {
        return programs
            .filter((program) => {
                return program.id === id;
            })
            .map((name) => name.name)[0];
    };
    const getMonthYear = (month: number, year: number) => {
        const date = new Date(year, month);
        return date.toISOString().slice(0, 7);
    };
    const getProgramCohortFields = (id: number) => {
        return data.filter((dat) => dat.program_cohorts_id === id)[0];
    };
    const toggleActivationModal = () => {
        activationModal ? resetStateCloseModal() : setActivationModal(true);
    };
    const handleCloseModal = () => {
        fetchProgramCohorts();
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
                    <Breadcrumb/>
                </Col>
                <Col>
                    {canPerformActions(ACTION_CREATE_PROGRAM_COHORT.name) && (
                        <Button
                            className="float-right"
                            variant="danger"
                            onClick={() => {
                                toggleCreateModal();
                            }}
                        >
                            Create Program Cohort
                        </Button>
                    )}
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_PROGRAM_COHORTS.name) && (
                <>
                    <LinearProgress style={{display: linearDisplay}}/>
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
                                    title="Program Cohorts"
                                    columns={columns}
                                    data={data}
                                    options={{ actionsColumnIndex: -1}}
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
                    <Modal.Title id="contained-modal-title-vcenter">
                        {cohortId
                            ? `Edit: ${getProgramCohortFields(cohortId).pg_name} ${getProgramCohortFields(cohortId).program_cohorts_code}`
                            : 'Create a Program Cohort'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={8}>
                            <ValidationForm>
                                <div className="form-group">
                                    <label htmlFor="cohortName">
                                        <b>{cohortId ? 'Select a new program for this cohort' : 'Select a program'}</b>
                                    </label>
                                    <Select
                                        theme={customSelectTheme}
                                        defaultValue={programAssigned}
                                        options={programOptions}
                                        isMulti={false}
                                        placeholder="Select a Program."
                                        noOptionsMessage={() => 'No Programs available'}
                                        onChange={handleProgramChange}
                                    /><br/>
                                    <label htmlFor="cohortName">
                                        <b>{cohortId ? 'Select a new campus for this cohort' : 'Select a campus'}</b>
                                    </label>
                                    <Select
                                        theme={customSelectTheme}
                                        defaultValue={campusAssigned}
                                        options={campusOptions}
                                        isMulti={false}
                                        placeholder="Select a Campus."
                                        noOptionsMessage={() => 'No campus available'}
                                        onChange={handleCampusChange}
                                    /><br/>
                                    <label htmlFor="Date">
                                        <b>Start Date</b>
                                    </label>
                                    <br/>
                                    <TextInput
                                        name="startDate"
                                        id="startDate"
                                        type="date"
                                        required
                                        defaultValue={
                                            cohortId ? selectedProgramCohort.program_cohorts_startDate.slice(0, 10) : selectedStartDate
                                        }
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                        }}
                                    />
                                    <br/>
                                    <label htmlFor="Date">
                                        <b>Anticipated Graduation Date</b>
                                    </label>
                                    <br/>
                                    <TextInput
                                        name="graduationDate"
                                        id="graduationDate"
                                        type="month"
                                        required
                                        defaultValue={
                                            cohortId
                                                ? getMonthYear(
                                                    selectedProgramCohort.program_cohorts_anticipatedGraduationMonth,
                                                    selectedProgramCohort.program_cohorts_anticipatedGraduationYear
                                                )
                                                : selectedGraduationDate
                                        }
                                        onChange={(e) => {
                                            setGraduationDate(e.target.value);
                                        }}
                                    />
                                    <br/>
                                    <label htmlFor="cohortName">
                                        <b>Description</b>
                                    </label>
                                    <TextInput
                                        name="description"
                                        minLength="4"
                                        id="description"
                                        defaultValue={
                                            cohortId ? selectedProgramCohort.program_cohorts_advertDescription : selectedDescription
                                        }
                                        type="text"
                                        placeholder={cohortId ? setDescription : description}
                                        required
                                        multiline
                                        rows="3"
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                    />
                                    <br/>
                                    <label htmlFor="cohortName">
                                        <b>Banner Image</b>
                                    </label>
                                    <br/>
                                    <button
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowUploadModal(true);
                                        }}
                                    >
                                        Add image
                                    </button>
                                </div>
                                <input name="banner" id="banner" type="hidden" required value={banner}/>
                                <br/>
                            </ValidationForm>
                            <div className="form-group">
                                <button className="btn btn-info float-right" onClick={toggleConfirmModal}>Submit</button>
                                <button
                                    className="btn btn-danger float-left"
                                    onClick={() => {
                                        toggleCreateModal();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <CardPreview
                                programName={cohortId ? selectedProgramCohort.pg_name : programName}
                                description={cohortId ? selectedProgramCohort.program_cohorts_advertDescription : description}
                                startDate={cohortId ? selectedProgramCohort.program_cohorts_startDate.slice(0, 10) : startDate}
                                graduationDate={
                                    cohortId
                                        ? selectedProgramCohort.program_cohorts_anticipatedGraduationYear +
                                        ' - ' +
                                        selectedProgramCohort.program_cohorts_anticipatedGraduationMonth
                                        : graduationDate
                                }
                                bannerImage={cohortId ? selectedProgramCohort.program_cohorts_bannerImageUrl : banner}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" show={showUploadModal} onHide={toggleUploadModal} size="sm" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <FileInput
                            name="fileUploaded"
                            id="image"
                            encType="multipart/form-data"
                            onChange={(e) => {
                                setImageUploaded(() => {
                                    return e.target.files[0];
                                });
                            }}
                            required
                            fileType={['png', 'jpg', 'jpeg']}
                            maxFileSize="3mb"
                            errorMessage={{
                                required: 'Please upload an image',
                                fileType: 'Only image is allowed',
                                maxFileSize: 'Max file size is 3MB'
                            }}
                        />
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-info btn-rounded" onClick={toggleUploadModal}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            handleUpload();
                        }}
                        variant="btn btn-danger btn-rounded"
                    >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal backdrop="static" show={cancelModal} onHide={toggleCancelModal} size="sm" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel program cohort</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <p className="text-centre">
                            You are about to cancel : {cohortName} Click <b>confirm</b> to proceed
                        </p>
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCancelModal}>
                        Close
                    </Button>
                    <Button
                        variant="btn btn-info btn-rounded"
                        onClick={() => {
                            handleCancellation();
                        }}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
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
                        <p className="text-center">A you sure you want to change the status of {rowData?.pg_name} ?</p>
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
                    <h6 className="text-center">{cohortId
                        ? `A you sure you want to Edit: ${getProgramCohortFields(cohortId).pg_name}`
                        : 'A you sure you want to create a program cohort ?'}</h6>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseConfirmModal}>
                        Continue editing
                    </Button>
                    <button
                        className="btn btn-info float-right"
                        onClick={(e) => {
                            cohortId ? handleEdit(e) : handleCreate(e);
                        }}
                    >
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProgramCohorts;
