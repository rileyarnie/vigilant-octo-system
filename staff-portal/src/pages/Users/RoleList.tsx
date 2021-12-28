/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import Config from '../../config';
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
import axios from 'axios';
import { Icons } from 'material-table';
import Alert from '@material-ui/lab/Alert';
import {Card, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Actions} from './ActionsByRole/Actions';
import { AddActions } from './AddActionsModal/AddActions';
import CreateRole from './Role/CreateRole';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
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
const RoleList = ():JSX.Element => {
    const columns = [
        { title: 'id', field: 'id', editable: 'never' as const},   
        { title: 'RoleName', field: 'RoleName', editable: 'always' as const},
        { title: 'Activation Status', field: 'activation_status',editable: 'never' as const},
        { title: 'Created On', render:(row)=>row.created_on.slice(0,10), editable: 'never' as const },
        
    ];
    const [data, setData] = useState([]);
    const [id,setId] = useState(0);
    const [roleName,setRoleName] = useState('');

    //for error handling
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = () => {
        const authnzSrv = Config.baseUrl.authnzSrv;
        setLinearDisplay('block');
        axios.get(`${authnzSrv}/roles`)
            .then(res => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch(error => {
                console.log(error);
                alerts.showError(error.message);
            });
    };
    const handleRowDelete = (oldData, resolve) => {
        const baseUrl = Config.baseUrl.authnzSrv;
        setLinearDisplay('block');
        axios.delete(`${baseUrl}/roles/{roleId}` + oldData.id)
            .then(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
                fetchRoles();
                setLinearDisplay('none');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleRowSelection = (roleName,roleId) => {
        setRoleName(roleName);
        setId(roleId);
    };

    const selectedRowProps = {
        id: id,
        name: roleName
    };
    return (
        <>
            <div>
                <Row className='align-items-center page-header'>
                    <Col>
                        <Breadcrumb />
                    </Col>
                    <Col>
                        <CreateRole fetchRoles = {fetchRoles}/>
                    </Col>
                </Row>
                <LinearProgress style={{display: linearDisplay}} />
                <Row>
                    <Col>
                        <Card>
                            <div>
                                {isError &&
                            <Alert severity='error'>
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>;
                                })}
                            </Alert>
                                }
                            </div>
                            <MaterialTable
                                title='Role List'
                                columns={columns}
                                data={data}
                                options={{
                                    selection: true,
                                    showSelectAllCheckbox: false,
                                    showTextRowsSelected: false
                                }}
                                onSelectionChange = {(rows)=> handleRowSelection(rows[0]?.RoleName,rows[0]?.id)}
                                icons={tableIcons}
                                editable={{
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                            handleRowDelete(oldData, resolve);
                                        })
                                }}
                            />
                        </Card>
                    </Col>
              
                </Row>
                <Actions {...selectedRowProps}> </Actions>
            &nbsp;&nbsp;&nbsp;
                <AddActions {...selectedRowProps} > </AddActions>
            </div>
        </>
    );
};

export default RoleList;