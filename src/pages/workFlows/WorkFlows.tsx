/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { ACTION_GET_ACTIONS_BY_ROLE_ID, ACTION_GET_ROLES, getAuthnzServiceActions } from '../../authnz-library/authnz-actions';
import { getSimServiceActions } from '../../authnz-library/sim-actions';
import { getFinanceServiceActions } from '../../authnz-library/finance-actions';
import { getTimetablingServiceActions } from '../../authnz-library/timetabling-actions';
import { WorkFlowService } from '../../services/WorkFlowService';
import { LinearProgress } from '@material-ui/core';
import { canPerformActions } from '../../services/ActionChecker';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
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

    const modalColumns = [
        { title: 'ID', field: 'id' },
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' }
    ];
    const options = [];
    const [iserror] = useState(false);
    const [actionName, setActionName] = useState('');
    const [errorMessages] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [confirmLinearDisplay, setConfirmLinearDisplay] = useState('none');
    const [showModal, setModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [confirmModal, setConfirmModal] = useState(false);
    const authnzActions = Array.from(getAuthnzServiceActions().values());
    const financeActions = Array.from(getFinanceServiceActions().values());
    const timetableActions = Array.from(getTimetablingServiceActions().values());
    const simsActions = Array.from(getSimServiceActions().values());
    const data = [...authnzActions, ...financeActions, ...timetableActions, ...simsActions];
    const [disabled, setDisabled] = useState(false);
    const [defaultValuesId, setDefaultValuesId] = useState([]);
    const [defaultCheckedRows, setDefaultCheckedRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    function fetchActionApprovers(actionName: string) {
        setLinearDisplay('block');
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
            .catch(() => {
                alerts.showError(`We couldn’t fetch the existing approving roles for ${actionName}, kindly try again.`);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    }

    function fetchRoles() {
        setLinearDisplay('block');
        WorkFlowService.fetchRoles()
            .then((res) => {
                const roles = res['data'];
                setRoles(roles);
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    }

    roles.map((role) => {
        return options.push({ value: role.id, label: role.name });
    });

    const getDefaultChecked = (data, defaultValuesId) => {
        const defaultChecked = [];
        if (data.length <= 0 || defaultValuesId <= 0) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (defaultValuesId.indexOf(element.id) > -1) {
                defaultChecked.push({ ...element, tableData: { checked: true } });
            } else {
                defaultChecked.push(element);
            }
        }
        return setDefaultCheckedRows(defaultChecked);
    };

    useEffect(() => {
        getDefaultChecked(roles, defaultValuesId);
    }, [roles, defaultValuesId]);

    useEffect(() => {
        setDefaultValuesId(approvers.map((item) => item.value));
    }, [roles, approvers]);

    const handleRowSelection = (rows) => {
        const roleIds = rows.map((row) => ({ rank: row.id, roleId: row.id }));
        const uniq = [...new Set(roleIds)];
        setSelectedRows(uniq);
    };

    function handleSubmitWorkFlow() {
        setDisabled(true);
        setLinearDisplay('block');
        setConfirmLinearDisplay('block');
        toggleCloseConfirmModal();
        WorkFlowService.handleSubmitWorkFlow(actionName, selectedRows)
            .then(() => {
                alerts.showSuccess('Successfully created a workflow');
                handleClose();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setModal(false);
                setDisabled(false);
                setLinearDisplay('none');
                setConfirmLinearDisplay('none');
                setConfirmModal(false);
                resetStateCloseModal();
            });
    }
    const resetStateCloseModal = () => {
        setModal(false);
        setConfirmModal(false);
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
                    <LinearProgress style={{ display: confirmLinearDisplay }} />
                    <TableWrapper
                        title={`Assign actions to ${actionName}`}
                        columns={modalColumns}
                        data={defaultCheckedRows}
                        options={{
                            selection: true,
                            showSelectAllCheckbox: false,
                            showTextRowsSelected: false
                        }}
                        onSelectionChange={(rows) => handleRowSelection(rows)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button disabled={disabled} className="btn btn-danger float-left" onClick={handleClose}>
                            Close
                        </Button>
                        <Button disabled={disabled} className="btn btn-info float-right" onClick={toggleConfirmModal}>
                            Submit
                        </Button>
                    </Col>
                </Modal.Footer>
            </Modal>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={handleSubmitWorkFlow}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">
                    Are you sure you want to administer workflow for <i style={{ fontWeight: 'lighter' }}>{actionName}</i>?
                </h6>
            </ConfirmationModalWrapper>
        </>
    );
};
export default WorkFlows;
