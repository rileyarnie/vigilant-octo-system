/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button } from 'react-bootstrap';
import CreateUser from './CreateUserModal/CreateUser';
import { Icons } from 'material-table';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_ASSIGN_ROLES, ACTION_GET_USERS } from '../../authnz-library/authnz-actions';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
const alerts: Alerts = new ToastifyAlerts();

const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
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

interface History {
    push: (path: string) => void;
}
interface IProps {
    history: History;
}

const UserList = (props: IProps): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'AAD Alias', field: 'aadAlias' }
    ];
    const [data, setData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get('/users')
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                //handle error using logging library
                console.log('Error', error.message);
                alerts.showError(error.message);
            });
    };
    const handleRouteChange = () => {
        props.history.push('assignrole');
    };

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>

                <Col>
                    <CreateUser fetchUsers={fetchUsers}></CreateUser>
                </Col>
                {canPerformActions(ACTION_ASSIGN_ROLES.name) && (
                    <Button variant="danger" onClick={() => handleRouteChange()}>
                        Assign Role
                    </Button>
                )}
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
            {canPerformActions(ACTION_GET_USERS.name) && (
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5>Users</h5>
                            </Card.Header>
                            <MaterialTable title="" columns={columns} data={data} icons={tableIcons} options={{ pageSize: 50 }} />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};
export default UserList;
