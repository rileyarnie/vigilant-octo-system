/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import Edit from '@material-ui/icons/Edit';
import SelectCurrency from 'react-select-currency';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Button, Card, Col, Modal, Row} from 'react-bootstrap';
import {TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {LinearProgress} from '@mui/material';
import {CourseCohortService} from '../services/CourseCohortsService';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {FeesManagementService} from '../services/FeesManagementService';
import {ProgramCohortService} from '../services/ProgramCohortService';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TableWrapper from '../../utlis/TableWrapper';

const alerts: Alerts = new ToastifyAlerts();

function ProgramCohortSemesterDetails(props) {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            margin: {
                margin: theme.spacing(1)
            },
            extendedIcon: {
                marginRight: theme.spacing(1)
            },
            root: {
                flexGrow: 1,
                width: '100%',
                backgroundColor: theme.palette.background.paper
            }
        })
    );
    const classes = useStyles();
    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: any;
    }
    const selectStyle = {
        width: '100%',
        height: '30px'
    };
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
    function a11yProps(index: any) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`
        };
    }
    const columns = [
        { title: 'ID', field: 'course.id', editable: 'never' as const },
        { title: 'Name', field: 'course.name' },
        { title: 'Start Date', render: (rowData) => rowData.programCohortSemester.semester.startDate.slice(0, 10) },
        { title: 'End Date', render: (rowData) => rowData.programCohortSemester.semester.endDate.slice(0, 10) }
    ];
    const feeItemColumns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Narrative', field: 'narrative' },
        { title: 'Amount', render: (rowData) => rowData.currency + ' ' + rowData.amount }
    ];
    const [errorMessages] = useState([]);
    const [narrative, setNarrative] = useState('');
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('KES');
    const [feeItemId, setFeeItemId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [anticipatedStartDate, setAnticipatedStartDate] = useState('');
    const [numOfSlots, setNumOfSlots] = useState('');
    const [examCutOffDate, setExamCutOffDate] = useState('');
    const [selectedNarrative, setSelectedNarrative] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const programName = localStorage.getItem('programName');
    const semStartDate = localStorage.getItem('semStartDate');
    const semEndDate = localStorage.getItem('semEndDate');
    const semesterId = localStorage.getItem('semesterId');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const programCohortId = localStorage.getItem('programCohortId');
    const programCohortSemesterId = localStorage.getItem('programCohortSemesterId');
    const programCohortCode = localStorage.getItem('programCohortCode');
    const [courseCohortData, setCourseCohortData] = useState([]);
    const [feeItemsData, setFeeItemData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isError] = useState(false);
    useEffect(() => {
        setLinearDisplay('block');
        fetchCourseCohortBySemesterId('course', semesterId, programCohortId);
        getFeesItems(programCohortSemesterId);
    }, []);
    function fetchCourseCohortBySemesterId(loadExtras: string, semesterId: string, programCohortId: string) {
        setLinearDisplay('block');
        CourseCohortService.fetchCourseCohortBySemesterId(loadExtras, semesterId, programCohortId)
            .then((res) => {
                const ccData = res['data'];
                setCourseCohortData(ccData);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };
    function getFeesItems(programCohortSemesterId: string) {
        setLinearDisplay('block');
        FeesManagementService.getFeesItems(programCohortSemesterId)
            .then((res) => {
                const feeData = res['data'];
                setFeeItemData(feeData);

            })
            .catch((error) => {
                if (error.message.includes('not found')) {
                    return error;
                }
                alerts.showError(error.message);
            });
    }
    function handleFeeItemsCreation() {
        setLinearDisplay('block');
        const createFeeItemRequest = {
            narrative: narrative,
            amount: amount,
            currency: currency,
            programCohortSemesterId: programCohortSemesterId
        };
        FeesManagementService.createFeesItems(createFeeItemRequest)
            .then((res) => {
                console.log(res);
                alerts.showSuccess('Successfully created a fee item');
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }
    function updateFeeItem(feeItemId, updates) {
        setLinearDisplay('block');
        FeesManagementService.updateFeesItems(updates)
            .then(() => {
                alerts.showSuccess('Successfully updated a fee item');
                resetStateCloseModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                setLinearDisplay('block');
                alerts.showError(error.response.data);
                setLinearDisplay('none');
            });
    }
    const handleEdit = (e) => {
        setLinearDisplay('block');
        e.preventDefault();
        const updates = {
            narrative: narrative === '' ? selectedNarrative : narrative,
            amount: amount === 0 ? selectedAmount : amount,
            currency: currency === '' ? selectedCurrency : currency,
            programCohortSemesterId: programCohortSemesterId
        };
        updateFeeItem(feeItemId, updates);
    };
    function publishProgramCohort() {
        setLinearDisplay('block');
        const programCohortSemester = {
            status: 'PUBLISHED'
        };
        ProgramCohortService.publishProgramCohortSemester(programCohortSemesterId, programCohortSemester)
            .then((res) => {
                console.log(res);
                alerts.showSuccess('Successfully published program cohort semester');
                togglePublishModalDialog();
                showPublishSemesterModal();
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
                setLinearDisplay('none');
            });
    }
    const resetStateCloseModal = (): void => {
        setFeeItemId(null);
        setNarrative('');
        setAmount(0);
        setCurrency('');
        setShowModal(false);
        setShowCancelModal(false);
    };
    // create fee items
    const showCreateModal = () => {
        showModal ? resetStateCloseModal() : setShowModal(true);
    };
    const toggleDialog = () => {
        showModal ? setShowDialog(false) : setShowDialog(true);
    };
    //publish program cohort semester
    const showPublishSemesterModal = () => {
        showPublishModal ? resetStateCloseModal() : setShowPublishModal(true);
    };
    const showCancelSemesterModal = () => {
        showCancelModal ? resetStateCloseModal() : setShowCancelModal(true);
    };
    const togglePublishModalDialog = () => {
        showPublishModal ? setShowPublishDialog(false) : setShowPublishDialog(true);
    };
    const handleBack = () => {
        props.history.goBack();
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row>
                <div className="">
                    <IconButton aria-label="delete" className={classes.margin} onClick={handleBack} size="small">
                        <ArrowBackIcon fontSize="inherit" /> Back
                    </IconButton>
                </div>
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
            <Row>
                <div className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Course Cohorts" {...a11yProps(0)} />
                            <Tab label="Fees Items" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Col>
                            <Card>
                                <Col>
                                    <Button
                                        className="float-center"
                                        variant="danger"
                                        onClick={() => {
                                            showPublishSemesterModal();
                                        }}
                                    >
                                        Publish{' '}
                                    </Button>
                                    <Button
                                        className="float-center"
                                        style={{ marginLeft: '48px' }}
                                        variant="danger"
                                        onClick={() => {
                                            showCancelSemesterModal();
                                        }}
                                    >
                                        Cancel{' '}
                                    </Button>
                                </Col>
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
                                    title={`${programName} of ${anticipatedGraduation} course cohorts`}
                                    columns={columns}
                                    data={courseCohortData}
                                    options={{  }}
                                />
                            </Card>
                        </Col>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Col>
                            <Card>
                                <Col>
                                    <Button
                                        className="float-right"
                                        variant="danger"
                                        onClick={() => {
                                            showCreateModal();
                                        }}
                                    >
                                        Create Fee Item
                                    </Button>
                                </Col>
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
                                    title={`${programName} of ${anticipatedGraduation} Fees Items`}
                                    columns={feeItemColumns}
                                    data={feeItemsData}
                                    options={{ actionsColumnIndex: -1,  }}
                                    actions={[
                                        {
                                            icon: Edit,
                                            tooltip: 'Edit Row',
                                            onClick: (event, rowData) => {
                                                setFeeItemId(rowData.id);
                                                setSelectedNarrative(rowData.narrative);
                                                setSelectedAmount(rowData.amount);
                                                setSelectedCurrency(rowData.currency);
                                                showCreateModal();
                                            }
                                        }
                                    ]}
                                />
                            </Card>
                        </Col>
                    </TabPanel>
                </div>
            </Row>
            <Modal
                show={showModal}
                onHide={showCreateModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {feeItemId ? 'Edit fee item' : 'Create a fee item'} for {programName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="narrative">
                                <b>Narrative</b>
                            </label>
                            <br />
                            <TextInput
                                name="narrative"
                                id="narrative"
                                type="text"
                                value={narrative}
                                onChange={(e) => {
                                    setNarrative(e.target.value);
                                }}
                                required
                            />
                            <br />
                            <label htmlFor="amount">
                                <b>Amount</b>
                            </label>
                            <br />
                            <TextInput
                                name="amount"
                                id="amount"
                                required
                                type="text"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                }}
                            />
                            <br />
                            <label htmlFor="currency">
                                <b>Currency</b>
                            </label>
                            <br />
                            <SelectCurrency
                                style={selectStyle}
                                name="currency"
                                value={currency}
                                onChange={(e) => {
                                    setCurrency(e.target.value);
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-info float-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowDialog(true);
                                }}
                            >
                                Preview
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-right" onClick={showCreateModal}>
                        {' '}
                        Close{' '}
                    </button>
                </Modal.Body>
            </Modal>
            <Modal show={showDialog} onHide={toggleDialog} size="sm" backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Do you want to {feeItemId ? 'Edit fee item' : 'Create a fee item'} for {programName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="form-group">
                            <label htmlFor="narrative">
                                <b>Narrative : </b>
                                {narrative}
                            </label>
                            <br />
                            <label htmlFor="amount">
                                <b>Amount : </b>
                                {amount}
                            </label>
                            <br />
                            <label htmlFor="currency">
                                <b>Currency : </b>
                                {currency}
                            </label>
                            <br />
                        </div>
                        <br />
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="btn btn-danger btn-rounded"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDialog(false);
                        }}
                    >
                        Continue editing
                    </Button>
                    <Button
                        onClick={(e) => {
                            feeItemId ? handleEdit(e) : handleFeeItemsCreation();
                        }}
                        variant="btn btn-info btn-rounded"
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showPublishModal}
                onHide={showPublishSemesterModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Publish {programName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="narrative">
                                <b>Anticipated startDate</b>
                            </label>
                            <br />
                            <TextInput
                                name="narrative"
                                id="narrative"
                                type="date"
                                min={semStartDate}
                                max={semEndDate}
                                value={anticipatedStartDate}
                                onChange={(e) => {
                                    setAnticipatedStartDate(e.target.value);
                                }}
                                required
                            />
                            <br />
                            <label htmlFor="narrative">
                                <b>Exam Cut off Date</b>
                            </label>
                            <br />
                            <TextInput
                                name="examCutoff"
                                id="examCutoff"
                                type="date"
                                min={semStartDate}
                                max={semEndDate}
                                value={examCutOffDate}
                                onChange={(e) => {
                                    setExamCutOffDate(e.target.value);
                                }}
                                required
                            />
                            <br />
                            <label htmlFor="amount">
                                <b>Number of Slots</b>
                            </label>
                            <br />
                            <TextInput
                                name="number of Slots"
                                id="number of Slots"
                                type="number"
                                value={numOfSlots}
                                onChange={(e) => {
                                    setNumOfSlots(e.target.value);
                                }}
                                required
                            />
                            <br />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-info float-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPublishDialog(true);
                                }}
                            >
                                Publish
                            </button>
                        </div>
                    </ValidationForm>
                    <button
                        className="btn btn-danger float-right"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPublishModal(false);
                        }}
                    >
                        {' '}
                        Close{' '}
                    </button>
                </Modal.Body>
            </Modal>
            {/* cancel programCohortSemester modal */}
            <Modal show={showCancelModal} onHide={showCancelSemesterModal} size="lg" backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Cancelling a program-cohort cancels all active course-cohorts and prevents addition of the cohort to a semester or
                        timetabling of the same, are you sure you want to proceed?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body></Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="btn btn-info btn-rounded"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCancelModal(false);
                        }}
                    >
                        No
                    </Button>
                    <Button variant="btn btn-danger btn-rounded">Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPublishDialog} onHide={togglePublishModalDialog} size="sm" backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">publish {programName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <p>
                            ”Publishing a semester for {programCohortCode} will disable you from adding semesters to this semester for the
                            course, continue?”
                        </p>
                        <div className="form-group">
                            <label htmlFor="narrative">
                                <b>Anticipated Start Date : </b>
                                {anticipatedStartDate}
                            </label>
                            <br />
                            <label htmlFor="amount">
                                <b>Exam Cutoff Date : </b>
                                {examCutOffDate}
                            </label>
                            <br />
                            <label htmlFor="currency">
                                <b>Number of Slots : </b>
                                {numOfSlots}
                            </label>
                            <br />
                        </div>
                        <br />
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="btn btn-danger btn-rounded"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPublishDialog(false);
                        }}
                    >
                        Continue editing
                    </Button>
                    <Button onClick={publishProgramCohort} variant="btn btn-info btn-rounded">
                        Continue to Publish
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ProgramCohortSemesterDetails;
