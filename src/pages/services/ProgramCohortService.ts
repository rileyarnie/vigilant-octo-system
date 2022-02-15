import axios from 'axios'
import Config from '../../config'
import FeeItem from './FeeItem'
const financeSrv = Config.baseUrl.financeSrv
const timetablingSrv=Config.baseUrl.timetablingSrv
export class ProgramCohortService {
	static  async publishProgramCohortSemester (programCohortSemesterId: string, programCohortSemester: object): Promise<void> {
		return axios.put(`${financeSrv}/program-cohort-semesters/${programCohortSemesterId}`,{ ModifyProgramCohortSemesterRequest: programCohortSemester})
	}
	static  async cancelProgramCohort (cohortId: number, cancelletionData: object): Promise<void> {
		return axios.put(`${timetablingSrv}/program-cohorts/${cohortId}`, cancelletionData)
	}

}