import axios from 'axios'
import Config from '../../config'
import FeeItem from './FeeItem'
const financeSrv = Config.baseUrl.financeSrv
export class FeesManagementService {
    static  async createFeesItems (feeItem: object): Promise<FeeItem[]> {
        return axios.post(`${financeSrv}/fee-items`,{createFeeItemReqest: feeItem})
    }
    static  async updateFeesItems (update: object): Promise<FeeItem[]> {
        return axios.put(`${financeSrv}/fee-items`, update)
    }
    static  async getFeesItems (programCohortSemesterId?: string): Promise<FeeItem[]> {
        return axios.put(`${financeSrv}/fee-items`,{params: { programCohortSemesterId: programCohortSemesterId}})
    }

}