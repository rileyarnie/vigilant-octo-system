/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@material-ui/core';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { TextInput, ValidationForm, FileInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_GET_CAMPUSES } from '../../authnz-library/timetabling-actions';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import { ACTION_CREATE_FEE_PAYMENT, ACTION_CREATE_FEE_WAIVER } from '../../authnz-library/finance-actions';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import AsyncSelect from 'react-select/async';
import TransactionDetails from './TransactionDetails';
import { simsAxiosInstance } from '../../utlis/interceptors/sims-interceptor';
import debounce from 'lodash.debounce';
import { financeAxiosInstance } from '../../utlis/interceptors/finance-interceptor';
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
import axios from 'axios';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';

const Transactions = (): JSX.Element => {
    const alerts: Alerts = new ToastifyAlerts();
    const [data, setData] = useState([]);
    const [feePaymentModal, setFeePaymentModal] = useState(false);
    const [feeWaiverModal, setFeeWaiverModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [transactionDetailsModal, setTransactionDetailsModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
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
    const [attachmentUrl, setAttachmentUrl] = useState('link');
    const [recordedBy, setRecordedBy] = useState<{ staffId: number; name: string }>({ staffId: 0, name: '' });
    const [feeBalanceCr, setFeeBalanceCr] = useState(0);
    const [feeBalanceDr, setFeeBalanceDr] = useState(0);

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

    // StudentId, narrative, currency and amount are required fields for this request
    const FeePaymentHandler = () => {
        setDisabled(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { attachment, ...data } = submissionData;
        const feeRecord = { ...data, evidenceUrls: attachmentUrl };
        // eslint-disable-next-line no-debugger
        debugger;
        StudentFeesManagementService.recordFeesReport(feeRecord)
            .then((res) => {
                console.log('res.data', res);
            })
            .catch((error) => {
                console.log('error', error);
            })
            .finally(() => {
                setDisabled(false);
                setConfirmModal(false);
            });
    };
    const FeeWaiverHandler = () => {
        setDisabled(true);
        console.log('submissionData', submissionData);
        console.log('fee waiver submitted');
        StudentFeesManagementService.applyWaiver(submissionData)
            .then(() => {
                alerts.showSuccess('Fee Record created successfully');
                // toggleCloseConfirmModal();
                // props.closeModal();
                getTransactions();
                setFeeWaiverModal(false);
            })
            .catch((error) => {
                // props.closeModal();
                // toggleCloseConfirmModal();
                alerts.showError(error.response.data);
            })
            .finally(() => {
                setDisabled(false);
                setConfirmModal(false);
            });
    };

    //get transactions
    const getTransactions = () => {
        financeAxiosInstance
            .get('/transactions')
            .then((res) => {
                setData(res.data);
                console.log('res.data', res.data);
            })
            .catch((err) => {
                console.log('err.message', err.message);
            })
            .finally(() => {
                console.log('done');
            });
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
                console.log('err.message', err.message);
            });
    };

    // debounce to avoid too many calls
    // const loadStudents = debounce(promiseOptions, 300);
    const loadOptions = React.useCallback(
        debounce((inputText, callback) => {
            promiseOptions(inputText).then((options) => callback(options));
        }, 3000),
        []
    );

    const handleInputChange = (e) => {
        setStudentId(e.value);
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
        const requestOne = timetablingAxiosInstance.get(`/staff/${row.created_by_user_id}`);
        const requestTwo = row.crAccount.studentId
            ? simsAxiosInstance.get('/program-cohort-applications', {
                  params: {
                      studentId: row.crAccount.studentId
                  }
              })
            : null;
        const requestThree = row.drAccount.studentId
            ? simsAxiosInstance.get('/program-cohort-applications', {
                  params: {
                      studentId: row.drAccount.studentId
                  }
              })
            : null;

        const requestFour = row.crAccount.studentId
            ? financeAxiosInstance.get('/fees/reports', {
                  params: {
                      studentId: 5
                  }
              })
            : null;
        const requestFive = row.drAccount.studentId
            ? financeAxiosInstance.get('/fees/reports', {
                  params: {
                      studentId: 5
                  }
              })
            : null;
        console.log('row', row);
        // open details modal after all requests are succesful
        axios
            .all([requestOne, requestFour, requestFive])
            .then(
                axios.spread((...responses) => {
                    console.log('responses', responses);
                    const staff = responses[0] && responses[0].data;
                    setRecordedBy({ staffId: staff.id, name: staff.name });
                    const balanceCr = responses[1] && responses[1].data.balance;
                    setFeeBalanceCr(balanceCr);
                    const balanceDr = responses[2] && responses[2].data.balance;
                    setFeeBalanceDr(balanceDr);
                })
            )
            .then(() => {
                setTransactionDetailsModal(true);
            })
            .catch((err) => alerts.showError(err.message));
    };

    //handle select
    useEffect(() => {
        // // eslint-disable-next-line no-debugger
        // debugger;
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
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    {canPerformActions(ACTION_CREATE_FEE_PAYMENT.name) && (
                        <Button className="float-right ml-4" variant="danger" onClick={() => setFeePaymentModal(true)}>
                            Record Fee Payment
                        </Button>
                    )}

                    {canPerformActions(ACTION_CREATE_FEE_WAIVER.name) && (
                        <Button className="float-right" variant="danger" onClick={() => setFeeWaiverModal(true)}>
                            Record Fee Waiver
                        </Button>
                    )}
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_CAMPUSES.name) && (
                <>
                    {/* <LinearProgress style={{ display: 'block' }} /> */}
                    <Row>
                        <Col>
                            <Card>
                                <TableWrapper title="Transactions" columns={columns} options={{ actionsColumnIndex: -1 }} data={data} />
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
                                <b>
                                    Supporting Documents<span className="text-danger">*</span>
                                </b>
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
                <TransactionDetails data={selectedRow} staff={recordedBy} balanceCr={feeBalanceCr} balanceDr={feeBalanceDr} />
            </ModalWrapper>
            <ConfirmationModalWrapper
                show={confirmModal}
                closeModal={() => setConfirmModal(false)}
                disabled={disabled}
                submitButton
                submitFunction={feePaymentModal ? FeePaymentHandler : FeeWaiverHandler}
            >
                <b>
                    <h5>Are you sure you want to Submit {feePaymentModal ? 'Fee Payment' : 'Fee Waiver'}?</h5>
                </b>
            </ConfirmationModalWrapper>
        </>
    );
};
export default Transactions;
