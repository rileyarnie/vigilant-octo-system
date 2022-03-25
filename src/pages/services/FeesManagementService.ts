import { financeAxiosInstance } from '../../utlis/interceptors/finance-interceptor';
import FeeItem from './FeeItem';
export class FeesManagementService {
    static async createFeesItems(createFeeItemRequest: unknown): Promise<FeeItem[]> {
        return financeAxiosInstance.post('/fee-items', { createFeeItemRequest });
    }
    static async updateFeesItems(update: unknown): Promise<FeeItem[]> {
        return financeAxiosInstance.put('/fee-items', update);
    }
    static async getFeesItems(programCohortSemesterId: string): Promise<FeeItem[]> {
        return financeAxiosInstance.get('/fee-items', { params: { programCohortSemesterId: programCohortSemesterId } });
    }
}
