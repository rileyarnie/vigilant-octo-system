/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {MTableToolbar} from 'material-table';
import {MenuItem, Select} from '@material-ui/core';
import {Link} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, ListGroup, Modal, Row} from 'react-bootstrap';
import {FileInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import {TimetableService} from '../../services/TimetableService';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_GET_PROGRAM_COHORT_APPLICATIONS} from '../../authnz-library/sim-actions';
import {simsAxiosInstance} from '../../utlis/interceptors/sims-interceptor';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import EditApplicationDetails from './Application/EditApplicationDetails';

const alerts: Alerts = new ToastifyAlerts();
const ApplicationsList = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'applications_id' },
        { title: 'Name', render: (rowData) => rowData.applications_firstName + ' ' + rowData.applications_lastName },
        { title: 'Email', field: 'applications_emailAddress' },
        { title: 'Program', field: 'applications_programCohortId' },
        { title: 'Admission Status', field: 'applications_status' }
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
    const [applicationData, setApplicationData] = useState([]);
    const [applicationId, setApplicationId] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setLinearDisplay('block');
        fetchProgramCohortApplications();
    }, [isAdmitted]);

    const fetchProgramCohortApplications = () => {
        simsAxiosInstance
            .get('/program-cohort-applications', { params: { status: isAdmitted } })
            .then((res) => {
                setLinearDisplay('none');
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    };
    function handleUpload() {
        const form = new FormData();
        setLinearDisplay('block');
        form.append('fileUploaded', fileUploaded);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        TimetableService.handleFileUpload(form, config);
        timetablingAxiosInstance
            .post('/files', form, config)
            .then((res) => {
                toggleUploadModal();
                alerts.showSuccess('File uploaded successfully');
                setDocumentsUrl(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }
    const handleAdmission = (e, admissionStatus: admissionStatus) => {
        e.preventDefault();
        setDisabled(true);
        setLinearDisplay('block');
        const admissionsPayload = {
            modifiedProgramCohortApplication: {
                application: {
                    status: admissionStatus
                }
            }
        };
        simsAxiosInstance
            .put(`/program-cohort-applications/${applicationId}`, admissionsPayload)
            .then(() => {
                setDisabled(false);
                setLinearDisplay('none');
                alerts.showSuccess('Successfully updated application details');
                fetchProgramCohortApplications();
                resetStateCloseModal();
            })
            .catch((error) => {
                setLinearDisplay('none');
                setDisabled(false);
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

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_PROGRAM_COHORT_APPLICATIONS.name) && (
                <>
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
                                <TableWrapper
                                    title="Applications"
                                    columns={columns}
                                    onRowClick={(event, row) => {
                                        toggleCreateModal();
                                        setApplicationData(row);
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
                                    }}
                                    data={data}
                                    //
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
                                                        <MenuItem value={'FAILED'}>Failed</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
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
                        Application Id: {applicationId}
                        {isAdmitted === 'ADMITTED' && (
                            <>
                                <Link to={'/publishedsemesters'} onClick={() => localStorage.setItem('programId', programCohortId)}>
                                    <Button style={{ marginRight: '.5rem', marginLeft: '.5rem' }} variant="info" onClick={handleClose}>
                                        View Semesters
                                    </Button>
                                </Link>
                                <Button variant="danger" onClick={(e) => handleAdmission(e, admissionStatus.REJECTED)} disabled={disabled}>
                                    Reject
                                </Button>
                            </>
                        )}
                        {isAdmitted === 'PENDING' && (
                            <>
                                <Button
                                    style={{ marginRight: '.5rem', marginLeft: '.5rem' }}
                                    variant="info"
                                    onClick={(e) => handleAdmission(e, admissionStatus.ADMITTED)}
                                >
                                    Admit
                                </Button>
                                <Button variant="danger" onClick={(e) => handleAdmission(e, admissionStatus.REJECTED)} disabled={disabled}>
                                    Reject
                                </Button>
                            </>
                        )}
                        {isAdmitted === 'REJECTED' && (
                            <>
                                <Button
                                    style={{ marginRight: '.5rem', marginLeft: '.5rem' }}
                                    variant="info"
                                    onClick={(e) => handleAdmission(e, admissionStatus.ADMITTED)}
                                    disabled={disabled}
                                >
                                    Admit
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
                    <EditApplicationDetails application={applicationData} close={handleCloseModal}/>
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
                        <Button variant="primary" className="btn btn-primary rounded" onClick={toggleUploadModal} disabled={disabled}>
                            Close
                        </Button>
                        <Button variant="danger" className="btn btn-danger rounded" onClick={() => handleUpload()} disabled={disabled}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    );
};
export default ApplicationsList;
