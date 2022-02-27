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
import { Card, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Actions } from './ActionsByRole/Actions';
import { AddActions } from './AddActionsModal/AddActions';
import CreateRole from './Role/CreateRole';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { MenuItem, Select } from '@material-ui/core';
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_on: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RoleName: string;
}
function roleList(): JSX.Element {
    const columns = [
        { title: 'id', field: 'id', editable: 'never' as const },
        { title: 'RoleName', field: 'RoleName', editable: 'always' as const },
        { title: 'Activation Status', field: 'activation_status', editable: 'never' as const },
        { title: 'Created On', render: (row: Role): string => row.created_on.slice(0, 10), editable: 'never' as const },
        {
            title: ' Actions',
            render: (row: Role) => (
                <Select>
                    <Actions {...row}>
                        <MenuItem value="View courses">View Role Actions</MenuItem>
                    </Actions>
                    <AddActions {...row}>
                        <MenuItem value="View courses">Add Actions</MenuItem>
                    </AddActions>
                    <div className="" onClick={() => handleRowDelete(row.id)}>
                        <MenuItem value="View courses">Delete Role</MenuItem>
                    </div>
                </Select>
            )
        }
    ];
    const [data, setData] = useState([]);
    const [id, setId] = useState(0);
    const [roleName, setRoleName] = useState('');

    //for error handling
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchRoles();
    }, []);

    function fetchRoles(): void {
        const authnzSrv = Config.baseUrl.authnzSrv;
        setLinearDisplay('block');
        axios
            .get(`${authnzSrv}/roles`)
            .then((res: { data: [] }) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.log(error);
                alerts.showError((error as Error).message);
            });
    }
    // function handleRowDelete(oldData: { id: number }, resolve: () => void): void {
    function handleRowDelete(id: number): void {
        const baseUrl = Config.baseUrl.authnzSrv;
        setLinearDisplay('block');
        axios
            .delete(`${baseUrl}/roles/${id}`)
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
                <Actions {...selectedRowProps}> </Actions>
                &nbsp;&nbsp;&nbsp;
                <AddActions {...selectedRowProps}> </AddActions>
            </div>
        </>
    );
}

export default roleList;
