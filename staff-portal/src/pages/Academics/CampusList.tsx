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
import { Switch } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Config  from '../../config';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import ProgressBar from 'react-bootstrap/ProgressBar';

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

function CampusList() {
    interface Campus {
        id: number;
        name: string;
        description: string;
        activation_status: boolean;
        approval_status: boolean;
    }
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const [data, setData] = useState([]);
    const [iserror, setIserror] = useState(false);
    const [progressBar, setProgress] = useState(0);
    const [campusName, setCampusName] = useState('');
    const [description, setDescription] = useState('');
    const [showModal, setModal] = useState(false);
    const [campusId, setCampusId] = useState(null);
    const [selectedCampusName, setSelectedCampusName] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('');

    const [checked, setChecked] = useState(true);
    const[disabled,setDisabled] = useState(false)
    let activationStatus: boolean;
    const handleActivationStatusToggle = (event, row: Campus) => {
        setDisabled(true)
        if (row.activation_status) {
            activationStatus = false;
            handleToggleStatusSubmit(event, row);
        }
        if (!row.activation_status) {
            activationStatus = true;
            handleToggleStatusSubmit(event, row);
        }
    };
    const handleToggleStatusSubmit = (e, row: Campus) => {
        const campus = {
            activation_status: activationStatus,
        };
        axios
            .put(`${timetablingSrv}/campuses/${row.id}`, campus)
            .then((res) => {
                alert('Success')
                fetchCampuses();
                setDisabled(false)

            })
            .catch((error) => {
                console.error(error);
                alert(error);
                setDisabled(false)
            });
    };


    const columns = [
        { title: 'ID', field: 'id'},
        { title: 'Campus name', field: 'name' },
        { title: 'Description', field: 'description' },
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: Campus) => (
                <Switch
                    onChange={(event) => handleActivationStatusToggle(event, row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    defaultChecked={row.activation_status === true ? true : false}
                />
            )
        },
    ];

    const [errorMessages, setErrorMessages] = useState([]);
    useEffect(() => {
        axios.get(`${timetablingSrv}/campuses`)
            .then(res => {
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alert(error.message)
            });
    }, []);

    const updateCampus = (deptId, updates) => {
        axios.put(`${timetablingSrv}/campuses/${campusId}`, updates)
            .then(res => {
                setProgress(100)
                alert("Succesfully updated Campus")
                fetchCampuses();
                resetStateCloseModal();
                setProgress(0)
            })
            .catch(error => {
                console.error(error)
                setProgress(0)
                alert(error.message)
            });
    }
    const fetchCampuses = () => {
        axios.get(`${timetablingSrv}/campuses`)
            .then(res => {
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alert(error.message)
            });
    };
    const handleAdd = (e) => {
        e.preventDefault()
        const campus = {
            name: campusName,
            description: description,
        };

        createCampus(campus)
    };
    const handleEdit = (e) => {
        e.preventDefault()
        const updates = {
            name: campusName === '' ? selectedCampusName : campusName,
            description: description === '' ? selectedDescription : description,
        }
        updateCampus(campusId, updates)
    }
    const createCampus = (campusData) => {
        console.log(campusData)
        axios
            .post(`${timetablingSrv}/campuses`, campusData)
            .then((res) => {
                setProgress(100);
                alert('Succesfully created campus');
                fetchCampuses();
                resetStateCloseModal()
                setProgress(0);
            })
            .catch((error) => {
                setProgress(0)
                alert(error.message);
            });
    };

    const resetStateCloseModal = () => {
        setCampusId(null);
        setCampusName('');
        setDescription('');
        setModal(false);
    }
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const handleClose = () => setModal(false);
    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create Campus
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
                            title='Campuses'
                            columns={columns}
                            options={{actionsColumnIndex: -1}}
                            data={data}
                            // @ts-ignore
                            icons={tableIcons}
                            actions={[
                                {
                                    icon: Edit,
                                    tooltip: 'Edit Row',

                                    onClick: (event, row) => {
                                        setCampusId(row.id)
                                        setSelectedCampusName(row.name)
                                        toggleCreateModal()
                                        toggleCreateModal()
                                    }

                                }

                            ]}
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
                <ProgressBar animated now={progressBar} variant="info" />
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{campusId ? "Edit Campus" : "Create a Campus"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor="departmentName">Campus Name</label>
                            <TextInput name='campusName' id='campusName' type='text' value={campusName} placeholder={campusId ? selectedCampusName :campusName}
                                       onChange={(e) => setCampusName(e.target.value)}
                                       required /><br />
                            <label htmlFor='Date'><b>Description</b></label><br />
                            <TextInput name='description'  minLength="4" id='description' value={description} type="text" placeholder={campusId ?  selectedDescription :description} required multiline rows="5"
                                       onChange={(e) => {
                                           setDescription(e.target.value)
                                       }}/><br />
                        </div>
                        <div className='form-group'>
                            <button className="btn btn-danger float-right" onClick={(e) => campusId ? handleEdit(e) : handleAdd(e)}>
                                Submit
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-info float-leftt" onClick={handleClose}>
                        Close
                    </button>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default CampusList;