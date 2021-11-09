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
import Alert from '@material-ui/lab/Alert';
import {Button, Card, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Actions} from "./ActionsByRole/Actions"
import { AddActions } from './AddActionsModal/AddActions';

const tableIcons = {
    Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref: any) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref: any) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref: any) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref: any) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref: any) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: any) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: any) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: any) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: any) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: any) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: any) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: any) => <ViewColumn {...props} ref={ref} />)
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
    const [id,setId] = useState(0)
    const [roleName,setRoleName] = useState('')

    //for error handling
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        const authnzSrv = Config.baseUrl.authnzSrv 
        axios.get(`${authnzSrv}/roles`)
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                console.log('Error');
            });
    }, []);

    const handleRowUpdate = (newData, oldData, resolve) => {
        let errorList = [];
        if (newData.role_name === '') {
            errorList.push('Please enter Role name');
        }

        if (errorList.length < 1) {
            const base_url = Config.baseUrl.authnzSrv;
            axios.put(`${base_url}/roles/{roleID}/` + newData.id, newData)
                .then(res => {
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
        let errorList = []
        if(newData.role_name === undefined){
            errorList.push("Please enter role name")
        }

        if(errorList.length < 1){ //no error
            const baseUrl = Config.baseUrl.authnzSrv;
            axios.put(`${baseUrl}/roles`, newData)
                .then(res => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve()
                    setErrorMessages([])
                    setIserror(false)
                })
                .catch(error => {
                    setErrorMessages(["Cannot add Role"])
                    setIserror(true)
                    resolve()
                })
        }else{
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }


    }
    const handleRowDelete = (oldData, resolve) => {
        const baseUrl = Config.baseUrl.authnzSrv;
        axios.delete(`${baseUrl}/roles/{roleID}` + oldData.id)
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
            })
            .catch(error => {
                setErrorMessages(['Delete failed!']);
                setIserror(true);
                resolve();
            });
    };

    const handleRowSelection = (roleName,roleId) => {
        setRoleName(roleName)
        setId(roleId)
    }

    const selectedRowProps = {
        id: id,
        name: roleName
    }
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
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create Role
                    </Button>
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

                            // @ts-ignore
                            icons={tableIcons}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve) => {
                                        handleRowUpdate(newData, oldData, resolve);
                                    }),
                                onRowAdd: (newData) =>
                                    new Promise((resolve) => {
                                        handleRowAdd(newData, resolve)
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
            <Actions {...selectedRowProps as any}></Actions>
            &nbsp;&nbsp;&nbsp;
            <AddActions {...selectedRowProps as any} ></AddActions> 
            </div>
        </>
    );
}

export default RoleList;