/* eslint-disable react/display-name */
import React,{useState,useEffect} from 'react';
import {forwardRef} from 'react';
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
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Row,Col, Button, Modal} from 'react-bootstrap';
import { MenuItem, Select, Switch } from '@material-ui/core';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { StudentFeesManagementService } from '../../services/StudentFeesManagementService';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
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
const StudentFeeReport = ():JSX.Element => {
    const [data,setData]=useState([
        {id:456, narrative:'Caution Money', amount:4500},
        {id:457, narrative:'Admission', amount:4500},
        {id:458, narrative:'Caution Money', amount:4500},
        {id:459, narrative:'Caution Money', amount:4500},
    ]);
    const [isError]=useState(false);
    const [studentId] = useState(2);
    const [showModal, setModal] = useState(false);
    const [errorMessages]=useState([]);
    const [feeBalance, setFeeBalance] = useState([]);
    const columns=[
        {title:'ID',field:'id'},
        {title:'Narrative',field:'narrative'},
        {title:'Amount',field:'amount'},
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => (
                    <button className="btn btn btn-link" onClick={toggleReversalModal}>Reverse Transaction</button>
            )
        }
    ];
    useEffect(()=>{
    	fetchFeesData(studentId);
    },[studentId]);
    function fetchFeesData (studentId:number) {
    	StudentFeesManagementService.fetchFeesData(studentId)
    		.then(res=>{
    			const feesData = res['data'];
    			setFeeBalance(feesData);
    			setData(feesData.entries);
    		})
    		.catch((error)=>{
    			console.error(error);
    			alerts.showError(error.message);
    		});
    }
    const resetStateCloseModal = () => {
        setModal(false);
    };
    const toggleReversalModal = () => {
        showModal ? resetStateCloseModal() : setModal(true);
    };
    const handleClose = () => {
        showModal ? resetStateCloseModal() : setModal(false);
    };
    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <div>
                            {isError&&
                            <Alert severity='error'>
                                {errorMessages.map((msg,i)=>{
                                    return <div key={i}>{msg}</div>;
                                })}
                            </Alert>
                            }
                        </div>
                        <MaterialTable
                            title='Fees Reports'
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            components={{
                                Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{padding: '0px 10px'}}>
                                            <Button className="float-left" variant="danger" style={{ marginLeft: '1rem' }}>Waiver fees</Button>{' '}
                                            <Button className="float-left" variant="danger" style={{ marginLeft: '1rem' }}>Invoice</Button>{' '}
                                            <h6 style={{ marginLeft: '1rem' }}> Fee Balance: {feeBalance}</h6>
                                        </div>
                                    </div>
                                ),
                            }}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                show={showModal}
                onHide={toggleReversalModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Transaction Reversal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className="form-group">
                            <label htmlFor="departmentName">Narrative</label>
                            <TextInput
                                name="Narrative"
                                id="narrative"
                                type="text"
                            />
                            <br />
                            <label htmlFor="amount">
                                <b>Amount</b>
                            </label>
                            <br />
                            <TextInput  name="amount"  id="amount"
                                type="number"
                                required/>
                            <br />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info float-right">Submit</button>
                        </div>
                    </ValidationForm>
                    <Button className="btn btn-danger btn-rounded float-left" onClick={handleClose}>Cancel</Button>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default StudentFeeReport;
