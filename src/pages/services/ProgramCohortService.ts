import axios from 'axios'
import Config from '../../config'
import FeeItem from './FeeItem'
const financeSrv = Config.baseUrl.financeSrv
export class ProgramCohortService {
	static  async publishProgramCohortSemester (programCohortSemesterId: string, programCohortSemester: object): Promise<FeeItem[]> {
		return axios.put(`${financeSrv}/program-cohort-semesters/${programCohortSemesterId}`,{ ModifyProgramCohortSemesterRequest: programCohortSemester})
	}

}