/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import Edit from '@material-ui/icons/Edit';
import SelectCurrency from 'react-select-currency';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { TextInput, ValidationForm } from 'react-bootstrap4-form-validation';
import { LinearProgress } from '@mui/material';
import { CourseCohortService } from '../services/CourseCohortsService';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FeesManagementService } from '../services/FeesManagementService';
import { ProgramCohortService } from '../services/ProgramCohortService';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

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
        { title: 'Start Date', render: (rowData) => rowData.programCohortSemester?.semester?.startDate?.slice(0, 10) },
        { title: 'End Date', render: (rowData) => rowData.programCohortSemester?.semester?.endDate?.slice(0, 10) }
    ];
    const feeItemColumns = [
        { title: 'ID', field: 'id', editable: 'never' as const },
        { title: 'Narrative', field: 'narrative' },
        { title: 'Amount', render: (rowData) => rowData?.currency + ' ' + rowData.amount }
    ];
    const [errorMessages] = useState([]);
    const [narrative, setNarrative] = useState('');
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('KES');
    const [feeItemId, setFeeItemId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [confirmPublishModal, setConfirmPublishModal] = useState(false);
    const [anticipatedStartDate, setAnticipatedStartDate] = useState('');
    const [numOfSlots] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const [examCutOffDate, setExamCutOffDate] = useState('');
    const [selectedNarrative, setSelectedNarrative] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [programCohortSemesterStatus, setProgramCohortSemesterStatus] = useState('');
    const [programCohortCode, setProgramCohortCode] = useState('');
    const programName = localStorage.getItem('programName');
    const semStartDate = localStorage.getItem('semStartDate');
    const semEndDate = localStorage.getItem('semEndDate');
    const semesterId = localStorage.getItem('semesterId');
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation');
    const programCohortId = localStorage.getItem('programCohortId');
    const [courseCohortData, setCourseCohortData] = useState([]);
    const [feeItemsData, setFeeItemData] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [isError] = useState(false);

    const programCohortSemesterId = props.match.params.programCohortSemesterId;

    useEffect(() => {
        fetchCourseCohortBySemesterId('course', semesterId, programCohortId);
        getFeesItems(programCohortSemesterId);
    }, []);

    function fetchCourseCohortBySemesterId(loadExtras: string, semesterId: string, programCohortId: string) {
        setLinearDisplay('block');
        CourseCohortService.fetchCourseCohortBySemesterId(loadExtras, semesterId, programCohortId)
            .then((res) => {
                const ccData = res['data'];
                setCourseCohortData(ccData);
                setProgramCohortSemesterStatus(ccData[0]?.programCohortSemester?.status);
                setProgramCohortCode(ccData[0]?.programCohort?.code);
                setLinearDisplay('none');
            })
            .catch((error) => {
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
                if (feeData) {
                    setCurrency(feeData[0]?.currency);
                }
            })
            .catch((error) => {
                if (error.message.includes('not found')) {
                    return error;
                }
                alerts.showError(error.message);
            }).finally(() => {
                setLinearDisplay('none');
            });
    }

    function handleFeeItemsCreation() {
        setDisabledButton(true);
        setLinearDisplay('block');
        const createFeeItemRequest = {
            narrative: narrative,
            amount: amount,
            currency: currency,
            programCohortSemesterId: programCohortSemesterId
        };
        FeesManagementService.createFeesItems(createFeeItemRequest)
            .then(() => {
                alerts.showSuccess('Successfully created a fee item');
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisabledButton(false);
                getFeesItems(programCohortSemesterId);
                resetState();
            });
    }

    function updateFeeItem(feeItemId, updates) {
        setLinearDisplay('block');
        setDisabledButton(true);
        FeesManagementService.updateFeesItems(updates)
            .then(() => {
                alerts.showSuccess('Successfully updated a fee item');
            })
            .catch((error) => {
                alerts.showError(error.response.data);
            })
            .finally(() => {
                getFeesItems(programCohortSemesterId);
                resetState();
                setDisabledButton(false);
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

    interface programCohortSemesterBody {
        status: string;
        examCutOffDate?: string;
        anticipatedStartDate?: string;
        numberOfSlots?: string;
    }
    function publishProgramCohort(status: string) {
        setLinearDisplay('block');
        setDisabledButton(true);
        let programCohortSemester: programCohortSemesterBody;
        let message: string;

        if (status === 'PENDING') {
            programCohortSemester = {
                status: 'PUBLISHED',
                examCutOffDate: examCutOffDate,
                anticipatedStartDate: anticipatedStartDate,
                numberOfSlots: numOfSlots
            };
            message = 'Successfully published program cohort semester';
        } else {
            programCohortSemester = {
                status: 'PENDING'
            };
            message = 'Successfully unpublished program cohort semester';
        }

        ProgramCohortService.publishProgramCohortSemester(programCohortSemesterId, programCohortSemester)
            .then(() => {
                alerts.showSuccess(message);
                togglePublishSemesterModal();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                resetState();
                toggleConfirmPublishModal();
                fetchCourseCohortBySemesterId('course', semesterId, programCohortId);
                setDisabledButton(false);
                setShowModal(false);
                setConfirmPublishModal(false);

            });
    }

    const resetState = (): void => {
        setFeeItemId(null);
        setNarrative('');
        setAmount(0);
        setShowModal(false);
        setShowPublishModal(false);
        setConfirmModal(false);
    };

    // create fee items
    const createFeeItemModal = () => {
        setShowModal(true);
    };
    const closeCreateFeeItemModal = () => {
        setShowModal(false);
    };
    //publish program cohort semester
    const togglePublishSemesterModal = () => {
        showPublishModal ? setShowPublishModal(false) : setShowPublishModal(true);
    };
    const showCancelSemesterModal = () => {
        showCancelModal ? resetState() : setShowCancelModal(true);
    };
    const toggleConfirmPublishModal = () => {
        showPublishModal ? setConfirmPublishModal(false) : setConfirmPublishModal(true);
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
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
                <div>
                    <Button
                        className="float-center"
                        variant="danger"
                        onClick={() => {
                            programCohortSemesterStatus.toLowerCase() === 'pending'
                                ? togglePublishSemesterModal()
                                : toggleConfirmPublishModal();
                        }}
                    >
                        {programCohortSemesterStatus.toLowerCase() === 'pending' ? 'Publish' : 'Unpublish'}
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
                                    options={{}}
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
                                            createFeeItemModal();
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
                                    options={{ actionsColumnIndex: -1 }}
                                    actions={[
                                        {
                                            icon: Edit,
                                            tooltip: 'Edit Row',
                                            onClick: (event, rowData) => {
                                                setFeeItemId(rowData.id);
                                                setSelectedNarrative(rowData.narrative);
                                                setSelectedAmount(rowData.amount);
                                                setSelectedCurrency(rowData?.currency);
                                                createFeeItemModal();
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
                onHide={closeCreateFeeItemModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {feeItemId ? 'Edit fee item' : `Create a fee item for ${programName}`}
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
                                value={feeItemId ? selectedNarrative : narrative}
                                onChange={(e) => (feeItemId ? setSelectedNarrative(e.target.value) : setNarrative(e.target.value))}
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
                                value={feeItemId ? selectedAmount : amount}
                                onChange={(e) => (feeItemId ? setSelectedAmount(e.target.value) : setAmount(e.target.value))}
                            />
                            <br />
                            <label htmlFor="currency">
                                <b>Currency</b>
                            </label>
                            <br />
                            <SelectCurrency
                                style={selectStyle}
                                name="currency"
                                value={feeItemId ? selectedCurrency : currency}
                                onChange={(e) => (feeItemId ? setSelectedCurrency(e.target.value) : setCurrency(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-info float-right"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleConfirmModal();
                                }}
                            >
                                Submit
                            </button>
                            <button
                                className="btn btn-danger float-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeCreateFeeItemModal();
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </ValidationForm>
                </Modal.Body>
            </Modal>
            <ModalWrapper
                title={programCohortSemesterStatus.toLowerCase() === 'published' ? 'Unpublish' : 'Publish ' + `${programName}`}
                show={showPublishModal}
                closeModal={togglePublishSemesterModal}
                modalSize="lg"
                noFooter
            >
                {programCohortSemesterStatus.toLowerCase() !== 'published' && (
                    <ValidationForm
                        onSubmit={(e) => {
                            e.preventDefault();
                            setConfirmPublishModal(true);
                        }}
                    >
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
                                defaultValue={semStartDate}
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
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-danger float-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    togglePublishSemesterModal();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info float-right">Publish</button>
                        </div>
                    </ValidationForm>
                )}
            </ModalWrapper>
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
            <ConfirmationModalWrapper
                disabled={disabledButton}
                show={confirmPublishModal}
                closeModal={() => setConfirmPublishModal(false)}
                submitButton
                submitFunction={() => publishProgramCohort(programCohortSemesterStatus)}
                title=""
            >
                {programCohortSemesterStatus.toLowerCase() !== 'published' ? (
                    <h6>
                        Publishing a semester for {programCohortCode} will disable you from adding semesters to this semester for the
                        course, continue?
                    </h6>
                ) : (
                    <h6>Are you sure you want to unpublish {programCohortCode}?</h6>
                )}
            </ConfirmationModalWrapper>

            <ConfirmationModalWrapper
                disabled={disabledButton}
                submitButton
                submitFunction={feeItemId ? handleEdit : handleFeeItemsCreation}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <>
                    <h6>
                        {feeItemId
                            ? `Are you sure you want to update ${selectedNarrative} ?`
                            : `Are you sure you want to create a fee item for ${programName} ?`}
                    </h6>
                </>
            </ConfirmationModalWrapper>
        </>
    );
}

export default ProgramCohortSemesterDetails;
