import FeeReport from './FeeReport';
import FeePaymentRecord from './FeePaymentRecord';
import { financeAxiosInstance } from '../utlis/interceptors/finance-interceptor';
import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';

export class StudentFeesManagementService {
    static async handleFeeReversal(reversal: unknown): Promise<void> {
        return financeAxiosInstance.post('/fees/reversals', reversal);
    }
    static async fetchFeesReport(studentId: number): Promise<FeeReport[]> {
        return financeAxiosInstance.get('/fees/reports', { params: { studentId } });
    }
    static async uploadSupportDocument(form: unknown, config: unknown): Promise<void> {
        return timetablingAxiosInstance.post('/files', form, config);
    }
    static async recordFeesReport(createFeeRecord: FeePaymentRecord): Promise<void> {
        return financeAxiosInstance.post('/fees/payments', createFeeRecord);
    }
    static async applyWaiver(waiver: unknown): Promise<void> {
        return financeAxiosInstance.post('/fees/waivers', waiver);
    }
}
