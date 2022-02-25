/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
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
import { Select, MenuItem } from '@material-ui/core';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { CountryDropdown } from 'react-country-region-selector';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button, Modal, ListGroup } from 'react-bootstrap';
import { SelectGroup, TextInput, FileInput, ValidationForm } from 'react-bootstrap4-form-validation';
import Config from '../../config';
import { Icons } from 'material-table';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { TimetableService } from '../../services/TimetableService';
import RecordFeePayment from './RecordFeePayment';

const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
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
const ApplicationsList = (): JSX.Element => {
    const simsSrv = Config.baseUrl.simsSrv;
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const columns = [
        { title: 'ID', field: 'applications_id' },
        { title: 'Name', render: (rowData) => rowData.applications_firstName + ' ' + rowData.applications_lastName },
        { title: 'Email', field: 'applications_emailAddress' },
        { title: 'Program', field: 'applications_programCohortId' },
        { title: 'Admission Status', field: 'applications_status' },
        {
            title: 'Actions',
            render: (rowData) => (
                <Select>
                    <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                        <div style={{ cursor: 'pointer' }} className="applicationList__menuItem" onClick={() => showDetails(rowData)}>
                            <p>View Details</p>
                        </div>
                        <div style={{ cursor: 'pointer' }} onClick={openModalHandler}>
                            <p>Upload Fee Item</p>
                        </div>
                    </div>
                </Select>
            )
        }
    ];
    enum admissionStatus {
        ADMITTED = 'ADMITTED',
        REJECTED = 'REJECTED',
        PENDING = 'PENDING',
        FAILED = 'FAILED'
    }
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [showModal, setModal] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isAdmitted, setIsAdmitted] = useState('PENDING');
    const [selectedRow] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [otherName, setOtherName] = useState('');
    const [nationality, setNationality] = useState('');
    const [identification, setIdentification] = useState('');
    const [gender, setGender] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [religion, setReligion] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [placeofBirth, setPlaceOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [nextOfKinName, setNextOfKinName] = useState('');
    const [nextOfKinPhoneNumber, setNextOfKinPhoneNumber] = useState('');
    const [nextOfKinRelation, setNextOfKinRelation] = useState('');
    const [physicalChallenges, setPhysicalChallenges] = useState('');
    const [courseStartDate, setCourseStartDate] = useState('');
    const [campus, setCampus] = useState('');
    const [fileUploaded, setFileUploaded] = useState('');
    const [programCohortId, setProgramCohortId] = useState('');
    const [sponsor, setSponsor] = useState('');
    const [countryOfResidence, setCountryOfResidence] = useState('');
    const [documentsUrl, setDocumentsUrl] = useState('');
    const [applicationId, setApplicationId] = useState('');
    const [campuses, setCampuses] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [show, setShow] = useState(false);

    const closeModalHandler = () => {
        setShow(false);
    };
    const openModalHandler = () => {
        setShow(true);
    };

    useEffect(() => {
        fetchProgramCohortApplications();
        axios
            .get(`${timetablingSrv}/campuses`)
            .then((res) => {
                setCampuses(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }, [isAdmitted]);

    const fetchProgramCohortApplications = () => {
        axios
            .get(`${simsSrv}/program-cohort-applications`, { params: { status: isAdmitted } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    function handleUpload() {
        const form = new FormData();
        form.append('fileUploaded', fileUploaded);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        TimetableService.handleFileUpload(form, config);
        axios
            .post(`${timetablingSrv}/files`, form, config)
            .then((res) => {
                toggleUploadModal();
                alerts.showSuccess('File uploaded successfully');
                setDocumentsUrl(res.data);
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    }
    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            application: {
                firstName: firstName,
                lastName: lastName,
                otherName: otherName,
                nationality: nationality,
                identification: identification,
                gender: gender,
                maritalStatus: maritalStatus,
                religion: religion,
                dateOfBirth: dateOfBirth,
                placeofBirth: placeofBirth,
                phoneNumber: phoneNumber,
                emailAddress: emailAddress,
                physicalChallenges: physicalChallenges,
                courseStartDate: courseStartDate,
                campus: campus,
                sponsor: sponsor,
                countryOfResidence: countryOfResidence,
                programCohortId: programCohortId
            },
            nextOfKin: {
                name: nextOfKinName,
                nextOfKinPhoneNumber: nextOfKinPhoneNumber,
                relation: nextOfKinRelation
            },
            supportingDocuments: {
                documentUrl: documentsUrl
            }
        };
        updateApplication(updates);
    };
    const updateApplication = (updates) => {
        axios
            .put(`${simsSrv}/program-cohort-applications/${applicationId}`, { modifiedProgramCohortApplication: updates })
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated application details');
                fetchProgramCohortApplications();
                resetStateCloseModal();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const handleAdmission = (e, admissionStatus: admissionStatus) => {
        e.preventDefault();
        const admissionsPayload = {
            modifiedProgramCohortApplication: {
                application: {
                    status: admissionStatus
                }
            }
        };
        axios
            .put(`${simsSrv}/program-cohort-applications/${applicationId}`, admissionsPayload)
            .then(() => {
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated application details');
                fetchProgramCohortApplications();
                resetStateCloseModal();
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const resetStateCloseModal = () => {
        setModal(false);
        setModalShow(false);
    };
    const toggleCreateModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const toggleUpdateModal = () => {
        modalShow ? resetStateCloseModal() : setModalShow(true);
        setModal(false);
    };
    const handleClose = () => {
        showModal ? resetStateCloseModal() : setModal(false);
    };
    const handleCloseModal = () => {
        modalShow ? resetStateCloseModal() : setModalShow(false);
    };
    const toggleUploadModal = () => {
        showUploadModal ? setShowUploadModal(false) : setShowUploadModal(true);
    };

    const showDetails = (row) => {
        toggleCreateModal();
        setFirstName(row.applications_firstName);
        setLastName(row.applications_lastName);
        setOtherName(row.applications_otherName);
        setIdentification(row.applications_identification);
        setGender(row.applications_gender);
        setMaritalStatus(row.applications_maritalStatus);
        setReligion(row.applications_religion);
        setDateOfBirth(row.applications_dateOfBirth.slice(0, 10));
        setPlaceOfBirth(row.applications_placeofBirth);
        setPhoneNumber(row.applications_phoneNumber);
        setEmailAddress(row.applications_emailAddress);
        setNationality(row.applications_nationality);
        setPhysicalChallenges(row.applications_physicalChallenges);
        setCourseStartDate(row.applications_courseStartDate.slice(0, 10));
        setCampus(row.applications_campus);
        setSponsor(row.applications_sponsor);
        setCountryOfResidence(row.applications_countryOfResidence);
        setProgramCohortId(row.applications_programCohortId);
        setIsAdmitted(row.applications_status);
        setNextOfKinName(row.nkd_name);
        setNextOfKinPhoneNumber(row.nkd_nextOfKinPhoneNumber);
        setNextOfKinRelation(row.nkd_relation);
        setApplicationId(row.applications_id);
        setDocumentsUrl(row.sdocs_documentUrl);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
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
                        <MaterialTable
                            title="Applications"
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            options={{
                                rowStyle: (rowData) => ({
                                    backgroundColor: selectedRow === rowData.tableData.id ? '#EEE' : '#FFF'
                                })
                            }}
                            components={{
                                Toolbar: (props) => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{ padding: '0px 10px' }}>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                style={{ width: 150 }}
                                                value={isAdmitted}
                                                onChange={(e) => setIsAdmitted(e.target.value as string)}
                                            >
                                                <MenuItem value={'ADMITTED'}>Admitted</MenuItem>
                                                <MenuItem value={'PENDING'}>Pending</MenuItem>
                                                <MenuItem value={'REJECTED'}>Rejected</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                backdrop="static"
                show={showModal}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Application Id: {applicationId}{' '}
                        {isAdmitted === 'APPROVED' ? (
                            <Link to={'/publishedsemesters'} onClick={() => localStorage.setItem('programId', programCohortId)}>
                                <Button variant="info" onClick={handleClose}>
                                    Semesters
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Button variant="info" onClick={(e) => handleAdmission(e, admissionStatus.ADMITTED)}>
                                    Admit
                                </Button>{' '}
                                <Button variant="danger" onClick={(e) => handleAdmission(e, admissionStatus.REJECTED)}>
                                    Reject
                                </Button>
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Admission status: {isAdmitted}</h6>
                    <Row>
                        <div className="col-md-6">
                            <ListGroup>
                                <ListGroup.Item>First Name: {firstName}</ListGroup.Item>
                                <ListGroup.Item>Last Name: {lastName}</ListGroup.Item>
                                <ListGroup.Item>Other Name: {otherName}</ListGroup.Item>
                                <ListGroup.Item>Nationality: {nationality}</ListGroup.Item>
                                <ListGroup.Item>Identification: {identification}</ListGroup.Item>
                                <ListGroup.Item>Gender: {gender}</ListGroup.Item>
                                <ListGroup.Item>Marital Status: {maritalStatus}</ListGroup.Item>
                                <ListGroup.Item>Religion: {religion}</ListGroup.Item>
                                <ListGroup.Item>Date Of Birth: {dateOfBirth}</ListGroup.Item>
                            </ListGroup>
                        </div>
                        <div className="col-md-6">
                            <ListGroup>
                                <ListGroup.Item>Place of Birth: {placeofBirth}</ListGroup.Item>
                                <ListGroup.Item>Phone Number: {phoneNumber}</ListGroup.Item>
                                <ListGroup.Item>Email Address: {emailAddress}</ListGroup.Item>
                                <ListGroup.Item>Physical Challenges: {physicalChallenges}</ListGroup.Item>
                                <ListGroup.Item>Course Start Date: {courseStartDate}</ListGroup.Item>
                                <ListGroup.Item>Campus: {campus}</ListGroup.Item>
                                <ListGroup.Item>Sponsor: {sponsor}</ListGroup.Item>
                                <ListGroup.Item>Country Of Residence: {countryOfResidence}</ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Row>
                    <br />
                    <Row>
                        <div className="col-md-6">
                            <h6>Next of Kin Details</h6>
                            <ListGroup>
                                <ListGroup.Item>Name: {nextOfKinName}</ListGroup.Item>
                                <ListGroup.Item>Phone Number: {nextOfKinPhoneNumber}</ListGroup.Item>
                                <ListGroup.Item>Relation: {nextOfKinRelation}</ListGroup.Item>
                            </ListGroup>
                        </div>
                        <div className="col-md-6">
                            <ListGroup>
                                <ListGroup.Item>Document Url: {documentsUrl}</ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Row>
                    <br />
                    <Button className="btn btn-danger btn-rounded float-left" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className="btn btn-info btn-rounded float-right" onClick={toggleUpdateModal}>
                        Update
                    </Button>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={modalShow}
                onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Edit Application Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="firstName">
                                    <b>First Name</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="firstName"
                                    id="firstName"
                                    type="text"
                                    placeholder="Enter name"
                                    required
                                    defaultValue={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                />
                                <br />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="lastName">
                                    <b>Last Name</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="lastName"
                                    id="lastName"
                                    type="text"
                                    placeholder="Enter Last name"
                                    required
                                    defaultValue={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="otherName">
                                    <b>Other Name</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="otherName"
                                    id="otherName"
                                    type="text"
                                    placeholder="Enter other name"
                                    defaultValue={otherName}
                                    onChange={(e) => {
                                        setOtherName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="nationality">
                                    <b>Nationality</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="nationality"
                                    id="nationality"
                                    placeholder=" Kenyan"
                                    required
                                    defaultValue={nationality}
                                    onChange={(e) => {
                                        setNationality(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="identification">
                                    <b>Identification</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="identification"
                                    id="identification"
                                    placeholder=" 346678798"
                                    defaultValue={identification}
                                    required
                                    onChange={(e) => {
                                        setIdentification(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="gender">
                                    <b>Gender</b>
                                </label>
                                <br />
                                <br />
                                <SelectGroup
                                    name="gender"
                                    id="gender"
                                    defaultValue={gender}
                                    onChange={(e) => {
                                        setGender(e.target.value);
                                    }}
                                    required
                                    errorMessage="Please select Gender"
                                >
                                    <option value="">--- Please select ---</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </SelectGroup>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="maritalStatus">
                                    <b>Marital Status</b>
                                </label>
                                <br />
                                <br />
                                <SelectGroup
                                    name="maritalStatus"
                                    id="maritalStatus"
                                    defaultValue={maritalStatus}
                                    onChange={(e) => {
                                        setMaritalStatus(e.target.value);
                                    }}
                                    required
                                    errorMessage="Please select your status"
                                >
                                    <option value="">--- Please select ---</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="separated">Separated</option>
                                    <option value="widowed">widowed</option>
                                </SelectGroup>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="religion">
                                    <b>Religion</b>
                                </label>
                                <br />
                                <br />
                                <SelectGroup
                                    name="religion"
                                    id="religion"
                                    required
                                    defaultValue={religion}
                                    onChange={(e) => {
                                        setReligion(e.target.value);
                                    }}
                                    errorMessage="Please select your religion"
                                >
                                    <option value="">-- Please select --</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="pagan">Pagan</option>
                                    <option value="Other">Other</option>
                                </SelectGroup>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="dateOfBirth">
                                    <b>Date of Birth</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="dateOfBirth"
                                    id="dateOfBirth"
                                    required
                                    defaultValue={dateOfBirth}
                                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                                        setDateOfBirth(e.target.value);
                                    }}
                                    type="date"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="placeofBirth">
                                    <b>Place of Birth</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="placeofBirth"
                                    id="placeofBirth"
                                    required
                                    defaultValue={placeofBirth}
                                    onChange={(e) => {
                                        setPlaceOfBirth(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="phoneNumber">
                                    <b>Phone Number</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    defaultValue={phoneNumber}
                                    required
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                    }}
                                    placeholder="+254 712 345 789"
                                    type="text"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="emailAddress">
                                    <b>Email Address</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="emailAddress"
                                    id="emailAddress"
                                    required
                                    defaultValue={emailAddress}
                                    onChange={(e) => {
                                        setEmailAddress(e.target.value);
                                    }}
                                    placeholder="Enter email address"
                                    type="email"
                                />
                            </div>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <h5>
                            <b>Next of Kin Details</b>
                        </h5>
                        <div className="form-group row">
                            <div className="col-md-4">
                                <label htmlFor="name">
                                    <b>Name</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="name"
                                    placeholder="Enter name"
                                    id="name"
                                    defaultValue={nextOfKinName}
                                    onChange={(e) => {
                                        setNextOfKinName(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="phoneNumber">
                                    <b>Phone Number</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="phoneNumber"
                                    placeholder="Enter phone number"
                                    id="phoneNumber"
                                    defaultValue={nextOfKinPhoneNumber}
                                    onChange={(e) => {
                                        setNextOfKinPhoneNumber(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="relation">
                                    <b>Relation</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="relation"
                                    placeholder="Relation"
                                    id="relation"
                                    defaultValue={nextOfKinRelation}
                                    onChange={(e) => {
                                        setNextOfKinRelation(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="physicalChallenges">
                                    <b>Physical Challenges</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="physicalChallenges"
                                    multiline
                                    rows="3"
                                    defaultValue={physicalChallenges}
                                    id="physicalChallenges"
                                    onChange={(e) => {
                                        setPhysicalChallenges(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="courseStartDate">
                                    <b>Course Start Date</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="courseStartDate"
                                    required
                                    id="courseStartDate"
                                    defaultValue={courseStartDate}
                                    onChange={(e) => {
                                        setCourseStartDate(e.target.value);
                                    }}
                                    type="date"
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="campus">
                                    <b>Campus</b>
                                </label>
                                <br />
                                <br />
                                <SelectGroup
                                    name="campus"
                                    id="campus"
                                    onChange={(e) => {
                                        setCampus(e.target.value);
                                    }}
                                    defaultValue={campus}
                                    required
                                    errorMessage="Please select campus"
                                >
                                    <option value="">- Please select -</option>
                                    {campuses.map((camp) => {
                                        return (
                                            <option key={camp.name} value={camp.id}>
                                                {camp.name}
                                            </option>
                                        );
                                    })}
                                </SelectGroup>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="sponsor">
                                    <b>Sponsor</b>
                                </label>
                                <br />
                                <br />
                                <TextInput
                                    name="sponsor"
                                    placeholder="Sponsor name"
                                    id="sponsor"
                                    defaultValue={sponsor}
                                    required
                                    onChange={(e) => {
                                        setSponsor(e.target.value);
                                    }}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="countryOfResidence">
                                    <b>Country Of Residence</b>
                                </label>
                                <br />
                                <br />
                                <CountryDropdown value={countryOfResidence} onChange={(val) => setCountryOfResidence(val)} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="countryOfResidence">
                                    <b>Supporting Documents</b>
                                </label>
                                <br />
                                <br />
                                <button
                                    className="btn btn-danger"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowUploadModal(true);
                                    }}
                                >
                                    Upload documents
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <br />
                            <br />
                            <Button className="btn btn-primary" onClick={(e) => handleEdit(e)}>
                                Submit
                            </Button>
                        </div>
                    </ValidationForm>
                    <Button className="btn btn-danger btn-rounded float-right" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Body>
            </Modal>
            <Modal
                backdrop="static"
                show={showUploadModal}
                onHide={toggleUploadModal}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload document</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ValidationForm>
                            <FileInput
                                name="fileUploaded"
                                id="image"
                                encType="multipart/form-data"
                                fileType={['pdf', 'doc', 'docx']}
                                maxFileSize="10mb"
                                onInput={(e) => {
                                    setFileUploaded(() => {
                                        return e.target.files[0];
                                    });
                                }}
                                errorMessage={{
                                    required: 'Please upload a document',
                                    fileType: 'Only document is allowed',
                                    maxFileSize: 'Max file size is 10MB'
                                }}
                            />
                        </ValidationForm>
                    </Modal.Body>

                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="primary" className="btn btn-primary rounded" onClick={toggleUploadModal}>
                            Close
                        </Button>
                        <Button variant="danger" className="btn btn-danger rounded" onClick={() => handleUpload()}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>

            <RecordFeePayment show={show} closeModal={closeModalHandler} />
        </>
    );
};
export default ApplicationsList;
