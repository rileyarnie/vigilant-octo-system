import axios from 'axios';
import FeeReport from './FeeReport';
import FeePaymentRecord from './FeePaymentRecord';
import Config from '../config';
const financeSrv = Config.baseUrl.financeSrv;
const timetablingSrv = Config.baseUrl.timetablingSrv;
export class StudentFeesManagementService {
    // static async  fetchFeesData (studentId: number): Promise<FeeReport[]> {
    //     return axios.get(`${financeSrv}/fee-reports`, {params:{studentId}});
    // }
    static async  handleFeeReversal (studentId: string): Promise<void> {
        return axios.put(`${financeSrv}/fee-reversal`, {params:{studentId}});
    }
    static async  fetchFeesReport (studentId: string): Promise<FeeReport[]> {
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