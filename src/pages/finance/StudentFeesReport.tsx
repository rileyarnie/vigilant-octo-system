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
import { Icons } from 'material-table';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
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
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { MenuItem, Select, Switch } from '@material-ui/core';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
import RecordFeePayment from './RecordFeePayment';
import FeeWaiver from './FeeWaiver';
import Invoice from './Invoice';
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
const StudentFeeReport = (): JSX.Element => {
    const [data, setData] = useState([]);
    const [isError] = useState(false);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [narrative, setNarrative] = useState('');
    const [transactionId, setTransactionId] = useState(0);
    const [amount, setAmount] = useState('');
    const [showModal, setModal] = useState(false);
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
    const openInvoiceModalHandler = () => {
        setShowInvoice(true);
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
    useEffect(()=>{
        fetchFeesData(studentId);
    },[studentId]);
    function fetchFeesData (studentId:number) {
        StudentFeesManagementService.fetchFeesReport(studentId)
            .then(res=>{
                const feesData = res['data'];
                setFeeBalance(feesData.balance);
                setData(feesData.entries);

            })
            .catch((error)=>{
                console.error(error);
                alerts.showError(error.message);
            });
    }
    function handleReversal(studentId:number) {
        const createFeeRecord = {
            transactionId:transactionId
        };
        StudentFeesManagementService.handleFeeReversal(studentId)
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
                        <MaterialTable
                            title={`Fee Reports For ${studentName}`}
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            components={{
                                Toolbar: (props) => (
                                    <div>
                                        <MTableToolbar {...props} />
                                    </div>
                                )
                            }}
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
                        <Button variant="info" onClick={handleClose} autoFocus>
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
