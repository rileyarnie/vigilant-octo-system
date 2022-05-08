/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {LinearProgress} from '@material-ui/core';
import {Breadcrumb, Button, Card, Col, Row} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {WorkFlowService} from '../../services/WorkFlowService';
import TableWrapper from '../../utlis/TableWrapper';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

interface Approval {
    id: number;
    action_name: string;
    requester: string;
    payload: string;
}
const ActionApprovals = () => {
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [actionApprovalId, setActionApprovalId] = useState(0);
    const [approvals, setApprovals] = useState<Approval[]>();
    const alerts: Alerts = new ToastifyAlerts();
    const [approveModal, setApproveModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const[disabled,setDisabled] = useState(false);

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
                            toggleApproveModal();
                            setActionApprovalId(row.id);
                        }}
                    >
                        Approve
                    </Button>{ ' '}
                    <Button
                        className="mr-2 btn-danger"
                        variant="sm"
                        onClick={() => {
                            toggleRejectModal();
                            setActionApprovalId(row.id);
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
        setLinearDisplay('block');
        WorkFlowService.fetchActionApprovals()
            .then((res) => {
                const myData = res['data'];
                setApprovals(myData);
                setLinearDisplay('none');
            })
            .catch((err) => {
                console.log('err', err);
                alerts.showError(err.message);
            });
    }
    const handleApprove = (actionApprovalId:number) => {
        const approvalStatus = {
            approvalStatus: 'approved'
        };
        WorkFlowService.handleApprovals(actionApprovalId, approvalStatus)
            .then(() => {
                alerts.showSuccess('Action approved successfully');
                fetchApprovals();
            })
            .catch((err) => {
                alerts.showError(err.message);
                toggleCloseApproveModal();
            }).finally(()=>{
                setLinearDisplay('none');
                setDisabled(false);
            });
    };
    const handleReject = (actionApprovalId:number) => {
        setLinearDisplay('block');
        setDisabled(true);
        const approvalStatus = {
            approvalStatus: 'rejected'
        };
        WorkFlowService.handleApprovals(actionApprovalId, approvalStatus)
            .then(() => {
                alerts.showSuccess('Action rejected Successfully');
                fetchApprovals();
            })
            .catch((err) => {
                alerts.showError(err.message);
                toggleCloseApproveModal();
            }).finally(()=>{
                setLinearDisplay('none');
                setDisabled(false);
            });
    };
    const toggleApproveModal = () => {
        setApproveModal(true);
    };
    const toggleCloseApproveModal = () => {
        setApproveModal(false);
    };
    const toggleRejectModal = () => {
        setRejectModal(true);
    };
    const toggleCloseRejectModal = () => {
        setRejectModal(false);
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
                        <TableWrapper title="Approval Requests" columns={columns} data={approvals} options={{}} />
                    </Card>
                </Col>
            </Row>
            <ConfirmationModalWrapper disabled={disabled}
                submitButton
                submitFunction={() => {handleApprove(actionApprovalId);
                }}
                closeModal={toggleCloseApproveModal}
                show={approveModal}
            >
                <h6 className="text-center">Are you sure you want to Approve ?</h6>
            </ConfirmationModalWrapper>

            <ConfirmationModalWrapper disabled={disabled}
                submitButton
                submitFunction={() => {handleReject(actionApprovalId);
                }}
                closeModal={toggleCloseRejectModal}
                show={rejectModal}
            >
                <h6 className="text-center">Are you sure you want to Reject ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};
export default ActionApprovals;
