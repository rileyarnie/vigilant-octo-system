import axios from 'axios'
import Config from '../../config'
import FeeItem from './FeeItem'
const timetablingSrv = Config.baseUrl.timetablingSrv
const financeSrv = Config.baseUrl.financeSrv
export class FeesManagementService {
	static  async createFeesItems (feeItem: object): Promise<FeeItem[]> {
		return axios.post(`${financeSrv}/fee-items`, feeItem)
	}
	static  async updateFeesItems (update: object): Promise<FeeItem[]> {
		return axios.put(`${financeSrv}/fee-items`, update)
	}

}