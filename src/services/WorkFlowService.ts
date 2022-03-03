import axios from 'axios';
import Config from '../../src/config';
import ApprovingRoles from './ApprovingRoles';
import Role from './Role';
const authnzSrv = Config.baseUrl.authnzSrv;
export class WorkFlowService {
    static async fetchRoles(): Promise<Role[]> {
        return await axios.get(`${authnzSrv}/roles`);
    }
    static async handleSubmitWorkFlow(actionName: string, approveringRoles:ApprovingRoles[]): Promise<void> {
        return await axios.post(`${authnzSrv}/actions/${actionName}/approving-roles`, approveringRoles);
    }
}
