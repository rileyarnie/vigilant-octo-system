/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { TextInput, ValidationForm, FileInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { canPerformActions } from '../../services/ActionChecker';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import { ACTION_CREATE_FEE_PAYMENT, ACTION_CREATE_FEE_WAIVER, ACTION_GET_FEE_ITEMS } from '../../authnz-library/finance-actions';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import AsyncSelect from 'react-select/async';
import TransactionDetails from './TransactionDetails';
import { simsAxiosInstance } from '../../utlis/interceptors/sims-interceptor';
import debounce from 'lodash.debounce';
import { financeAxiosInstance } from '../../utlis/interceptors/finance-interceptor';
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
import axios from 'axios';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import { LinearProgress } from '@material-ui/core';
import DateRangePickerElement from '../../App/components/DatePicker/DateRangePicker';
import ClearFilter from '../../utlis/TableActionButtons/ClearFilter';

const Transactions = (): JSX.Element => {
    const alerts: Alerts = new ToastifyAlerts();
    const [data, setData] = useState([]);
    const [feePaymentModal, setFeePaymentModal] = useState(false);
    const [feeWaiverModal, setFeeWaiverModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [disableReversalButton, setDisableReversalButton] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [transactionDetailsModal, setTransactionDetailsModal] = useState(false);
    const [dateRangeModal, setDateRangeModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{ id?: number; narrative?: string; amount?: number }>({});
    const [selectError, setSelectError] = useState(true);
    const [submissionData, setSubmissionData] = useState<{
        studentId: number;
        currency: string;
        narrative: string;
        attachment: unknown;
        evidenceUrls?: string;
        amount: number;
    }>({
        studentId: 0,
        currency: '',
        narrative: '',
        evidenceUrls: '',
        amount: 0,
        attachment: {}
    });
    const [attachment, setAttachment] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [recordedBy, setRecordedBy] = useState<{ staffId: number; name: string }>({ staffId: 0, name: '' });
    const [feeBalanceCr, setFeeBalanceCr] = useState(0);
    const [studentNameCr, setStudentNameCr] = useState('');
    const [feeBalanceDr, setFeeBalanceDr] = useState(0);
    const [studentNameDr, setStudentNameDr] = useState('');
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [disableFilterButton, setDisableFilterButton] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [filterDates, setFilterDates] = useState('');

    //daterange state
    const [dateRange, setDateRange] = useState<
        [
            {
                startDate: Date;
                endDate: Date;
                key: string;
            }
        ]
    >([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const columns = [
        { title: 'Transaction ID', field: 'id' },
        { title: 'Transaction Date', render: (row) => new Date(row.transactionDate).toLocaleDateString() },
        { title: 'Narrative', field: 'narrative' },
        { title: 'Amount', render: (row) => `${row.currency} ${row.amount}` },
        {
            title: 'Actions',
            render: (row) => (
                <Button
                    variant="info"
                    onClick={() => {
                        setSelectedRow(row);
                        handleTransactionDetails(row);
                    }}
                >
                    View Details
                </Button>
            )
        }
    ];

    const handleFileUpload = () => {
        const form = new FormData();
        form.append('attachment', attachment);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        StudentFeesManagementService.uploadSupportDocument(form, config)
            .then((res) => {
                alerts.showSuccess('File uploaded successfully');
                setAttachmentUrl(res['data']);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };

    function handleReversal(transactionId: number) {
        setLinearDisplay('block');
        const reversal = {
            transactionId: transactionId
        };
        setDisableReversalButton(true);
        StudentFeesManagementService.handleFeeReversal(reversal)
            .then(() => {
                alerts.showSuccess('Successfully reversed transaction');
                setTransactionDetailsModal(false);
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisableReversalButton(false);
            });
    }

    // StudentId, narrative, currency and amount are required fields for this request
    const FeePaymentHandler = () => {
        setDisabled(true);
        setLinearDisplay('block');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { attachment, ...data } = submissionData;
        const feeRecord = { ...data, evidenceUrls: attachmentUrl };
        StudentFeesManagementService.recordFeesReport(feeRecord)
            .then(() => {
                alerts.showSuccess('Fee record created successfuly');
                setFeePaymentModal(false);
                getTransactions();
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabled(false);
                setConfirmModal(false);
                setLinearDisplay('none');
            });
    };
    const FeeWaiverHandler = () => {
        setDisabled(true);
        setLinearDisplay('block');

        StudentFeesManagementService.applyWaiver(submissionData)
            .then(() => {
                alerts.showSuccess('Fee Record created successfully');
                getTransactions();
                setFeeWaiverModal(false);
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setDisabled(false);
                setConfirmModal(false);
                setLinearDisplay('none');
            });
    };

    //get transactions
    const getTransactions = () => {
        setLinearDisplay('block');
        setDisableFilterButton(true);
        financeAxiosInstance
            .get('/transactions')
            .then((res) => {
                setFilterName('');
                setFilterDates('');
                setData(res.data);
            })
            .catch((err) => {
                alerts.showError(err.message);
            })
            .finally(() => {
                setLinearDisplay('none');
                setDisableFilterButton(false);
            });
    };

    //filter transactions
    const filterTranscations = (filter: string, id?: number, name?: string, dates?: [{ startDate: Date; endDate: Date; key: string }]) => {
        let params;
        setLinearDisplay('block');
        const formattedStartDate = dates && new Date(dates[0].startDate).toISOString().split('T')[0];
        const formattedEndDate = dates && new Date(dates[0].endDate).toISOString().split('T')[0];

        if (filter === 'student') {
            params = { studentId:id };
            setFilterDates('');
        } else {
            params = {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            };
            setFilterName('');
        }

        closeDateRangeModal();
        financeAxiosInstance
            .get('/transactions', { params })
            .then((res) => {
                setData(res.data);
                setStudentId(null);
                setFilterName(name);
                setFilterDates(`from ${formattedStartDate} to ${formattedEndDate}`);
            })
            .catch((err) => {
                console.error('err.message', err.message);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    };

    const closeDateRangeModal = () => {
        setDateRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
        setDateRangeModal(false);
    };

    useEffect(() => {
        getTransactions();
    }, []);

    //get students options
    const promiseOptions = (inputValue: string) => {
        const url = `program-cohort-applications/student/${inputValue}`;
        return simsAxiosInstance
            .get(url)
            .then((res) => {
                const responseData = res.data;
                const options = responseData.map((item) => ({ value: item.studentId, label: `${item.firstName} ${item.lastName}` }));
                return options;
            })
            .catch((err) => {
                console.error('err.message', err.message);
            });
    };

    // debounce to avoid too many calls
    // const loadStudents = debounce(promiseOptions, 300);
    const loadOptions = React.useCallback(
        debounce((inputText, callback) => {
            promiseOptions(inputText).then((options) => callback(options));
        }, 1000),
        []
    );

    const handleInputChange = (e) => {
        setStudentId(e.value);
    };
    const handleFilterInputChange = (e) => {
        setStudentId(e.value);
        filterTranscations('student', e.value, e.label);
    };

    //close Fee Payment Modal
    const closeFeePaymentModal = () => {
        setFeePaymentModal(false);
        setStudentId('');
    };

    //close fee waiver modal

    const closeFeeWaiverModal = () => {
        setFeeWaiverModal(false);
        setStudentId('');
    };

    //handle Errors
    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

    //transcation details
    const handleTransactionDetails = (row) => {
        const getStaffByUserId = timetablingAxiosInstance.get(`/staff/${row.created_by_user_id}`);
        const getCrStudentDetails = row.crAccount.studentId
            ? simsAxiosInstance.get('/program-cohort-applications', {
                params: {
                    studentId: row.crAccount.studentId
                }
            })
            : null;
        const getDrStudentDetails = row.drAccount.studentId
            ? simsAxiosInstance.get('/program-cohort-applications', {
                params: {
                    studentId: row.drAccount.studentId
                }
            })
            : null;

        const getCrStudentBalance = row.crAccount.studentId
            ? financeAxiosInstance.get('/fees/reports', {
                params: {
                    studentId: row.crAccount.studentId
                }
            })
            : null;
        const getDrStudentBalance = row.drAccount.studentId
            ? financeAxiosInstance.get('/fees/reports', {
                params: {
                    studentId: row.drAccount.studentId
                }
            })
            : null;
        // open details modal after all requests are succesful
        axios
            .all([getStaffByUserId, getCrStudentDetails, getDrStudentDetails, getCrStudentBalance, getDrStudentBalance])
            .then(
                axios.spread((...responses) => {
                    const staff = responses[0] && responses[0].data;
                    setRecordedBy({ staffId: staff.id, name: staff.name });
                    const studentCrFirstName = responses[1] && responses[1]?.data[0].firstName;
                    const studentCrLastName = responses[1] && responses[1]?.data[0].lastName;
                    setStudentNameCr(`${studentCrFirstName} ${studentCrLastName}`);
                    const studentDrFirstName = responses[2] && responses[2].data[0]?.firstName;
                    const studentDrLastName = responses[2] && responses[2].data[0]?.lastName;
                    setStudentNameDr(`${studentDrFirstName} ${studentDrLastName}`);
                    const balanceCr = responses[3] && responses[3].data.balance;
                    setFeeBalanceCr(balanceCr);
                    const balanceDr = responses[4] && responses[4].data.balance;
                    setFeeBalanceDr(balanceDr);
                })
            )
            .catch((err) => alerts.showError(err.message))
            .finally(() => {
                setTransactionDetailsModal(true);
            });
    };

    //handle select
    useEffect(() => {
        if (!studentId) {
            setSelectError(true);
            setDisabled(true);
        } else {
            setSelectError(false);
            setDisabled(false);
        }
    }, [studentId]);

    return (
        <>
            <Row className="align-items-center page-header">
                <Col md={4}>
                    <Breadcrumb />
                </Col>
                <Col md={8}>
                    {canPerformActions(ACTION_CREATE_FEE_PAYMENT.name) && (
                        <Button className="float-right ml-4" variant="danger" onClick={() => setFeePaymentModal(true)}>
                            Record Fee Payment
                        </Button>
                    )}

                    {canPerformActions(ACTION_CREATE_FEE_WAIVER.name) && (
                        <Button className="float-right ml-4" variant="danger" onClick={() => setFeeWaiverModal(true)}>
                            Record Fee Waiver
                        </Button>
                    )}
                    {canPerformActions(ACTION_GET_FEE_ITEMS.name) && (
                        <Button className="float-right" variant="info" onClick={() => setDateRangeModal(true)}>
                            Filter By Dates
                        </Button>
                    )}
                    {canPerformActions(ACTION_GET_FEE_ITEMS.name) && (
                        <Row>
                            <Col>
                                <AsyncSelect
                                    id="studentOptions"
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    onChange={handleFilterInputChange}
                                    placeholder="Filter by student"
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    value={studentId}
                                />
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>

            {canPerformActions(ACTION_GET_FEE_ITEMS.name) && (
                <>
                    <LinearProgress style={{ display: linearDisplay }} />
                    <Row>
                        <Col>
                            <Card>
                                <TableWrapper
                                    title={
                                        filterName
                                            ? `Transactions for ${filterName}`
                                            : filterDates
                                                ? `Transactions ${filterDates}`
                                                : 'Transactions'
                                    }
                                    columns={columns}
                                    options={{ actionsColumnIndex: -1 }}
                                    data={data}
                                    components={{
                                        Action: (props) => (
                                            <ClearFilter
                                                disableFilterButton={disableFilterButton}
                                                clearFilter={getTransactions}
                                                {...props}
                                            />
                                        )
                                    }}
                                    actions={[
                                        {
                                            icon: ClearFilter,
                                            isFreeAction: true
                                        }
                                    ]}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            <ModalWrapper show={feePaymentModal} closeModal={closeFeePaymentModal} title="Record Fee Payment" modalSize="lg" noFooter>
                <ValidationForm
                    onErrorSubmit={handleErrorSubmit}
                    onSubmit={(e, formData) => {
                        e.preventDefault();
                        setSubmissionData({ ...formData, amount: parseInt(formData.amount), studentId });
                        setConfirmModal(true);
                    }}
                >
                    <div className="form-group">
                        <Row>
                            <Col sm={12}>
                                <label htmlFor="studentOptions">
                                    <b>
                                        Select Student<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <AsyncSelect
                                    id="studentOptions"
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    onChange={handleInputChange}
                                    placeholder="Search for student"
                                />
                                {selectError && <p className="text-danger">Please Select Student</p>}
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={3}>
                                <label htmlFor="currency">
                                    <b>
                                        Currency<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput name="currency" id="currency" type="text" required />
                            </Col>
                            <Col sm={9}>
                                <label htmlFor="amount">
                                    <b>
                                        Amount<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput name="amount" id="amount" type="text" required />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <label htmlFor="attachment">
                                <b>Supporting Documents</b>
                            </label>
                            <Col sm={9}>
                                <FileInput
                                    name="attachment"
                                    id="attachment"
                                    required={attachmentUrl ? true : false}
                                    onChange={(event) => setAttachment(event.target.files[0])}
                                    fileType={['pdf']}
                                    maxFileSize="2 mb"
                                    errorMessage={{
                                        required: 'Please upload a file',
                                        fileType: 'Only pdf files are allowed',
                                        maxFileSize: 'Max file size is 2 mb'
                                    }}
                                />
                            </Col>
                            <Col sm={3}>
                                <Button disabled={!attachment} className="float-right" variant="info" onClick={handleFileUpload}>
                                    Upload
                                </Button>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={12}>
                                <label htmlFor="narrative">
                                    <b>
                                        Narrative<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput name="narrative" id="narrative" multiline required rows="3" />
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-info float-right" disabled={disabled}>
                            Submit
                        </button>
                        <button type="reset" className="btn btn-danger float-left" onClick={closeFeePaymentModal}>
                            Close
                        </button>
                    </div>
                </ValidationForm>
            </ModalWrapper>
            <ModalWrapper show={feeWaiverModal} closeModal={closeFeeWaiverModal} title="Record Fee Waiver" modalSize="lg" noFooter>
                <ValidationForm
                    onErrorSubmit={handleErrorSubmit}
                    onSubmit={(e, formData) => {
                        e.preventDefault();
                        setSubmissionData({ ...formData, amount: parseInt(formData.amount), studentId });
                        setConfirmModal(true);
                    }}
                >
                    <div className="form-group">
                        <Row>
                            <Col sm={12}>
                                <label htmlFor="studentOptions">
                                    <b>
                                        Select Student<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <AsyncSelect
                                    id="studentOptions"
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    onChange={handleInputChange}
                                    placeholder="Search for student"
                                />
                                {selectError && <p className="text-danger">Please Select Student</p>}
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={3}>
                                <label htmlFor="currency">
                                    <b>
                                        Currency<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput name="currency" id="currency" type="text" required />
                            </Col>
                            <Col sm={9}>
                                <label htmlFor="amount">
                                    <b>
                                        Amount<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput name="amount" id="amount" type="text" required />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={12}>
                                <label htmlFor="narrative">
                                    <b>
                                        Narrative<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput name="narrative" id="narrative" multiline required rows="3" />
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <button disabled={disabled} className="btn btn-info float-right">
                            Submit
                        </button>
                        <button type="reset" className="btn btn-danger float-left" onClick={closeFeeWaiverModal}>
                            Close
                        </button>
                    </div>
                </ValidationForm>
            </ModalWrapper>
            <ModalWrapper
                title="Transaction Details"
                show={transactionDetailsModal}
                closeModal={() => setTransactionDetailsModal(false)}
                modalSize="lg"
            >
                <TransactionDetails
                    data={selectedRow}
                    staff={recordedBy}
                    balanceCr={feeBalanceCr}
                    studentNameCr={studentNameCr}
                    studentNameDr={studentNameDr}
                    balanceDr={feeBalanceDr}
                    supportingDocument={attachmentUrl}
                    handleReversal={handleReversal}
                    transactionId={selectedRow.id}
                    disabled={disableReversalButton}
                />
            </ModalWrapper>
            <ConfirmationModalWrapper
                show={confirmModal}
                closeModal={() => setConfirmModal(false)}
                disabled={disabled}
                submitButton
                submitFunction={feePaymentModal ? FeePaymentHandler : FeeWaiverHandler}
            >
                <LinearProgress style={{ display: linearDisplay }} />
                <b>
                    <h5>Are you sure you want to Submit {feePaymentModal ? 'Fee Payment' : 'Fee Waiver'}?</h5>
                </b>
            </ConfirmationModalWrapper>
            <ModalWrapper
                show={dateRangeModal}
                modalSize="xl"
                title="Select date range"
                closeModal={closeDateRangeModal}
                submitButton
                submitFunction={() => filterTranscations('dates', undefined, undefined, dateRange)}
            >
                <DateRangePickerElement setDateRange={setDateRange} ranges={dateRange} />
            </ModalWrapper>
        </>
    );
};
export default Transactions;
