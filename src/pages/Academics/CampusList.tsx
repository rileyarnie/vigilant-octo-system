/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Edit from '@material-ui/icons/Edit';
import { LinearProgress, Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_CAMPUS, ACTION_GET_CAMPUSES, ACTION_UPDATE_CAMPUS } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();
const CampusList = (): JSX.Element => {
    interface Campus {
        id: number;
        name: string;
        description: string;
        activation_status: boolean;
        approval_status: boolean;
    }

    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [campusName, setCampusName] = useState('');
    const [description, setDescription] = useState('');
    const [showModal, setModal] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const [campusId, setCampusId] = useState(null);
    const [selectedCampusName, setSelectedCampusName] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('');
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [, setRowData] = useState<Campus>();
    const [, setDisabled] = useState(false);
    let activationStatus: boolean;
    const [, setDisabledButton] = useState(false);
    const [status, setStatus] = useState(false);
    const handleActivationStatusToggle = (event, row: Campus) => {
        setStatus(!row.activation_status);
        setDisabled(true);
    };
    const handleToggleStatusSubmit = (row: Campus) => {
        setDisabledButton(true);
        const campus = {
            activation_status: status
        };
        timetablingAxiosInstance
            .put(`/campuses/${row.id}`, campus)
            .then(() => {
                setDisabledButton(false);
                const msg = activationStatus ? 'Successfully activated campus' : 'Successfully Deactivated campus';
                alerts.showSuccess(msg);
                fetchCampuses();
                setActivationModal(false);
                setDisabled(false);
            })
            .catch((error) => {
                setDisabledButton(false);
                console.error(error);
                alerts.showError(error.message);
                setDisabled(false);
            });
    };

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Campus name', field: 'name' },
        { title: 'Description', field: 'description' },

        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: Campus) =>
                canPerformActions(ACTION_UPDATE_CAMPUS.name) && (
                    <>
                        <Switch
                            defaultChecked={row.activation_status}
                            color="secondary"
                            inputProps={{'aria-label': 'controlled'}}
                            onChange={(event) => {
                                handleActivationStatusToggle(event, row);
                                setRowData(row);
                                toggleActivationModal();
                            }}
                        />
                        <ConfirmationModalWrapper
                            submitButton
                            submitFunction={() => handleToggleStatusSubmit(row)}
                            closeModal={handleCloseModal}
                            show={activationModal}
                        >
                            <h6 className="text-center">
                                A you sure you want to change the status of <>{row.name}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                    // <Switch
                    //     onChange={(event) => handleActivationStatusToggle(event, row)}
                    //     inputProps={{ 'aria-label': 'controlled' }}
                    //     defaultChecked={row.activation_status === true}
                    // />
                )
        }
    ];

    const [errorMessages] = useState([]);
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/campuses')
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);

    const updateCampus = (deptId, updates) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/campuses/${campusId}`, updates)
            .then(() => {
                alerts.showSuccess('Successfully updated Campus');
                fetchCampuses();
                resetStateCloseModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const fetchCampuses = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/campuses')
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const handleAdd = () => {
        // e.preventDefault();
        const campus = {
            name: campusName,
            description: description
        };

        createCampus(campus);
    };
    const handleEdit = () => {
        // e.preventDefault();
        const updates = {
            name: campusName === '' ? selectedCampusName : campusName,
            description: description === '' ? selectedDescription : description
        };
        updateCampus(campusId, updates);
    };
    const createCampus = (campusData) => {
        console.log(campusData);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/campuses', campusData)
            .then(() => {
                alerts.showSuccess('Successfully created Campus');
                fetchCampuses();
                setLinearDisplay('none');
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };
    const resetStateCloseModal = () => {
        setCampusId(null);
        setCampusName('');
        setDescription('');
        setActivationModal(false);
        setModal(false);
        setConfirmModal(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const toggleActivationModal = () => {
        activationModal ? resetStateCloseModal() : setActivationModal(true);
    };
    const handleCloseModal = () => {
        fetchCampuses();
        setActivationModal(false);
    };
    const handleClose = () => {
        showModal ? resetStateCloseModal() : setModal(false);
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
                    {canPerformActions(ACTION_CREATE_CAMPUS.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create Campus
                        </Button>
                    )}
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_CAMPUSES.name) && (
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
                                <TableWrapper
                                    title="Campuses"
                                    columns={columns}
                                    options={{ actionsColumnIndex: -1 }}
                                    data={data}
                                    actions={
                                        canPerformActions(ACTION_UPDATE_CAMPUS.name)
                                            ? [
                                                {
                                                    icon: Edit,
                                                    tooltip: 'Edit Row',
                                                    onClick: (event, row) => {
                                                        setCampusId(row.id);
                                                        setSelectedCampusName(row.name);
                                                        setSelectedDescription(row.description);
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
                show={showModal}
                onHide={toggleCreateModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{campusId ? 'Edit Campus' : 'Create a Campus'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="departmentName">Campus Name</label>
                            <TextInput
                                name="campusName"
                                id="campusName"
                                type="text"
                                value={campusId ? selectedCampusName : campusName}
                                placeholder={campusId ? selectedCampusName : campusName}
                                onChange={(e) => (campusId ? setSelectedCampusName(e.target.value) : setCampusName(e.target.value))}
                                required
                            />
                            <br />
                            <label htmlFor="description">
                                <b>Description</b>
                            </label>
                            <br />
                            <TextInput
                                name="description"
                                minLength="4"
                                id="description"
                                value={campusId ? selectedDescription : description}
                                type="text"
                                placeholder={campusId ? selectedDescription : description}
                                required
                                multiline
                                rows="5"
                                onChange={(e) => (campusId ? setSelectedDescription(e.target.value) : setDescription(e.target.value))}
                            />
                            <br />
                        </div>
                    </ValidationForm>
                    <Col>
                        <button className="btn btn-info float-right" onClick={toggleConfirmModal}>
                            Submit
                        </button>
                        <button className="btn btn-danger float-left" onClick={handleClose}>
                            Close
                        </button>
                    </Col>
                </Modal.Body>
            </Modal>
            <ConfirmationModalWrapper
                submitButton
                submitFunction={campusId ? handleEdit : handleAdd}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <>
                    <h6>
                        {campusId
                            ? `A you sure you want to update ${selectedCampusName} ?`
                            : 'A you sure you want to create a new campus ?'}
                    </h6>
                </>
            </ConfirmationModalWrapper>
        </>
    );
};
export default CampusList;
