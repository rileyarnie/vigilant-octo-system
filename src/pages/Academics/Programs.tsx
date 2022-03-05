/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
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
import axios from 'axios';
import { Icons } from 'material-table';
import { Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Config from '../../config';
import { Link } from 'react-router-dom';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_PROGRAM, ACTION_GET_PROGRAMS } from '../../authnz-library/timetabling-actions';

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
const Programs = (): JSX.Element => {
    const timetablingSrv = Config.baseUrl.timetablingSrv;

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

    const [programName, setProgramName] = useState('');
    const [description, setDescription] = useState('');
    const [prerequisiteDocumentation, setPrerequisiteDocumentation] = useState('');
    const [requiresClearance, setRequiresClearance] = useState('');
    const [certificationType, setCertificationType] = useState('');
    const [duration, setDuration] = useState('');
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [showModal, setModal] = useState(false);
    const [, setProgramId] = useState(null);
    const [, setDisabled] = useState(false);
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: Program) => {
        setDisabled(true);
        if (row.activation_status) {
            activationStatus = false;
            handleToggleStatusSubmit(event, row);
        }
        if (!row.activation_status) {
            activationStatus = true;
            handleToggleStatusSubmit(event, row);
        }
    };
    const handleToggleStatusSubmit = (e, row: Program) => {
        const program = {
            activation_status: activationStatus
        };
        setLinearDisplay('block');
        axios
            .put(`${timetablingSrv}/programs/${row.id}`, program)
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
            render: (row) => (
                <Link to={'/assigncourses'} onClick={() => localStorage.setItem('programId', row.id)}>
                    <button className="btn btn btn-link">Assign courses</button>
                </Link>
            )
        },
        {
            title: 'View courses',
            field: 'internal_action',
            render: (row) => (
                <Link to={'/programcourses'} onClick={() => localStorage.setItem('programId', row.id)}>
                    <button className="btn btn btn-link">View courses</button>
                </Link>
            )
        }
    ];
    const [errorMessages] = useState([]);
    useEffect(() => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/programs`)
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);

    const fetchPrograms = () => {
        setLinearDisplay('block');
        axios
            .get(`${timetablingSrv}/programs`)
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
            prerequisiteDocumentation: prerequisiteDocumentation,
            requiresClearance: requiresClearance,
            certificationType: certificationType,
            duration: duration
        };

        createProgram(program);
    };
    const createProgram = (programData) => {
        setLinearDisplay('block');
        axios
            .post(`${timetablingSrv}/programs`, programData)
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
        setModal(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const handleClose = () => setModal(false);
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
                                <MaterialTable
                                    title="Programs"
                                    columns={columns}
                                    data={data}
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    icons={tableIcons}
                                />
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
                                rows="1"
                                value={prerequisiteDocumentation}
                                onChange={(e) => setPrerequisiteDocumentation(e.target.value)}
                                type="textarea"
                                placeholder="Enter prerequisite documentation separate with ,"
                            />
                            <br />
                            <label htmlFor="certificationType">
                                <b>CertificationType</b>
                            </label>
                            <br />
                            <SelectGroup
                                name="certificationType"
                                value={certificationType}
                                onChange={(e) => setCertificationType(e.target.value)}
                                required
                                errorMessage="Please select CertificationType."
                            >
                                <option value="">--- Please select ---</option>
                                <option value="Degree">Degree</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Certificate">Certificate</option>
                            </SelectGroup>
                            <br />
                            <br />
                            <label htmlFor="requiresClearance">
                                <b>Requires Clearance</b>
                            </label>
                            <br />
                            <SelectGroup
                                name="requiresClearance"
                                value={requiresClearance}
                                id="requiresClearance"
                                onChange={(e) => setRequiresClearance(e.target.value)}
                            >
                                <option value="">--- Please select ---</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </SelectGroup>
                            <br />
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
                        <div className="form-group">
                            <button className="btn btn-primary float-right" onClick={(e) => handleCreate(e)}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-danger" onClick={handleClose}>
                        Close
                    </button>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default Programs;
