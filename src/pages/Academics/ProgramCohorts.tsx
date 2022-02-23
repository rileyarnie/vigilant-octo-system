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
import { Icons } from 'material-table';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import Config from '../../config';
import { MenuItem, Select, Switch } from '@material-ui/core';
import { ValidationForm, SelectGroup, FileInput, TextInput } from 'react-bootstrap4-form-validation';
import CardPreview from './CardPreview';
import { Link } from 'react-router-dom';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { ProgramCohortService } from '../services/ProgramCohortService';
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
const ProgramCohorts = (): JSX.Element => {
    interface programCohort {
        program_cohorts_id: number;
        program_cohorts_startDate: string;
        program_cohorts_anticipatedGraduationYear: number;
        program_cohorts_anticipatedGraduationMonth: number;
        program_cohorts_isActive: boolean;
        program_cohorts_advertDescription: string;
        pg_name: string;
        program_cohorts_bannerImageUrl: string;
        pg_id: number;
        program_cohorts_campusId: number;
    }

    const [data, setData] = useState([]);
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
    const [campus, setCampus] = useState([]);
    const [programName, setProgramName] = useState('');
    const [selectedCampusId, setSelectedCampusId] = useState(0);
    const [selectedProgramId, setSelectedProgramId] = useState(0);
    const [selectedGraduationDate] = useState();
    const [selectedStartDate] = useState();
    const [selectedDescription] = useState();
    const [showModal, setModal] = useState(false);
    const [cohortId, setCohortId] = useState(null);
    const [cohortName, setCohortName] = useState('');
    const [programCohortId, setProgramCohortId] = useState(0);
    const [errorMessages] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedProgramCohort, setSelectedProgramCohort] = useState<programCohort>();
    const [linearDisplay, setLinearDisplay] = useState('none');
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const year = graduationDate.split('').slice(0, 4).join('');
    const month = graduationDate.slice(5, 7);
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: programCohort) => {
        setDisabled(true);
        if (row.program_cohorts_isActive) {
            activationStatus = false;
            handleToggleStatusSubmit(event, row);
        }
        if (!row.program_cohorts_isActive) {
            activationStatus = true;
            handleToggleStatusSubmit(event, row);
        }
    };
    const handleToggleStatusSubmit = (e, row: programCohort) => {
        const cohortStatus = {
            isActive: activationStatus
        };
        setLinearDisplay('block');
        axios
            .put(`${timetablingSrv}/program-cohorts/${row.program_cohorts_id}`, cohortStatus)
            .then(() => {
                const msg = activationStatus ? 'Successfully Deactivated Program Cohorts' : 'Successfully activated Program Cohort';
                alerts.showSuccess(msg);
                fetchProgramCohorts();
                setDisabled(false);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
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
                <Switch
                    onChange={(event) => {
                        handleActivationStatusToggle(event, row);
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={!row.program_cohorts_isActive}
                />
            )
        },
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => (
                <Select>
                    <button
                        className="btn btn btn-link"
                        onClick={() => {
                            setCohortId(row.program_cohorts_id);
                            toggleCreateModal();
                            setSelectedProgramCohort(row);
                        }}
                    >
                        <MenuItem value="Edit">Edit</MenuItem>
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
                        <MenuItem value="Cancel">Cancel</MenuItem>
                    </button>
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
                        <MenuItem value="View courses">View courses</MenuItem>
                    </Link>
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
                        <MenuItem value="View semesters">View semesters</MenuItem>
                    </Link>
                </Select>
            )
        }
    ];
    useEffect(() => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/program-cohorts`, { params: { loadExtras: 'programs' } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        axios
            .get(`${timetablingSrv}/programs`)
            .then((res) => {
                setPrograms(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
        axios
            .get(`${timetablingSrv}/campuses`)
            .then((res) => {
                setCampus(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);
    const fetchProgramCohorts = (): void => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/program-cohorts`, { params: { loadExtras: 'programs' } })
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
            headers: { 'content-type': 'multipart/form-data' }
        };
        setLinearDisplay('block');
        axios
            .post(`${timetablingSrv}/files`, form, config)
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
        axios
            .put(`${timetablingSrv}/program-cohorts/${cohortId}/`, updates)
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
            campusId: campusId === selectedProgramCohort.program_cohorts_campusId ? selectedProgramCohort.program_cohorts_campusId : selectedCampusId,
            startDate: startDate === selectedProgramCohort.program_cohorts_startDate ? selectedProgramCohort.program_cohorts_startDate : selectedStartDate,
            anticipatedGraduationYear: selectedProgramCohort.program_cohorts_anticipatedGraduationYear,
            anticipatedGraduationMonth: selectedProgramCohort.program_cohorts_anticipatedGraduationMonth,
            advertDescription: description === selectedProgramCohort.program_cohorts_advertDescription ? selectedProgramCohort.program_cohorts_advertDescription : description,
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
        // console.log(typeof cohort.programId);
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
        axios
            .post(`${timetablingSrv}/program-cohorts`, cohortData)
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
    const resetStateCloseModal = (): void => {
        setCohortId(null);
        setProgramId(0);
        setCampusId(0);
        setStartDate('');
        setDescription('');
        setBanner('');
        setModal(false);
        setProgramName('');
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
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button
                        className="float-right"
                        variant="danger"
                        onClick={() => {
                            toggleCreateModal();
                        }}
                    >
                        Create Program Cohort
                    </Button>
                </Col>
            </Row>
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
                        <MaterialTable
                            title="Program Cohorts"
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            options={{ actionsColumnIndex: -1 }}
                        />
                    </Card>
                </Col>
            </Row>
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
                                    <SelectGroup
                                        name="program"
                                        id="program"
                                        required
                                        errorMessage="Please select a Program."
                                        onChange={(e) => {
                                            setSelectedProgramId(e.target.value);
                                            setProgramId(parseInt(e.target.value));
                                        }}
                                    >
                                        <option defaultValue={cohortId ? selectedProgramCohort.pg_id : selectedProgramId} value="">
                                            -- Select a program --
                                        </option>
                                        {programs.map((program) => {
                                            return (
                                                <option key={program.name} value={program.id}>
                                                    {program.name}
                                                </option>
                                            );
                                        })}
                                    </SelectGroup>
                                    <br />
                                    <label htmlFor="cohortName">
                                        <b>{cohortId ? 'Select a new campus for this cohort' : 'Select a campus'}</b>
                                    </label>
                                    <SelectGroup
                                        name="campus"
                                        id="campus"
                                        required
                                        errorMessage="Please select a Program."
                                        onChange={(e) => {
                                            setSelectedCampusId(e.target.value);
                                            setCampusId(parseInt(e.target.value));
                                        }}
                                    >
                                        <option defaultValue={cohortId ? selectedProgramCohort.pg_id : selectedCampusId} value="">
                                            -- Select a Campus --
                                        </option>
                                        {campus.map((campus) => {
                                            return (
                                                <option key={campus.name} value={campus.id}>
                                                    {campus.name}
                                                </option>
                                            );
                                        })}
                                    </SelectGroup>
                                    <br />
                                    <label htmlFor="Date">
                                        <b>Start Date</b>
                                    </label>
                                    <br />
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
                                    <br />
                                    <label htmlFor="Date">
                                        <b>Anticipated Graduation Date</b>
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
                                    <br />
                                    <label htmlFor="cohortName">
                                        <b>Banner Image</b>
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
                                    <button
                                        className="btn btn-primary float-right"
                                        onClick={(e) => {
                                            cohortId ? handleEdit(e) : handleCreate(e);
                                        }}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="btn btn-danger float-left"
                                        onClick={() => {
                                            toggleCreateModal();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </ValidationForm>
                        </Col>
                        <Col sm={4}>
                            <CardPreview
                                programName={programName}
                                description={description}
                                startDate={startDate}
                                graduationDate={graduationDate}
                                bannerImage={banner}
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
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
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
        </>
    );
};

export default ProgramCohorts;
