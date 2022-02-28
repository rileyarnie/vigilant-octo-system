import axios from 'axios';
import FeeReport from './FeeReport';
import FeePaymentRecord from './FeePaymentRecord';
import Config from '../config';
const financeSrv = Config.baseUrl.financeSrv;
const timetablingSrv = Config.baseUrl.timetablingSrv;
export class StudentFeesManagementService {
    static async  handleFeeReversal (reversal:unknown): Promise<void> {
        return axios.put(`${financeSrv}/fees/reversals`, reversal);
    }
    static async  fetchFeesReport (studentId: number): Promise<FeeReport[]> {
        return axios.get(`${financeSrv}/fees/reports`, {params:{studentId}});
    }
    static async  uploadSupportDocument (form:unknown, config:unknown): Promise<void> {
        return axios.post(`${timetablingSrv}/files`, form, config);
    }
    static async  recordFeesReport (createFeeRecord:FeePaymentRecord): Promise<void> {
        return axios.post(`${financeSrv}/fees/payments`, createFeeRecord );
    }
    static async  applyWaiver (waiver:unknown): Promise<void> {
        return axios.post(`${financeSrv}/fees/waivers`, waiver );
    }

}