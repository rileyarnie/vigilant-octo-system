import axios from 'axios';
import FeeReport from './FeeReport';
import Config from '../config';
const financeSrv = Config.baseUrl.financeSrv;
export class StudentFeesManagementService {
    static async  fetchFeesData (studentId: number): Promise<FeeReport[]> {
        return axios.get(`${financeSrv}/fee-reports`, {params:{studentId}});
    }

}