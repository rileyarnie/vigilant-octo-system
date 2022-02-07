import axios from 'axios'
import Config from '../../src/config'
import CourseCohort from './CourseCohort'
const timetablingSrv = Config.baseUrl.timetablingSrv
class CourseCohortService {
    static async fetchCourseCohorts (loadExtras:string, semesterId?:number): Promise<CourseCohort[]> {
        return axios.get(`${timetablingSrv}/course-cohorts`, {params: { semesterId: semesterId,loadExtras:loadExtras }})
    }

}

export default CourseCohortService