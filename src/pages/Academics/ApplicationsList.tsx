/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {MTableToolbar} from 'material-table';
import {MenuItem, Select} from '@material-ui/core';
import {Link} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, ListGroup, Modal, Row} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import {simsAxiosInstance} from '../../utlis/interceptors/sims-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import EditApplicationDetails from './Application/EditApplicationDetails';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_GET_PROGRAM_COHORT_APPLICATIONS } from '../../authnz-library/sim-actions';

const alerts: Alerts = new ToastifyAlerts();
const ApplicationsList = (): JSX.Element => {
    interface campusArr {
        name: string,
        id: number
    }
    interface nextofKinDetails {
        id: number,
        name: string,
        relation: string,
        nextOfKinPhoneNumber: string
    }
    interface supportingDocuments {
        id: number,
        documentUrl: string,
        applicationId: number
    }
    interface applicationDetails {
        firstName: string,
        lastName: string,
        otherName: string,
        identification: string,
        gender: string,
        countyOfResidence: string,
        dateOfBirth: string,
        emailAddress: string,
        identificationType: string,
        maritalStatus: string,
        nationality: string,
        phoneNumber: string,
        physicalChallenges: string,
        physicalChallengesDetails: string,
        preferredStartDate: string,
        id: number,
        religion: string,
        sponsor: string,
        programCohortId: string,
        studentId?: number,
        nextofKinDetails: nextofKinDetails,
        campusArr: campusArr,
        supportingDocuments: supportingDocuments
    }
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Name', render: (rowData) => rowData.firstName + ' ' + rowData.lastName },
        { title: 'Email', field: 'emailAddress' },
        { title: 'Program', field: 'programCohortId' },
        { title: 'Admission Status', field: 'status' }
    ];
    enum admissionStatus {
        ADMITTED = 'ADMITTED',
        REJECTED = 'REJECTED',
        PENDING = 'PENDING',
        FAILED = 'FAILED',
        DEFERRED = 'DEFERRED'
    }
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [errorMessages] = useState([]);
    const [showModal, setModal] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isAdmitted, setIsAdmitted] = useState('PENDING');
    const [selectedRow] = useState(null);
    const [applicationData, setApplicationData] = useState<applicationDetails>();
    const [applicationId, setApplicationId] = useState('');
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
    const handleAdmission = (e, admissionStatus: admissionStatus) => {
        e.preventDefault();
        const message = admissionStatus === 'ADMITTED' ? 'The application has been accepted' : 'The application has been rejected';
        setDisabled(true);
        setLinearDisplay('block');
        simsAxiosInstance
            .put(`/program-cohort-applications/${applicationId}/status`, {status: admissionStatus})
            .then(() => {
                setDisabled(false);
                setLinearDisplay('none');
                alerts.showSuccess(message);
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
                                        console.log('HELLO',row);
                                        setIsAdmitted(row.status);
                                        setApplicationId(row.id);
                                    }}
                                    data={data}
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
                                                        <MenuItem value={'DEFERRED'}>Deferred</MenuItem>
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
                        Application Id: {applicationId}
                                {isAdmitted === 'ADMITTED' && (
                                    <>
                                        <Link to={`/publishedsemesters?programCohortId=${applicationData?.programCohortId}&studentId=${applicationData?.studentId}&applicationId=${applicationData?.id}&studentName=${applicationData?.firstName+' '+applicationData?.lastName}`}>
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
                                        <ListGroup.Item>First Name: {applicationData?.firstName}</ListGroup.Item>
                                        <ListGroup.Item>Last Name: {applicationData?.lastName}</ListGroup.Item>
                                        <ListGroup.Item>Other Name: {applicationData?.otherName}</ListGroup.Item>
                                        <ListGroup.Item>Nationality: {applicationData?.nationality}</ListGroup.Item>
                                        <ListGroup.Item>Identification Type: {applicationData?.identificationType}</ListGroup.Item>
                                        <ListGroup.Item>Identification No: {applicationData?.identification}</ListGroup.Item>
                                        <ListGroup.Item>Gender: {applicationData?.gender}</ListGroup.Item>
                                        <ListGroup.Item>Marital Status: {applicationData?.maritalStatus}</ListGroup.Item>
                                        <ListGroup.Item>Religion: {applicationData?.religion}</ListGroup.Item>
                                    </ListGroup>
                                </div>
                                <div className="col-md-6">
                                    <ListGroup>
                                        <ListGroup.Item>Phone Number: {applicationData?.phoneNumber}</ListGroup.Item>
                                        <ListGroup.Item>Email Address: {applicationData?.emailAddress}</ListGroup.Item>
                                        <ListGroup.Item>Date Of Birth: {applicationData?.dateOfBirth?.slice(0,10)}</ListGroup.Item>
                                        <ListGroup.Item>Physical Challenges: {applicationData?.physicalChallenges}</ListGroup.Item>
                                        <ListGroup.Item>Details: {applicationData?.physicalChallengesDetails}</ListGroup.Item>
                                        <ListGroup.Item>Campus: {applicationData?.campusArr[0]?.name}</ListGroup.Item>
                                        <ListGroup.Item>Preferred Start Date: {applicationData?.preferredStartDate?.slice(0,10)}</ListGroup.Item>
                                        <ListGroup.Item>Sponsor: {applicationData?.sponsor}</ListGroup.Item>
                                        <ListGroup.Item>County Of Residence: {applicationData?.countyOfResidence}</ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Row>
                            <br />
                            <Row>
                                <div className="col-md-6">
                                    <h6>Next of Kin Details</h6>
                                    <ListGroup>
                                        <ListGroup.Item>Name: {applicationData?.nextofKinDetails[0]?.name}</ListGroup.Item>
                                        <ListGroup.Item>Phone Number: {applicationData?.nextofKinDetails[0]?.nextOfKinPhoneNumber}</ListGroup.Item>
                                        <ListGroup.Item>Relation: {applicationData?.nextofKinDetails[0]?.relation}</ListGroup.Item>
                                    </ListGroup>
                                </div>
                                <div className="col-md-6">
                                    <ListGroup>
                                        <ListGroup.Item>Document Url: {applicationData?.supportingDocuments[0]?.documentUrl}</ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Row>
                            <br />
                            <Button className="btn btn-danger float-left" onClick={handleClose}>
                        Close
                            </Button>
                            <Button className="btn btn-info float-right" onClick={toggleUpdateModal}>
                        Update
                            </Button>
                        </Modal.Body>
                    </Modal>
                    <ModalWrapper show={modalShow} closeModal={handleCloseModal} title='Edit Application Details' modalSize='lg' >
                        <EditApplicationDetails
                            application={applicationData}
                            close={resetStateCloseModal}
                            fetchProgramCohortApplications={fetchProgramCohortApplications}
                        />
                    </ModalWrapper>
                </>
            )};
        </>
    );
} ;  
export default ApplicationsList;
