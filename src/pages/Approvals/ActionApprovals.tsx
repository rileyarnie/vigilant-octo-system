/* eslint-disable react/display-name */
import { LinearProgress } from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef, useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Row } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { WorkFlowService } from '../../services/WorkFlowService';
interface Approval {
    id: number;
    action_name: string;
    requester: string;
    payload: string;
}
const ActionApprovals = () => {
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
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [actionApprovalId, setActionApprovalId] = useState(0);
    const [approvals, setApprovals] = useState<Approval[]>();
    const alerts: Alerts = new ToastifyAlerts();
    const columns = [
        { title: 'Id', field: 'id' },
        { title: 'Action Name', field: 'action_name' },
        { title: 'Requester', field: 'requester' },
        { title: 'Payload', field: 'payload' },
        {
            title: 'Actions',
            render: (rowData) => (
                <div>
                    <Button className="mr-2 btn-info" variant="sm"
                        onClick={() =>{ 
                            handleApprove();
                            setActionApprovalId(rowData.id);}}>
                        Approve
                    </Button>
                    <Button className="mr-2 btn-danger" variant="sm"
                        onClick={() =>{
                            handleReject();
                            setActionApprovalId(rowData.id);
                        }}>
                        Reject
                    </Button>
                </div>
            )
        }
    ];
    useEffect(() => {
        fetchApprovals();
    }, []);
    function fetchApprovals() {
        const token = localStorage.getItem('idToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        WorkFlowService.fetchActionApprovals(config)
            .then((res) => {
                const myData = res['data'];
                setApprovals(myData);
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(err.message);
            });
    }
    const handleApprove = () => {
        setLinearDisplay('none');
        const token = localStorage.getItem('idToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const approvalStatus = {
            approvalStatus: 'approved',
        };
        WorkFlowService.handleApprovals(actionApprovalId, config, approvalStatus)
            .then(() => {
                alerts.showSuccess('Action approved successfully');
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(err.message);
            });
    };
    const handleReject = () => {
        setLinearDisplay('none');
        const token = localStorage.getItem('idToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const approvalStatus = {
            approvalStatus: 'rejected',
        };
        WorkFlowService.handleApprovals(actionApprovalId, config, approvalStatus)
            .then(() => {
                alerts.showSuccess('Action rejected Successfully');
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(err.message);
            });
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <LinearProgress style={{ display: linearDisplay }} />
            <Row>
                <Col>
                    <Card>
                        <MaterialTable
                            title="Approval Requests"
                            columns={columns}
                            data={approvals}
                            icons={tableIcons}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default ActionApprovals;
