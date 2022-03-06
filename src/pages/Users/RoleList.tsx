/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from 'react';
import Config from '../../config';
import MaterialTable, { Icons } from 'material-table';
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

const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
interface Role {
    id: number;
    created_on: string;
    name: string;
    RoleName: string;
}
function roleList(): JSX.Element {
    const columns = [
        { title: 'id', field: 'id', editable: 'never' as const },
        { title: 'RoleName', field: 'name', editable: 'always' as const },
        { title: 'RoleDescription', field: 'description', editable: 'always' as const },
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
                                setRoleName(row.name);
                                toggleActionsModal();
                            }}
                        >
                            <MenuItem value="View courses">View Role Actions</MenuItem>
                        </div>
                    )}
                    {canPerformActions(ACTION_ADD_ACTIONS_TO_ROLE.name) && (
                        <div className="" onClick={() => setActionModal(true)}>
                            <MenuItem value="View courses">Add Actions</MenuItem>
                        </div>
                    )}
                    {canPerformActions(ACTION_DEACTIVATE_ROLE.name) && (
                        <div className="" onClick={() => handleRowDelete(row.id)}>
                            <MenuItem value="View courses">Delete Role</MenuItem>
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
    const [id] = useState(0);
    const [showModal, setModal] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [actions, setActions] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
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
            .get('/actions', { params: { roleId: roleId } })
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
            .delete('/roles/${id}')
            .then(() => {
                fetchRoles();
                setLinearDisplay('none');
                alerts.showSuccess('Successfully deleted role');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError((error as Error).message);
            });
    }

    const selectedRowProps = {
        id: id,
        name: roleName
    };
    const resetStateCloseModal = () => {
        setModal(false);
    };
    const toggleActionsModal = () => {
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
                                <MaterialTable title="Role List" columns={columns} data={data} icons={tableIcons} />
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
            />
            <Modal
                show={showModal}
                onHide={toggleActionsModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{roleName} Actions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MaterialTable title="Action List" columns={actionColumns} data={actions} icons={tableIcons} />
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button variant="danger float-left" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default roleList;
