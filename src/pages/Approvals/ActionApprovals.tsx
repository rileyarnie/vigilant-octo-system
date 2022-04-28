/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@material-ui/core';
import {Breadcrumb, Button, Card, Col, Modal, Row} from 'react-bootstrap';
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
    const [actionApprovalId, setActionApprovalId] = useState(0);
    const [approvals, setApprovals] = useState<Approval[]>();
    const alerts: Alerts = new ToastifyAlerts();
    const [approveModal, setApproveModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
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
                            handleApprove(row.id);
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
    const handleApprove = (actionApprovalId:number) => {
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
    const toggleApproveModal = () => {
        setApproveModal(true);
    };
    const toggleCloseApproveModal = () => {
        setRejectModal(false);
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
            <Modal
                show={approveModal}
                onHide={toggleApproveModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>{' '}</Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">A you sure you want to Approve ?</h6>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseApproveModal}>
                        Cancel
                    </Button>
                    <button className="btn btn-info float-right" onClick={() => handleApprove(actionApprovalId)}>
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={rejectModal}
                onHide={toggleRejectModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>{' '}</Modal.Header>
                <Modal.Body>
                    <h6 className="text-center">A you sure you want to Reject ?</h6>
                </Modal.Body>
                <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="btn btn-danger btn-rounded" onClick={toggleCloseRejectModal}>
                        Cancel
                    </Button>
                    <button className="btn btn-info float-right" onClick={handleReject}>
                        Confirm
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default ActionApprovals;
