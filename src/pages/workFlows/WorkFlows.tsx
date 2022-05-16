/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Card, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { ACTION_GET_ACTIONS_BY_ROLE_ID, ACTION_GET_ROLES, getAuthnzServiceActions } from '../../authnz-library/authnz-actions';
import { getSimServiceActions } from '../../authnz-library/sim-actions';
import { getFinanceServiceActions } from '../../authnz-library/finance-actions';
import { getTimetablingServiceActions } from '../../authnz-library/timetabling-actions';
import { WorkFlowService } from '../../services/WorkFlowService';
import { LinearProgress, MenuItem, Select as MUISelect } from '@material-ui/core';
import { canPerformActions } from '../../services/ActionChecker';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import { ValidationForm } from 'react-bootstrap4-form-validation';
import Select from 'react-select';
import { customSelectTheme } from '../lib/SelectThemes';

const alerts: Alerts = new ToastifyAlerts();

const WorkFlows = (): JSX.Element => {
    const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        {
            title: 'Actions',
            render: (row) =>
                canPerformActions(ACTION_GET_ACTIONS_BY_ROLE_ID.name) && (
                    <div>
                        <MUISelect
                            defaultValue=""
                            value=""
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            style={{ width: 100 }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setActionName(row.name);
                                    fetchActionApprovers(row.name, 'create');
                                }}
                                value="createWorkflow"
                            >
                                Create Workflow
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setActionName(row.name);
                                    fetchActionApprovers(row.name, 'view');
                                }}
                                value="viewWorkflow"
                            >
                                View Workflow
                            </MenuItem>
                        </MUISelect>
                    </div>
                )
        }
    ];

    const modalColumns = [
        { title: 'ID', field: 'roleId' },
        { title: 'Name', field: 'role.name' },
        { title: 'Description', field: 'role.description' }
    ];

    const options = [];
    const [iserror] = useState(false);
    const [actionName, setActionName] = useState('');
    const [errorMessages] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [actions, setActions] = useState([]);
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
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);

    const [isMulti] = useState(true);

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    function fetchActionApprovers(actionName: string, type: string) {
        setLinearDisplay('block');
        WorkFlowService.fetchActionApprovers(actionName)
            .then((res) => {
                const approvingroles = res['data'];
                setActions(approvingroles);
                const roles = approvingroles.map((it) => {
                    return { value: it.role.id, label: it.role.name };
                });
                setApprovers(roles);
                type === 'create' ? toggleCreateModal() : toggleWorkflowModal();
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

        setDisabled(true);
        setLinearDisplay('block');
        setConfirmLinearDisplay('block');
        toggleCloseConfirmModal();

        WorkFlowService.handleSubmitWorkFlow(actionName, approvingRoles)
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

    const toggleWorkflowModal = () => setShowWorkflowModal(!showWorkflowModal);

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
            <ModalWrapper
                show={showModal}
                title={`Administer Workflow for ${actionName}`}
                submitButton
                submitFunction={toggleConfirmModal}
                modalSize="lg"
                closeModal={handleClose}
            >
                <LinearProgress style={{ display: confirmLinearDisplay }} />

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
            </ModalWrapper>
            <ModalWrapper
                title={`Actions assigned to ${actionName}`}
                modalSize="lg"
                show={showWorkflowModal}
                closeModal={toggleWorkflowModal}
            >
                <TableWrapper
                    title={`Roles for ${actionName}`}
                    columns={modalColumns}
                    data={actions}
                    options={{ showTextRowsSelected: false }}
                />
            </ModalWrapper>
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
