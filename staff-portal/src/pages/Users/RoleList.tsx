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
import {Button, Card, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Actions} from './ActionsByRole/Actions';
import { AddActions } from './AddActionsModal/AddActions';
import CreateRole from './Role/CreateRole';

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
function RoleList() {

    const columns = [
        { title: 'id', field: 'id', editable: 'never' as const},   
        { title: 'RoleName', field: 'RoleName', editable: 'always' as const},
        { title: 'Activation Status', field: 'activation_status',editable: 'never' as const},
        { title: 'Created On', field: 'created_on', editable: 'never' as const },
        
    ];
    const [data, setData] = useState([]);
    const [showModal, setModal] = useState(false);
    const [id,setId] = useState(0);
    const [roleName,setRoleName] = useState('');

    //for error handling
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = () => {
        const authnzSrv = Config.baseUrl.authnzSrv; 
        axios.get(`${authnzSrv}/roles`)
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleRowUpdate = (newData, oldData, resolve) => {
        const errorList = [];
        if (newData.role_name === '') {
            errorList.push('Please enter Role name');
        }

        if (errorList.length < 1) {
            const base_url = Config.baseUrl.authnzSrv;
            axios.put(`${base_url}/roles/{roleID}/` + newData.id, newData)
                .then(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve();
                    setIserror(false);
                    setErrorMessages([]);
                })
                .catch(error => {
                    setErrorMessages(error.message);
                    setIserror(true);
                    resolve();

                });
        } else {
            setErrorMessages(errorList);
            setIserror(true);
            resolve();

        }

    };
    const handleRowAdd = (newData, resolve) => {
        //validation
        const errorList = [];
        if(newData.role_name === undefined){
            errorList.push('Please enter role name');
        }

        if(errorList.length < 1){ //no error
            const baseUrl = Config.baseUrl.authnzSrv;
            axios.put(`${baseUrl}/roles`, newData)
                .then(() => {
                    const dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve();
                    setErrorMessages([]);
                    setIserror(false);
                })
                .catch(error => {
                    alert(error.message);
                });
        }else{
            setErrorMessages(errorList);
            setIserror(true);
            resolve();
        }


    };
    const handleRowDelete = (oldData, resolve) => {
        const baseUrl = Config.baseUrl.authnzSrv;
        axios.delete(`${baseUrl}/roles/{roleID}` + oldData.id)
            .then(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error.message);
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
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
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
                <Row>
                    <Col>
                        <Card>
                            <div>
                                {iserror &&
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
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve) => {
                                            handleRowUpdate(newData, oldData, resolve);
                                        }),
                                    onRowAdd: (newData) =>
                                        new Promise((resolve) => {
                                            handleRowAdd(newData, resolve);
                                        }),
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
}

export default RoleList;