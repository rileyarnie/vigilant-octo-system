/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@material-ui/core';
import { Breadcrumb, Button, Card, Col, Row } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { WorkFlowService } from '../../services/WorkFlowService';
import TableWrapper from '../../utlis/TableWrapper';
interface Approval {
    id: number;
    action_name: string;
    requester: string;
    payload: string;
}
const ActionApprovals = () => {
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [actionApprovalId, setActionApprovalId] = useState(1);
    const [approvals, setApprovals] = useState<Approval[]>();
    const alerts: Alerts = new ToastifyAlerts();
    const columns = [
        { title: 'Id', field: 'id' },
        { title: 'Action Name', field: 'approvingRole.action.name' },
        { title: 'Requester', field: 'requesterUserId' },
        { title: 'Payload', field: 'bodyPayload' },
        {
            title: 'Actions',
            render: (row) => (
                <div>
                    <Button
                        className="mr-2 btn-info"
                        variant="sm"
                        onClick={() => {
                            setActionApprovalId(row.id);
                            handleApprove();
                        }}
                    >
                        Approve
                    </Button>
                    <Button
                        className="mr-2 btn-danger"
                        variant="sm"
                        onClick={() => {
                            setActionApprovalId(row.id);
                            handleReject();
                        }}
                    >
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
        WorkFlowService.fetchActionApprovals()
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
        const approvalStatus = {
            approvalStatus: 'approved'
        };
        WorkFlowService.handleApprovals(actionApprovalId, approvalStatus)
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
        const approvalStatus = {
            approvalStatus: 'rejected'
        };
        WorkFlowService.handleApprovals(actionApprovalId, approvalStatus)
            .then(() => {
                alerts.showSuccess('Action rejected Successfully');
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(err.message);
            });
    };
    console.log(approvals);
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
                        <TableWrapper title="Approval Requests" columns={columns} data={approvals} options={{}} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default ActionApprovals;
