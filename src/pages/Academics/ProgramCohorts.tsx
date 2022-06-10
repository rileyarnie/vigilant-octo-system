/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Col, Dropdown, DropdownButton, Modal, Row} from 'react-bootstrap';
import {FileInput, TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import CardPreview from './CardPreview';
import {Link} from 'react-router-dom';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import {ProgramCohortService} from '../services/ProgramCohortService';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_CREATE_PROGRAM_COHORT} from '../../authnz-library/timetabling-actions';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import Select from 'react-select';
import {customSelectTheme} from '../lib/SelectThemes';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

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
        program_cohorts_numberOfSlots: number;
        program_cohorts_activationStatus: boolean;
        pg_id: number;
        bannerImageUrl: string;
        program_cohorts_campusId: number;
        cmps_id: number;
        cmps_name: string;
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
    const [selectedGraduationDate] = useState();
    const [selectedDescription] = useState();
    const [numberOfSlots, setNumberOfSlots] = useState(0);
    const [showModal, setModal] = useState(false);
    const [cohortId, setCohortId] = useState(null);
    const [cohortIdCancel, setCohortIdCancel] = useState(null);
    const [cohortName, setCohortName] = useState('');
    const [errorMessages] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedProgramCohort, setSelectedProgramCohort] = useState<programCohort>();
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [activationStatus, setStatus] = useState(false);
    const year = graduationDate.split('').slice(0, 4).join('');
    const month = graduationDate.slice(5, 7);
    const [activationModal, setActivationModal] = useState(false);
    const [selectedRow, setRowData] = useState<programCohort>();
    const [disabledButton, setDisabledButton] = useState(false);


    const handleActivationStatusToggle = (event, row: programCohort) => {
        setDisabled(true);
        if (row.program_cohorts_activationStatus) {
            setStatus(false);
            toggleActivationModal();
        }
        if (row.program_cohorts_activationStatus === false) {
            setStatus(true);
            toggleActivationModal();
        }
    };
    const handleToggleStatusSubmit = () => {
        const cohortStatus = {
            activationStatus: activationStatus
        };
        setDisabledButton(true);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/program-cohorts/${selectedRow.program_cohorts_id}`, cohortStatus)
            .then(() => {
                setDisabledButton(false);
                const msg =
                    !activationStatus ? 'Successfully Deactivated Program Cohorts' : 'Successfully activated Program Cohort';
                alerts.showSuccess(msg);
                fetchProgramCohorts();
                setActivationModal(false);
                setLinearDisplay('none');
            })
            .catch((error) => {
                setDisabledButton(false);
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setRowData(null);
                setDisabled(false);
            });
    };

    const columns = [
        { title: 'ID', field: 'program_cohorts_id' },
        { title: 'Code', field: 'program_cohorts_code' },
        { title: 'Program Name', field: 'pg_name' },
        { title: 'Campus Name', field: 'cmps_name' },
        { title: 'Requires Clearance', field: 'pg_requiresClearance' },
        { title: 'Duration', field: 'pg_duration' },
        { title: 'Certification Type', field: 'pg_certificationType' },
        { title: 'Start Date', render: (rowData) => rowData.program_cohorts_startDate.slice(0, 10) },
        {
            title: 'Anticipated Graduation Date',
            render: (rowData) =>
                rowData.program_cohorts_anticipatedGraduationMonth + '-' + rowData.program_cohorts_anticipatedGraduationYear
        },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: programCohort) => (
                <>
                    <CustomSwitch
                        defaultChecked={row.program_cohorts_activationStatus}
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
                        submitFunction={() => handleToggleStatusSubmit()}
                        closeModal={handleCloseModal}
                        show={activationModal}
                    >
                        <h6 className="text-center">
                            A you sure you want to change the status of <>{selectedRow ? selectedRow.pg_name : ''}</> ?
                        </h6>
                    </ConfirmationModalWrapper>
                </>
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
                            setBanner(row.program_cohorts_bannerImageUrl);
                        }}
                    >
                        <Dropdown.Item>Edit</Dropdown.Item>
                    </button>
                    <button
                        className="btn btn btn-link"
                        onClick={() => {
                            setCohortIdCancel(row.program_cohorts_id);
                            setCohortName(row.pg_name);
                            toggleCancelModal();
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
            .get('/program-cohorts', { params: { loadExtras: 'programs', includeDeactivated: true } })
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
        timetablingAxiosInstance
            .get('/programs', { params: { loadExtras: 'courses' } })
            .then((res) => {
                setPrograms(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
        timetablingAxiosInstance
            .get('/campuses')
            .then((res) => {
                setCampuses(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);
    programs.map((prog) => {
        const pgSelectionLabel = `${prog.name} (${prog.courses?.length || 0})`;
        return programOptions.push({ value: prog.id, label: pgSelectionLabel, isDisabled: prog.courses?.length > 0 ?
            false : true        
        });
    });
    campuses.map((camp) => {
        return campusOptions.push({ value: camp.id, label: camp.name });
    });
    const assignedProgram: { pg_id: number; pg_name: string }[] = [
        { pg_id: selectedProgramCohort?.pg_id, pg_name: selectedProgramCohort?.pg_name }
    ];
    const assignedCampus: { cmps_id: number; cmps_name: string }[] = [
        { cmps_id: selectedProgramCohort?.cmps_id, cmps_name: selectedProgramCohort?.cmps_name }
    ];
    assignedProgram.map((prog) => {
        return programAssigned.push({ value: prog.pg_id, label: prog.pg_name });
    });
    assignedCampus.map((camp) => {
        return campusAssigned.push({ value: camp.cmps_id, label: camp.cmps_name });
    });
    const fetchProgramCohorts = (): void => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/program-cohorts', { params: { loadExtras: 'programs', includeDeactivated: true } })
            .then((res) => {
                res.data.forEach((program) => {
                    program.name = getProgramName(res.data[0].programId);
                });
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
                setLinearDisplay('none');
            });
    };
    const handleUpload = (): void => {
        setLinearDisplay('block');
        const form = new FormData();
        form.append('fileUploaded', imageUploaded);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        timetablingAxiosInstance
            .post('/files', form, config)
            .then((res) => {
                alerts.showSuccess('successfully uploaded');
                setBanner(res.data);
                setLinearDisplay('none');
                toggleUploadModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };

    const updateProgramCohort = (cohortId, updates): void => {
        setLinearDisplay('block');
        setDisabledButton(true);
        timetablingAxiosInstance
            .put(`/program-cohorts/${cohortId}`, updates)
            .then(() => {
                alerts.showSuccess('Successfully updated Cohort');
                fetchProgramCohorts();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                resetStateCloseModal();
                setLinearDisplay('none');
                setDisabledButton(false);
            });
    };
    const handleEdit = (e): void => {
        e.preventDefault();
        const updates = {
            programId: programId === 0 ? selectedProgramCohort.pg_id : programId,
            campusId: campusId === 0 ? selectedProgramCohort.program_cohorts_campusId : campusId,
            startDate: startDate === '' ? selectedProgramCohort.program_cohorts_startDate : startDate,
            anticipatedGraduationYear: year === '' ? selectedProgramCohort.program_cohorts_anticipatedGraduationYear : year,
            anticipatedGraduationMonth: month === '' ? selectedProgramCohort.program_cohorts_anticipatedGraduationMonth : month,
            advertDescription: description === '' ? selectedProgramCohort.program_cohorts_advertDescription : description,
            bannerImageUrl: banner,
            numberOfSlots: numberOfSlots === 0 ? selectedProgramCohort.program_cohorts_numberOfSlots : numberOfSlots
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
            bannerImageUrl: banner,
            numberOfSlots: numberOfSlots
        };
        createCohort(cohort);
    };

    /**
     * Handle cancellation of program cohort
     */
    function handleCancellation() {
        setLinearDisplay('block');
        const cancellationData = {
            status: 'canceled'
        };

        ProgramCohortService.cancelProgramCohort(cohortIdCancel, cancellationData)
            .then(() => {
                alerts.showSuccess('Successfully cancelled a program cohort');
            }).catch((error) => {
                alerts.showError(error.response.data);
            }).finally(() => {
                setLinearDisplay('none');
                setCohortIdCancel(null);
                setCohortName('');
                toggleCancelModal();
                toggleCloseConfirmModal();
            });
    }

    const createCohort = (cohortData): void => {
        setLinearDisplay('block');
        setDisabledButton(true);
        timetablingAxiosInstance
            .post('/program-cohorts', cohortData)
            .then(() => {
                resetStateCloseModal();
                alerts.showSuccess('Successfully created Program Cohort');
                fetchProgramCohorts();
            })
            .catch((error) => {
                resetStateCloseModal();
                alerts.showError(error.message);
                setLinearDisplay('none');
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisabledButton(false);
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
                    <Breadcrumb />
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
                            <TableWrapper title="Program Cohorts" columns={columns} data={data} options={{ actionsColumnIndex: -1 }} />
                        </Card>
                    </Col>
                </Row>
            </>
            <ModalWrapper
                noFooter
                show={showModal}
                closeModal={toggleCreateModal}
                modalSize="lg"
                title={
                    cohortId
                        ? `Edit: ${getProgramCohortFields(cohortId).pg_name} ${getProgramCohortFields(cohortId).program_cohorts_code}`
                        : 'Create a Program Cohort'
                }
            >
                <Row>
                    <Col sm={8}>
                        <ValidationForm onSubmit={(e) => { e.preventDefault();toggleConfirmModal();}}>
                            <div className="form-group">
                                <label htmlFor="cohortName">
                                    <b>{cohortId ? 'Select a program' : 'Select a new program for this cohort'}<span className="text-danger">*</span></b>
                                </label>
                                <Select
                                    theme={customSelectTheme}
                                    defaultValue={programAssigned}
                                    options={programOptions}
                                    isMulti={false}
                                    placeholder="Select a Program."
                                    noOptionsMessage={() => 'No Programs available'}
                                    onChange={(e) => handleProgramChange(e)}                 
                                />

                                
                                <br />
                                <label htmlFor="cohortName">
                                    <b>{cohortId ? 'Select a campus' : 'Select a new campus for this cohort'}<span className="text-danger">*</span></b>
                                </label>
                                <Select
                                    theme={customSelectTheme}
                                    defaultValue={campusAssigned}
                                    options={campusOptions}
                                    isMulti={false}
                                    placeholder="Select a Campus."
                                    noOptionsMessage={() => 'No campus available'}
                                    onChange={(e) => handleCampusChange(e)}
                                />
                                <br />
                                <label htmlFor="Date">
                                    <b>Start Date<span className="text-danger">*</span></b>
                                </label>
                                <br />
                                <TextInput
                                    name="startDate"
                                    id="startDate"
                                    type="date"
                                    required
                                    defaultValue={cohortId ? selectedProgramCohort.program_cohorts_startDate.slice(0, 10) : startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                    }}
                                />
                                <br />
                                <label htmlFor="Date">
                                    <b>Anticipated Graduation Date<span className="text-danger">*</span></b>
                                </label>
                                <br />
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
                                <br />
                                <label htmlFor="cohortName">
                                    <b>Description<span className="text-danger">*</span></b>
                                </label>
                                <TextInput
                                    name="description"
                                    minLength="4"
                                    id="description"
                                    defaultValue={cohortId ? selectedProgramCohort.program_cohorts_advertDescription : selectedDescription}
                                    type="text"
                                    placeholder={cohortId ? setDescription : description}
                                    required
                                    multiline
                                    rows="3"
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                />
                                <br />
                                <label htmlFor="numOfSlots">
                                    <b>Number of slots<span className="text-danger">*</span></b>
                                </label>
                                <TextInput
                                    name="numberOfSlots"
                                    id="numberOfSlots"
                                    defaultValue={cohortId ? selectedProgramCohort.program_cohorts_numberOfSlots : numberOfSlots}
                                    type="text"
                                    placeholder={'number Of slots'}
                                    required
                                    onChange={(e) => {
                                        setNumberOfSlots(e.target.value);
                                    }}
                                />
                                <br />
                                <label htmlFor="cohortName">
                                    <b>Banner Image<span className="text-danger">*</span></b>
                                </label>
                                <br />
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
                            <input name="banner" id="banner" type="hidden" required value={banner} />
                            <br />
                            <div className="form-group">
                                <button className="btn btn-info float-right">
                                    Submit
                                </button>
                                <button className="btn btn-danger float-left" onClick={(e) => { e.preventDefault();toggleCreateModal();}}>
                                    Cancel
                                </button>
                            </div>
                        </ValidationForm>
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
                            bannerImage={banner}
                        />
                    </Col>
                </Row>
            </ModalWrapper>
            <Modal backdrop="static" show={showUploadModal} onHide={toggleUploadModal} size="sm" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add image</Modal.Title>                   
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div style={{fontSize:'12px'}}>Allowed files: jpg jpeg, png upto 5mb</div>
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
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            <ModalWrapper show={cancelModal} closeModal={toggleCancelModal} modalSize="md" title="Cancel program cohort" submitButton submitFunction={handleCancellation}>
                <ValidationForm>
                    <p className="text-centre">
                        You are about to cancel : {cohortName} Click <b>confirm</b> to proceed
                    </p>
                </ValidationForm>
            </ModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabledButton}
                submitButton
                submitFunction={(e) => {
                    cohortId ? handleEdit(e) : handleCreate(e);
                }}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">
                    {cohortId
                        ? `Are you sure you want to Edit: ${getProgramCohortFields(cohortId).pg_name}`
                        : 'Are you sure you want to create a program cohort ?'}
                </h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default ProgramCohorts;
