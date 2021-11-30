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
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Config  from '../../config';
import { Icons } from 'material-table';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Switch } from '@material-ui/core';

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

function Department() {
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const ACTIVE = 'ACTIVE';
    const INACTIVE = 'INACTIVE'; 

    const columns = [
        { title: 'ID', field: 'id', hidden: true },
        { title: 'Department name', field: 'name' },

        {
            title: 'Status', field: 'activation_status',
        },
        {
            title: 'Toggle Activation Status',
            field: 'internal_action',
            render: (row) => (
                <Switch
                    onChange={() => handleSwitchToggle(row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={row.activation_status==='ACTIVE'}
                />
            )
        }
    ];
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [progressBar, setProgress] = useState(0);
    const [deptname, setDeptName] = useState('');
    const [activationStatus, setActivationStatus] = useState('');
    const [showModal, setModal] = useState(false);
    const [deptId, setDeptId] = useState(null);
    const [selectedDeptName, setSelectedDeptName] = useState('');
    const [selectedActivationStatus, setSelectedActivationStatus] = useState('');
    const [isActive] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    useEffect(() => {
        axios.get(`${timetablingSrv}/departments`)
            .then(res => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error);
            });
    }, []);

    const updateDepartment = (deptId, updates) => {
        axios.put(`${timetablingSrv}/departments/${deptId}`, updates)
            .then(() => {
                setProgress(100);
                alert('Successfully updated department');
                fetchDepartments();
                resetStateCloseModal();
                setProgress(0);
            })
            .catch(error => {
                console.error(error);
                setProgress(0);
                alert('Failed to update department');
            });
    };

    const fetchDepartments = () => {        
        axios.get(`${timetablingSrv}/departments`)
            .then(res => {
                setData(res.data);
                alert('Successfully fetched departments');
            })
            .catch((error) => {
            //handle error using logging library
                console.error(error);
                alert(error);
            });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const department = {
            name: deptname,
            activation_status: activationStatus,
            isActive: isActive
        };

        createDepartment(department);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            name: deptname === '' ? selectedDeptName : deptname,
            activation_status: activationStatus === 'Please enter activation status' ? selectedActivationStatus : activationStatus,
            isActive: isActive
        };

        updateDepartment(deptId, updates);

    };

    const createDepartment = (departmentData) => {
        console.log(departmentData);
        axios
            .post(`${timetablingSrv}/departments`, departmentData)
            .then(() => {
                setProgress(100);
                alert('Successfully created department');
                fetchDepartments();
                resetStateCloseModal();
                setProgress(0);
            })
            .catch(() => {
                setProgress(0);
                setErrorMessages(['Failed to create trainer']);
            });
    };
    
    const resetStateCloseModal = () => {
        setDeptId(null);
        setDeptName('');
        setActivationStatus('Please enter activation status');
        setModal(false);
    };

    const setDepartmentActivationStatus = async (departmentId:number, activationStatus:string) => {
        const params = new URLSearchParams();
        const update = {
            activation_status: activationStatus
        }; 
        params.append('updates', JSON.stringify(update));
        axios
            .put(`${timetablingSrv}/departments/${departmentId}`, params)
            .then((res) => {
                if(res.status === 200){
                    data.forEach((obj,index)=>{
                        if(obj.id === deptId){
                            data[index].activation_status = activationStatus;
                            const updatedArr = [...data];
                            setData(updatedArr);
                        }
                    });
                }
            })
            .catch((error) => {
                alert(error);
                console.error(error);
            });
    };

    const handleSwitchToggle = async (row) => {
        if (row.activation_status === ACTIVE) {
            setDepartmentActivationStatus(row.id, INACTIVE);
        }
        if (row.activation_status === INACTIVE) {
            setDepartmentActivationStatus(row.id, ACTIVE);
        }
    };

    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    
    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create Department
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
                            title='Departments'
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            actions={[

                                {

                                    icon: Edit,

                                    tooltip: 'Edit Row',

                                    onClick: (event, rowData) => {

                                        setDeptId(rowData.id);
                                        setSelectedDeptName(rowData.name);
                                        setSelectedActivationStatus(rowData.activation_status);
                                        toggleCreateModal();


                                    }

                                } 

                            ]}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                backdrop="static"
                show={showModal}
                onHide={toggleCreateModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <ProgressBar animated now={progressBar} variant="info" />
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{deptId ? 'Edit department' : 'Create a department'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="departmentName">Department name</label>
                            <TextInput
                                name='departmentName' 
                                id='departmentName' 
                                type='text' 
                                value={deptId ? selectedDeptName : deptname} 
                                placeholder={deptId ? selectedDeptName :'Enter department name'} 
                                onChange={(e) => deptId ? setSelectedDeptName(e.target.value) : setDeptName(e.target.value)}
                                required /><br />
                        </div>
                        <div className="form-group" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button className="btn btn-primary" onClick={() => toggleCreateModal()}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={(e) => deptId ? handleEdit(e) : handleCreate(e)}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                </Modal.Body>
            </Modal>

        </>
    );
}
export default Department;