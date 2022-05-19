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

const Transactions = (): JSX.Element => {
    const alerts: Alerts = new ToastifyAlerts();
    const [data, setData] = useState([{ id: 1, date: 'today', description: 'the description', balance: 'balance' }]);
    const [feePaymentModal, setFeePaymentModal] = useState(false);
    const [feeWaiverModal, setFeeWaiverModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [student, setStudent] = useState('');
    const [transactionDetailsModal, setTransactionDetailsModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [selectError, setSelectError] = useState(true);

    const columns = [
        { title: 'Transaction ID', field: 'id' },
        { title: 'Transaction Date', field: 'date' },
        { title: 'Narrative', field: 'description' },
        { title: 'Amount', field: 'description' },
        { title: 'Balance', field: 'balance' },
        {
            title: 'Actions',
            render: (row) => (
                <Button variant="info" onClick={() => handleTransactionDetails(row)}>
                    View Details
                </Button>
            )
        }
    ];

    const FeePaymentHandler = () => {
        console.log('fee payment submitted');
    };
    const FeeWaiverHandler = () => {
        console.log('fee waiver submitted');
    };

    // const promiseOptions = [];
    const promiseOptions = (inputValue: string) =>
        new Promise((resolve) => {
            setTimeout(() => {
                inputValue === '' ? resolve([]) : resolve([{ value: 'yellow', label: 'Yellow' }]);
            }, 1000);
        });

    const handleInputChange = (e) => {
        setStudent(e.value);
    };

    //close Fee Payment Modal
    const closeFeePaymentModal = () => {
        setFeePaymentModal(false);
        setStudent('');
    };

    //handle Errors
    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };

    //transcation details
    const handleTransactionDetails = (row) => {
        setSelectedRow(row);
        setTransactionDetailsModal(true);
    };

    //handle select
    useEffect(() => {
        if (student.trim() === '') {
            setSelectError(true);
            setDisabled(true);
        } else {
            setSelectError(false);
            setDisabled(false);
        }
    }, [student]);

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
                    {/* <LinearProgress style={{ display: linearDisplay }} /> */}
                    <Row>
                        <Col>
                            <Card>
                                {/* <div>
                                    {iserror && (
                                        <Alert severity="error">
                                            {errorMessages.map((msg, i) => {
                                                return <div key={i}>{msg}</div>;
                                            })}
                                        </Alert>
                                    )}
                                </div> */}
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
                        console.log('formData', formData);
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
                                    loadOptions={promiseOptions}
                                    defaultOptions
                                    // onInputChange={handleInputChange}
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
                                <TextInput
                                    name="currency"
                                    id="currency"
                                    type="text"
                                    required
                                    // value={campusId ? selectedCampusName : campusName}
                                    // placeholder={campusId ? selectedCampusName : campusName}
                                    // onChange={(e) => (campusId ? setSelectedCampusName(e.target.value) : setCampusName(e.target.value))}
                                />
                            </Col>
                            <Col sm={9}>
                                <label htmlFor="amount">
                                    <b>
                                        Amount<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput
                                    name="amount"
                                    id="amount"
                                    type="text"
                                    required
                                    // value={campusId ? selectedCampusName : campusName}
                                    // placeholder={campusId ? selectedCampusName : campusName}
                                    // onChange={(e) => (campusId ? setSelectedCampusName(e.target.value) : setCampusName(e.target.value))}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={12}>
                                <label htmlFor="attachment">
                                    <b>
                                        Supporting Documents<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <FileInput
                                    name="attachment"
                                    id="attachment"
                                    required
                                    fileType={['pdf']}
                                    maxFileSize="2 mb"
                                    errorMessage={{
                                        required: 'Please upload a file',
                                        fileType: 'Only pdf files are allowed',
                                        maxFileSize: 'Max file size is 2 mb'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={12}>
                                <label htmlFor="narrative">
                                    <b>
                                        Narrative<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput
                                    name="narrative"
                                    id="narrative"
                                    multiline
                                    required
                                    // value={this.state.description}
                                    // onChange={this.handleChange}
                                    rows="3"
                                />
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
            <ModalWrapper
                show={feeWaiverModal}
                closeModal={() => setFeeWaiverModal(false)}
                title="Record Fee Waiver"
                modalSize="lg"
                noFooter
            >
                <ValidationForm
                    onErrorSubmit={handleErrorSubmit}
                    onSubmit={(e, formData) => {
                        e.preventDefault();
                        console.log('formData', formData);
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
                                    loadOptions={promiseOptions}
                                    defaultOptions
                                    onInputChange={handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={3}>
                                <label htmlFor="currency">
                                    <b>
                                        Currency<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput
                                    name="currency"
                                    id="currency"
                                    type="text"
                                    required
                                    // value={campusId ? selectedCampusName : campusName}
                                    // placeholder={campusId ? selectedCampusName : campusName}
                                    // onChange={(e) => (campusId ? setSelectedCampusName(e.target.value) : setCampusName(e.target.value))}
                                />
                            </Col>
                            <Col sm={9}>
                                <label htmlFor="amount">
                                    <b>
                                        Amount<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput
                                    name="amount"
                                    id="amount"
                                    type="text"
                                    required
                                    // value={campusId ? selectedCampusName : campusName}
                                    // placeholder={campusId ? selectedCampusName : campusName}
                                    // onChange={(e) => (campusId ? setSelectedCampusName(e.target.value) : setCampusName(e.target.value))}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col sm={12}>
                                <label htmlFor="narrative">
                                    <b>
                                        Narrative<span className="text-danger">*</span>
                                    </b>
                                </label>
                                <TextInput
                                    name="narrative"
                                    id="narrative"
                                    multiline
                                    required
                                    // value={this.state.description}
                                    // onChange={this.handleChange}
                                    rows="3"
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-info float-right">Submit</button>
                        <button type="reset" className="btn btn-danger float-left" onClick={() => setFeeWaiverModal(false)}>
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
                <TransactionDetails data={selectedRow} />
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
