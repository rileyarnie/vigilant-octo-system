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
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import Config from '../../config';
import { ValidationForm, SelectGroup } from 'react-bootstrap4-form-validation';

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

enum TrainerType {
    Lecturer = 'LECTURER',
    Trainer = 'TRAINER',
    Assistant = 'ASSISTANT'
}
type TrainerTypeStrings = keyof typeof TrainerType;
function TrainerList() {
    const columns = [
        { title: 'ID', field: 'id', hidden: false },
        { title: 'Trainer name', field: 'name' },
        { title: 'Trainer type', field: 'ttype' },
        { title: 'Department ID', field: 'departmentId' }
    ];
    const [data, setData] = useState([]);
    const baseUrl = Config.baseUrl.timetablingSrv;
    const [iserror, setIserror] = useState(false);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [trainerType, setTrainerType] = useState('');
    const [selectedUser, setSelectedUser] = useState();
    const [selectedDept, setDept] = useState();
    const [selectedType, setType] = useState();
    const [showModal, setModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    useEffect(() => {
        axios
            .get(`${Config.baseUrl.timetablingSrv}/trainers`)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error.message);
                setErrorMessages(['Failed to get trainers']);
            });

        axios
            .get(`${Config.baseUrl.timetablingSrv}/users`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.log('Error');
                setErrorMessages(['Failed to get users']);
            });

        axios
            .get(`${Config.baseUrl.timetablingSrv}/departments`)
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                setErrorMessages(['Failed to get departments']);
            });
    }, []);

    const fetchTrainers = () => {
        axios
            .get(`${Config.baseUrl.timetablingSrv}/trainers`)
            .then((res) => {
                setData(res.data);
                alert('Succesfully updated trainer data');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error.message);
                setErrorMessages(['Failed to get trainers']);
            });
    };

    const handleSubmit = () => {
        const trainer = {
            name: selectedUser,
            department: selectedDept,
            trainerType: selectedType
        };

        createTrainer(trainer);
    };

    const createTrainer = (trainerData) => {
        axios
            .post(`${Config.baseUrl.timetablingSrv}/trainers`, trainerData)
            .then((res) => {
                alert('Succesfully created trainer');
                fetchTrainers();
                toggleCreateModal();
            })
            .catch((err) => {
                setErrorMessages(['Failed to create trainer']);
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
                    <Button variant="danger" onClick={() => toggleCreateModal()}>
                        Create trainer
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <div>
                            {iserror && (
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
                            // @ts-ignore
                            icons={tableIcons}
                            editable={{}}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                show={showModal}
                onExit={() => toggleCreateModal()}
                onBackdropClick={() => toggleCreateModal()}
                size="lg"
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
                            <SelectGroup
                                name="user"
                                id="user"
                                value={users}
                                required
                                errorMessage="Please select a user."
                                onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">--- Please select a user ---</option>
                                {users.map((user) => {
                                    return <option value={user.id}>{user.AADAlias}</option>;
                                })}
                            </SelectGroup>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Select a department</label>
                            <SelectGroup
                                name="department"
                                id="department"
                                value={departments}
                                required
                                errorMessage="Please select a department."
                                onChange={(e) => setDept(e.target.value)}
                            >
                                <option value="">--- Please select a department---</option>
                                {departments.map((dept) => {
                                    return <option value={dept.id}>{dept.name}</option>;
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
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">--- Please select trainer type---</option>
                                <option value={TrainerType['Lecturer']}>Lecturer</option>;
                                <option value={TrainerType['Trainer']}>Trainer</option>;
                                <option value={TrainerType['Assistant']}>Assistant</option>;
                            </SelectGroup>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-danger" onClick={() => handleSubmit()}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default TrainerList;
