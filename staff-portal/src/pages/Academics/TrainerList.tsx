/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
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
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import Config from '../../config';
import { ValidationForm, SelectGroup } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
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
enum TrainerType {
    Lecturer = 'LECTURER',
    Trainer = 'TRAINER',
    Assistant = 'ASSISTANT'
}
// type TrainerTypeStrings = keyof typeof TrainerType;
function TrainerList() {
    const columns = [
        { title: 'ID', field: 'id', hidden: false },
        { title: 'Trainer AADAlias', field: 'AADAlias' },
        { title: 'Trainer type', field: 'trainerType' },
        { title: 'Department ID', field: 'departmentId' }
    ];
    const [data, setData] = useState([]);
    const baseUrl = Config.baseUrl.timetablingSrv;
    const baseUrlAuth = Config.baseUrl.authnzSrv;
    const [isError] = useState(false);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [trainerType, setTrainerType] = useState('Please select a trainer');
    const [selectedUser, setSelectedUser] = useState(1);
    const [selectedDept, setDept] = useState();
    const [selectedType, setType] = useState();
    const [departmentName, setDepartmentName] = useState('Please select a department');
    const [showModal, setModal] = useState(false);
    const [errorMessages] = useState([]);
    useEffect(() => {
        axios
            .get(`${baseUrl}/trainers`)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });

        axios
            .get(`${baseUrlAuth}/users`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.log('Error: '+error);
                alerts.showError(error.message);
            });

        axios
            .get(`${baseUrl}/departments`)
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    }, []);
    const fetchTrainers = () => {
        axios
            .get(`${baseUrl}/trainers`)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trainer = {
            userId: selectedUser,
            departmentId: selectedDept,
            trainerType: selectedType
        };

        createTrainer(trainer);
    };

    const createTrainer = (trainerData) => {
        console.log(trainerData);
        axios
            .post(`${baseUrl}/trainers`, trainerData)
            .then(() => {
                alerts.showSuccess('Trainer created successfully');
                fetchTrainers();
                setModal(false);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };

    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>

                <Col>
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create trainer
                    </Button>
                </Col>
            </Row>
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
                        <MaterialTable
                            title="Trainers"
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            editable={{}}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                show={showModal}
                onHide={toggleCreateModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Create a trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="user">Select a user</label>
                            <SelectGroup name="user" id="user" required
                                errorMessage="Please select a user."
                                onChange={(e) => {
                                    setSelectedUser(e.target.value);  
                                }}
                            >
                                <option value="">-- select a user --</option>
                                {users.map((user) => {
                                    return <option key={user.id} value={user.id}>{user.AADAlias}</option>;
                                })}
                            </SelectGroup>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Select a department</label>
                            <SelectGroup name="department" id="department" value={departmentName}
                                required
                                errorMessage="Please select a department."
                                onChange={(e) => {
                                    setDept(e.target.value);
                                    setDepartmentName(e.target.value);
                                }}
                            >
                                <option value="">-{departmentName}</option>
                                {departments.map((dept) => {
                                    return <option key={dept.id} value={dept.id}>{dept.name}</option>;
                                })}
                            </SelectGroup>
                        </div>

                        <div className="form-group">
                            <label htmlFor="trainerType">Select a trainer type</label>
                            <SelectGroup
                                name="trainerType"
                                id="trainerType"
                                value={trainerType}
                                required
                                errorMessage="Please select a trainer type."
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setTrainerType(e.target.value);
                                }}
                            >
                                <option value="">{trainerType}</option>
                                <option value={TrainerType['Lecturer']}>Lecturer</option>;
                                <option value={TrainerType['Trainer']}>Trainer</option>;
                                <option value={TrainerType['Assistant']}>Assistant</option>;
                            </SelectGroup>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-info float-right" onClick={(e) => handleSubmit(e)}>
                                Submit
                            </button>
                        </div>
                        <button className="btn btn-danger float-left"
                            onClick={()=>toggleCreateModal()}>
                            Cancel
                        </button>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default TrainerList;
