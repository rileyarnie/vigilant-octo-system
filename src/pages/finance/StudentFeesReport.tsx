/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { MTableToolbar } from 'material-table';
import Card from '@material-ui/core/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Button } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
import RecordFeePayment from './RecordFeePayment';
import FeeWaiver from './FeeWaiver';
import Invoice from './Invoice';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();

const StudentFeeReport = (): JSX.Element => {
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [narrative] = useState('');
    const [transactionId, setTransactionId] = useState(0);
    const [amount] = useState('');
    const [errorMessages] = useState([]);
    const [feeBalance, setFeeBalance] = useState([]);
    const [show, setShow] = useState(false);
    const [showWaiver, setShowWaiver] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const studentId = parseInt(queryParams.get('studentId'));
    const studentName = queryParams.get('studentName');

    const closeModalHandler = () => {
        setShow(false);
    };
    const openModalHandler = () => {
        setShow(true);
    };
    const closeWaiverModalHandler = () => {
        setShowWaiver(false);
    };
    const openWaiverModalHandler = () => {
        setShowWaiver(true);
    };
    const closeInvoiceModalHandler = () => {
        setShowInvoice(false);
    };

    const columns = [
        { title: 'Narrative', field: 'narrative' },
        { title: 'Amount', field: 'amount' },
        {
            title: 'Actions',
            render: (rowData) => (
                <div
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => {
                        handleClickOpen();
                        setTransactionId(rowData.transactionId);
                    }}
                >
                    <p>Reverse Transaction</p>
                </div>
            )
        }
    ];
    useEffect(() => {
        fetchFeesData(studentId);
    }, [studentId]);
    function fetchFeesData(studentId: number) {
        StudentFeesManagementService.fetchFeesReport(studentId)
            .then((res) => {
                const feesData = res['data'];
                setFeeBalance(feesData.balance);
                setData(feesData.entries);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }
    function handleReversal() {
        const reversal = {
            transactionId: transactionId
        };
        StudentFeesManagementService.handleFeeReversal(reversal)
            .then(() => {
                alerts.showSuccess('Successfully reversed transaction');
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                    <div style={{ padding: '0px 10px', display: 'flex', alignItems: 'center' }}>
                        <Button onClick={openWaiverModalHandler} className="float-left" variant="danger" style={{ marginLeft: '1rem' }}>
                            Waive Fees
                        </Button>{' '}
                        <Button className="float-left" variant="danger" style={{ marginLeft: '1rem' }} onClick={openModalHandler}>
                            Record Fee Item
                        </Button>{' '}
                        {/*<Button className="float-left" variant="danger" style={{ marginLeft: '1rem' }} onClick={openInvoiceModalHandler}>*/}
                        {/*    Invoice*/}
                        {/*</Button>{' '}*/}
                        <h6 className="float-left" style={{ marginLeft: '1rem' }}>
                            Fee Balance: {feeBalance}
                        </h6>{' '}
                    </div>
                </Col>
            </Row>
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
                            title={`Fee Reports For ${studentName}`}
                            columns={columns}
                            data={data}
                            components={{
                                Toolbar: (props) => (
                                    <div>
                                        <MTableToolbar {...props} />
                                    </div>
                                )
                            }}
                            options={{ pageSize: 50 }}
                        />
                    </Card>
                </Col>
            </Row>
            <div>
                <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">{'Transaction Reversal'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are about to reverse <b>{narrative}</b> : {amount}. Click <b>{'confirm'}</b> to continue or{' '}
                            <b>{'cancel'}</b> to stop.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="danger" autoFocus onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="info" onClick={handleReversal} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <RecordFeePayment studentId={studentId} show={show} closeModal={closeModalHandler} />
            <FeeWaiver studentId={studentId} show={showWaiver} closeModal={closeWaiverModalHandler} />
            <Invoice show={showInvoice} closeModal={closeInvoiceModalHandler} />
        </>
    );
};
export default StudentFeeReport;
