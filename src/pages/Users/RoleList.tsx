/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
// import Config from '../../exampleconfig';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Actions } from './ActionsByRole/Actions';
import { AddActions } from './AddActionsModal/AddActions';
import CreateRole from './Role/CreateRole';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { MenuItem, Select } from '@material-ui/core';
import { VerticalModal } from './ActionsByRole/VerticalModal';
import { AddActionsModal } from './AddActionsModal/AddActionsModal';
import { canPerformActions } from '../../services/ActionChecker';
import {
    ACTION_ADD_ACTIONS_TO_ROLE,
    ACTION_DEACTIVATE_ROLE,
    ACTION_GET_ACTIONS,
    ACTION_GET_ROLES
} from '../../authnz-library/authnz-actions';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

interface Role {
    id: number;
    created_on: string;
    name: string;
    RoleName: string;
}
function roleList(): JSX.Element {
    const columns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Role Name', field: 'name', editable: 'always' as const },
        { title: 'Role Description', field: 'description', editable: 'always' as const },
        { title: 'Activation Status', field: 'activation_status', editable: 'never' as const },
        { title: 'Created On', render: (row: Role): string => row.created_on.slice(0, 10), editable: 'never' as const },
        {
            title: ' Actions',
            render: (row: Role) => (
                <Select>
                    {canPerformActions(ACTION_GET_ACTIONS.name) && (
                        <div
                            className=""
                            onClick={() => {
                                roleActions(row.id);
                                setId(row.id);
                                setRoleName(row.name);
                                viewRoleActions();
                            }}
                        >
                            <MenuItem value="View role actions">View Role Actions</MenuItem>
                        </div>
                    )}

                    {canPerformActions(ACTION_ADD_ACTIONS_TO_ROLE.name) && (
                        <div
                            className=""
                            onClick={() => {
                                setId(row.id);
                                setRoleName(row.name);
                                toggleActionsModal();
                                getActionsByRoleId(row.id, row.name);
                            }}
                        >
                            <MenuItem value="Add actions">Add Actions</MenuItem>
                        </div>
                    )}

                    {canPerformActions(ACTION_DEACTIVATE_ROLE.name) && (
                        <div
                            className=""
                            onClick={() => {
                                setId(row.id);
                                setRoleName(row.name);
                                handleRowDelete(row.id);
                            }}
                        >
                            <MenuItem value="delete role">Delete Role</MenuItem>
                        </div>
                    )}
                </Select>
            )
        }
    ];
    const actionColumns = [
        { title: 'id', field: 'id' },
        { title: 'Action Name', field: 'name' }
    ];
    const [data, setData] = useState([]);
    const [id, setId] = useState(0);
    const [showModal, setModal] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [actions, setActions] = useState([]);
    const [viewActions, setViewActions] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [defaultRoleValues, setDefaultRoleValues] = useState([]);
    //modal functions
    const [verticalModal, setVerticalModal] = React.useState(false);
    const [actionModal, setActionModal] = React.useState(false);
    useEffect(() => {
        fetchRoles();
    }, []);
    function fetchRoles(): void {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get('/roles')
            .then((res: { data: [] }) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.log(error);
                alerts.showError((error as Error).message);
            });
    }
    function roleActions(roleId: number) {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get(`/actions/${roleId}`)
            .then((res) => {
                const myData = res.data;
                setActions(myData);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.log(error);
                alerts.showError((error as Error).message);
            });
    }
    function handleRowDelete(id: number): void {
        setLinearDisplay('block');
        authnzAxiosInstance
            .delete(`/roles/${id}`)
            .then(() => {
                fetchRoles();
                setLinearDisplay('none');
                alerts.showSuccess('Successfully deleted role');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError((error as Error).message);
            });
    }

    const getActionsByRoleId = (roleId: number, roleName?: string) => {
        setDefaultRoleValues([]);
        authnzAxiosInstance
            .get(`/actions/${roleId}`)
            .then((res) => {
                const myData = res.data;
                setActions(myData);
                setDefaultRoleValues(res.data.map((role: { id: number; name: string }) => ({ value: role.id, label: role.name })));
                setActionModal(true);
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(`We couldn’t fetch the existing actions for ${roleName}, reopening the dialog should resolve this`);
                setActionModal(true);
            });
    };

    const selectedRowProps = {
        id: id,
        name: roleName
    };
    const resetStateCloseModal = () => {
        setModal(false);
    };
    const toggleActionsModal = () => {
        setActionModal(!actionModal);
    };
    const viewRoleActions = () => {
        setViewActions(true);
    };
    const handleCloseViewActions = () => {
        setViewActions(false);
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
                    <Col>
                        <CreateRole fetchRoles={fetchRoles} />
                    </Col>
                </Row>
                <LinearProgress style={{ display: linearDisplay }} />
                {canPerformActions(ACTION_GET_ROLES.name) && (
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
                                <TableWrapper title="Role List" columns={columns} data={data} options={{}} />
                            </Card>
                        </Col>
                    </Row>
                )}
                <Actions {...selectedRowProps}> </Actions>
                &nbsp;&nbsp;&nbsp;
                <AddActions {...selectedRowProps}> </AddActions>
            </div>
            <VerticalModal show={verticalModal} onHide={() => setVerticalModal(false)} selectedrowprops={selectedRowProps} />
            <AddActionsModal
                show={actionModal}
                toggleModal={toggleActionsModal}
                onHide={() => setActionModal(false)}
                selectedRowProps={selectedRowProps}
                defaultValues={defaultRoleValues}
            />
            <Modal
                show={viewActions}
                onHide={viewRoleActions}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter"> Assign actions to {roleName} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableWrapper
                        title="Action Lists"
                        onRowClick={(event, row) => getActionsByRoleId(row.id)}
                        columns={actionColumns}
                        data={actions}
                        options={{ pageSize: 10 }}
                    />
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button variant="danger float-left" onClick={handleCloseViewActions}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default roleList;
