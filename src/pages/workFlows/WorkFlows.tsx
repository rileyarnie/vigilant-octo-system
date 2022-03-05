/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
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
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Alert from '@material-ui/lab/Alert';
import { Card, Col, Modal, Button, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { ValidationForm } from 'react-bootstrap4-form-validation';
import { Icons } from 'material-table';
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
const WorkFlows = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'tableData.id' },
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { title: 'Path', field: 'path' },
        { title: 'Method', field: 'verb' },
        {
            title: 'Actions',
            render: (row) =>
                !canPerformActions(ACTION_GET_ACTIONS_BY_ROLE_ID.name) && (
                    <>
                        <Button
                            className="btn btn-info"
                            size="sm"
                            onClick={() => {
                                toggleCreateModal();
                                setActionName(row.name);
                                console.log(row);
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
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [showModal, setModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const authnzActions = Array.from(getAuthnzServiceActions().values());
    const financeActions = Array.from(getFinanceServiceActions().values());
    const timetableActions = Array.from(getTimetablingServiceActions().values());
    const simsActions = Array.from(getSimServiceActions().values());
    const data = [...authnzActions, ...financeActions, ...timetableActions, ...simsActions];
    useEffect(() => {
        fetchRoles();
    }, []);
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
    console.log(actionName);
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
                                    <MaterialTable icons={tableIcons} title="Work Flows" columns={columns} data={data} />
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
            <Modal
                size="lg"
                show={showModal}
                onHide={toggleCreateModal}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Administer Workflow</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <Select
                            theme={customSelectTheme}
                            options={options}
                            isMulti={isMulti}
                            placeholder="Select roles for this workflow"
                            noOptionsMessage={() => 'No roles available'}
                            onChange={handleChange}
                        />
                        <br />
                    </ValidationForm>
                    <button className="btn btn-info float-right" onClick={handleSubmitWorkFlow}>
                        Submit
                    </button>
                    <button className="btn btn-danger float-left" onClick={handleClose}>
                        Close
                    </button>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    );
};

export default WorkFlows;
