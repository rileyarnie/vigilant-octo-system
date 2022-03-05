import axios from 'axios';
import Config from '../../src/config';
import ApprovingRoles from './ApprovingRoles';
import Role from './Role';
import Approval from './Approval';
const authnzSrv = Config.baseUrl.authnzSrv;

export class WorkFlowService {
    static async fetchRoles(): Promise<Role[]> {
        return await axios.get(`${authnzSrv}/roles`);
    }

    static async fetchActionApprovers(actionName: string): Promise<ApprovingRoles[]> {
        return await axios.get(`${authnzSrv}/actions/${actionName}/approvers`);
    }

    static async handleSubmitWorkFlow(actionName: string, approveringRoles: ApprovingRoles[]): Promise<void> {
        return await axios.post(`${authnzSrv}/actions/${actionName}/approving-roles`, approveringRoles);
    }

    static async fetchActionApprovals(config: unknown): Promise<void> {
        return await axios.get(`${authnzSrv}/action-approvals/mine`, config);
    }

    static async handleApprovals(actionApprovalId:number, config, approvalStatus:Approval): Promise<void> {
        return await axios.put(`${authnzSrv}/action-approvals/${actionApprovalId}`, approvalStatus,{ headers: config });
    }
}
