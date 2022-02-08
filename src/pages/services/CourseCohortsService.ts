import axios from 'axios'
import Config from '../../config'
import Semester from './Semester'
import CourseCohort from './CourseCohort'
const timetablingSrv = Config.baseUrl.timetablingSrv
export class CourseCohortService {
    static async fetchSemestersByProgramCohortId (loadExtras:string, programCohortId?:string): Promise<CourseCohort[]> {
        return axios.get(`${timetablingSrv}/course-cohorts`, {params: { programCohortId: programCohortId,loadExtras:loadExtras }})
    }
    static async fetchCourseCohortBySemesterId (loadExtras:string, semesterId?: string, programCohortId?:string): Promise<CourseCohort[]> {
        return axios.get(`${timetablingSrv}/course-cohorts`, {params: { programCohortId: programCohortId, semesterId:semesterId,loadExtras:loadExtras }})
    }

}