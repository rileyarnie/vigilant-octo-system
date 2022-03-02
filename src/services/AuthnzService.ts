import axios from 'axios';
import Config from '../../src/config';
import Role from './Role';
const authnzSrv = Config.baseUrl.authnzSrv;
export class AuthnzService {
    static async fetchRoles(): Promise<Role[]> {
        return await axios.get(`${authnzSrv}/roles`);
    }
    static async handleWorkFlow(actionName: string): Promise<void> {
        return await axios.post(`${authnzSrv}/actions/${actionName}/roles`);
    }
}