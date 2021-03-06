/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Edit from '@material-ui/icons/Edit';
import {LinearProgress} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, Modal, Row} from 'react-bootstrap';
import {TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_CREATE_CAMPUS, ACTION_UPDATE_CAMPUS} from '../../authnz-library/timetabling-actions';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import CustomSwitch from '../../assets/switch/CustomSwitch';

const alerts: Alerts = new ToastifyAlerts();
const CampusList = (): JSX.Element => {
    interface Campus {
        id: number;
        name: string;
        description: string;
        activationStatus: boolean;
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
    const [selectedRow, setSelectedRow] = useState<Campus>();
    const [selectedDescription, setSelectedDescription] = useState('');
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [, setDisabled] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const [status, setStatus] = useState(false);
    const handleActivationStatusToggle = (event, row: Campus) => {
        setStatus(!row.activationStatus);
        setDisabled(true);
    };
    const handleToggleStatusSubmit = () => {
        setDisabledButton(true);
        setLinearDisplay('block');
        const campus = {
            activationStatus: status
        };
        timetablingAxiosInstance
            .put(`/campuses/${selectedRow.id}`, campus)
            .then(() => {
                setDisabledButton(false);
                const msg = campus.activationStatus ? 'Successfully activated campus' : 'Successfully Deactivated campus';
                alerts.showSuccess(msg);
                fetchCampuses();
                setActivationModal(false);
                setSelectedRow(null);
                setLinearDisplay('none');
                setDisabled(false);
            })
            .catch((error) => {
                setDisabledButton(false);
                console.error(error);
                alerts.showError(error.message);
                setDisabled(false);
                setLinearDisplay('none');
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
                        <CustomSwitch
                            defaultChecked={row.activationStatus}
                            color="secondary"
                            inputProps={{ 'aria-label': 'controlled' }}
                            checked={row.activationStatus}
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
                                Are you sure you want to change the status of <>{!selectedRow ? '' : selectedRow.name}</> ?
                            </h6>
                        </ConfirmationModalWrapper>
                    </>
                )
        }
    ];

    const [errorMessages] = useState([]);
    useEffect(() => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/campuses', { params: { includeDeactivated: true } })
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }, []);

    const updateCampus = (deptId, updates) => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .put(`/campuses/${campusId}`, updates)
            .then(() => {
                alerts.showSuccess('Successfully updated Campus');
                fetchCampuses();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabledButton(false);
                setLinearDisplay('block');
                resetStateCloseModal();
            });
    };
    const fetchCampuses = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/campuses', { params: { includeDeactivated: true } })
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    const handleAdd = () => {
        const campus = {
            name: campusName,
            description: description
        };

        createCampus(campus);
    };
    const handleEdit = () => {
        const updates = {
            name: campusName === '' ? selectedCampusName : campusName,
            description: description === '' ? selectedDescription : description
        };
        updateCampus(campusId, updates);
    };
    const createCampus = (campusData) => {
        setDisabledButton(true);
        setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/campuses', campusData)
            .then(() => {
                alerts.showSuccess('Successfully created Campus');
                fetchCampuses();
                resetStateCloseModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabledButton(false);
                setLinearDisplay('none');
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
                    <ValidationForm onSubmit={(e) => { e.preventDefault();toggleConfirmModal();}}>
                        <div className="form-group">
                            <label htmlFor="departmentName"><b>Campus Name<span className="text-danger">*</span></b></label>
                            <TextInput
                                name="campusName"
                                id="campusName"
                                type="text"
                                required
                                value={campusId ? selectedCampusName : campusName}
                                placeholder={campusId ? selectedCampusName : campusName}
                                onChange={(e) => (campusId ? setSelectedCampusName(e.target.value) : setCampusName(e.target.value))}
                            />
                            <br/>
                            <label htmlFor="description"><b>Description<span className="text-danger">*</span></b></label>
                            <br/>
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
                            <br/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info float-right">Submit</button>
                            <button className="btn btn-danger float-left" onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
            <ConfirmationModalWrapper disabled={disabledButton}
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
