/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Card, Col, Modal, Button, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { ValidationForm } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { ACTION_GET_ACTIONS_BY_ROLE_ID, ACTION_GET_ROLES, getAuthnzServiceActions } from '../../authnz-library/authnz-actions';
import { getSimServiceActions } from '../../authnz-library/sim-actions';
import { getFinanceServiceActions } from '../../authnz-library/finance-actions';
import { getTimetablingServiceActions } from '../../authnz-library/timetabling-actions';
import { customSelectTheme } from '../lib/SelectThemes';
import { WorkFlowService } from '../../services/WorkFlowService';
import Select from 'react-select';
import { LinearProgress } from '@material-ui/core';
import { canPerformActions } from '../../services/ActionChecker';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();

const WorkFlows = (): JSX.Element => {
    const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        {
            title: 'Actions',
            render: (row) =>
                canPerformActions(ACTION_GET_ACTIONS_BY_ROLE_ID.name) && (
                    <>
                        <Button
                            className="btn btn-info"
                            size="sm"
                            onClick={() => {
                                setActionName(row.name);
                                fetchActionApprovers(row.name);
                            }}
                        >
                            Create Workflow
                        </Button>
                    </>
                )
        }
    ];
    const options = [];
    const [iserror] = useState(false);
    const [actionName, setActionName] = useState('');
    const [errorMessages] = useState([]);
    const [isMulti] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [showModal, setModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [confirmModal, setConfirmModal] = useState(false);
    const authnzActions = Array.from(getAuthnzServiceActions().values());
    const financeActions = Array.from(getFinanceServiceActions().values());
    const timetableActions = Array.from(getTimetablingServiceActions().values());
    const simsActions = Array.from(getSimServiceActions().values());
    const data = [...authnzActions, ...financeActions, ...timetableActions, ...simsActions];
    useEffect(() => {
        fetchRoles();
    }, []);
    function fetchActionApprovers(actionName: string) {
        setApprovers([]);
        WorkFlowService.fetchActionApprovers(actionName)
            .then((res) => {
                const approvingroles = res['data'];
                const roles = approvingroles.map((it) => {
                    return { value: it.role.id, label: it.role.name };
                });
                setApprovers(roles);
                toggleCreateModal();
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(`We couldn’t fetch the existing approving roles for ${actionName}, reopening the modal should fix this.`);
                toggleCreateModal();
            });
    }
    function fetchRoles() {
        setLinearDisplay('block');
        WorkFlowService.fetchRoles()
            .then((res) => {
                const roles = res['data'];
                setRoles(roles);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    }
    roles.map((role) => {
        return options.push({ value: role.id, label: role.name });
    });
    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };
    function handleSubmitWorkFlow() {
        const approvingRoles = [];
        selectedOptions.forEach((selectedOption, i) => {
            approvingRoles.push({
                rank: i + 1,
                roleId: selectedOption.value
            });
        });
        WorkFlowService.handleSubmitWorkFlow(actionName, approvingRoles)
            .then(() => {
                alerts.showSuccess('Successfully created a workflow');
                toggleCloseConfirmModal();
                handleClose();
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }
    const resetStateCloseModal = () => {
        setModal(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
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
            <div>
                <Row className="align-items-center page-header">
                    <Col>
                        <Breadcrumb />
                    </Col>
                </Row>
                {canPerformActions(ACTION_GET_ROLES.name) && (
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
                                    <TableWrapper title="Work Flows" columns={columns} data={data} options={{}} />
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
            <Modal size="lg" show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Administer Workflow for action <i style={{ fontWeight: 'lighter' }}>{actionName}</i>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <Select
                            theme={customSelectTheme}
                            defaultValue={approvers}
                            options={options}
                            isMulti={isMulti}
                            placeholder="Select roles for this workflow"
                            noOptionsMessage={() => 'No roles available'}
                            onChange={handleChange}
                        />
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-danger float-left" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className="btn btn-info float-right" onClick={toggleConfirmModal}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={confirmModal}
                onHide={toggleConfirmModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header> </Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">
                        A you sure you want to administer workflow for <i style={{ fontWeight: 'lighter' }}>{actionName}</i>?
                    </h6>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseConfirmModal}>
                        Continue editing
                    </Button>
                    <button className="btn btn-info float-right" onClick={handleSubmitWorkFlow}>
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default WorkFlows;
