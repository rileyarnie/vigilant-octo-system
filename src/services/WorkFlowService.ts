import ApprovingRoles from './ApprovingRoles';
import Role from './Role';
import Approval from './Approval';
import { authnzAxiosInstance } from '../utlis/interceptors/authnz-interceptor';

export class WorkFlowService {
    static async fetchRoles(): Promise<Role[]> {
        return await authnzAxiosInstance.get('/roles');
    }

    static async fetchActionApprovers(actionName: string): Promise<ApprovingRoles[]> {
        return await authnzAxiosInstance.get(`/actions/${actionName}/approvers`);
    }

    static async handleSubmitWorkFlow(actionName: string, approveringRoles: ApprovingRoles[]): Promise<void> {
        return await authnzAxiosInstance.post(`/actions/${actionName}/approving-roles`, approveringRoles);
    }

    static async fetchActionApprovals(): Promise<void> {
        return await authnzAxiosInstance.get('/action-approvals/mine');
    }

    static async handleApprovals(actionApprovalId: number, approvalStatus: Approval): Promise<void> {
        return await authnzAxiosInstance.put(`/action-approvals/${actionApprovalId}`, approvalStatus);
    }
}
