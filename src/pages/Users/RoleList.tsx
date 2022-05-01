/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import Alert from '@material-ui/lab/Alert';
import {Button, Card, Col, Modal, Row} from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Actions} from './ActionsByRole/Actions';
import {AddActions} from './AddActionsModal/AddActions';
import CreateRole from './Role/CreateRole';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import {MenuItem, Select} from '@material-ui/core';
import {VerticalModal} from './ActionsByRole/VerticalModal';
import {AddActionsModal} from './AddActionsModal/AddActionsModal';
import {canPerformActions} from '../../services/ActionChecker';
import {
    ACTION_ADD_ACTIONS_TO_ROLE,
    ACTION_DEACTIVATE_ROLE,
    ACTION_GET_ROLES
} from '../../authnz-library/authnz-actions';
import {authnzAxiosInstance} from '../../utlis/interceptors/authnz-interceptor';
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
                    {canPerformActions(ACTION_ADD_ACTIONS_TO_ROLE.name) && (
                        <div
                            className=""
                            onClick={() => {
                                setId(row.id);
                                setRoleName(row.name);
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
                setLinearDisplay('none');
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
        setLinearDisplay('block');
        authnzAxiosInstance
            .get(`/actions/${roleId}`)
            .then((res) => {
                const myData = res.data;
                setActions(myData);
                setDefaultRoleValues(res.data.map((role: { id: number; name: string }) => ({ value: role.id, label: role.name })));
                setLinearDisplay('none');
            })
            .catch((err) => {
                alerts.showError(`We couldn’t fetch the existing actions for ${roleName}, reopening the dialog should resolve this`);
            })
            .finally(()=>{
                setLinearDisplay('none');
                setActionModal(true);
            });
    };


    const selectedRowProps = {
        id: id,
        name: roleName
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
