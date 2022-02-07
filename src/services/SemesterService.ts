import axios from 'axios'
import Config from '../../src/config'
import Semester from './Semester'
const timetablingSrv = Config.baseUrl.timetablingSrv
export class SemesterService {
    static async fetchSemesters (): Promise<Semester[]> {
        return axios.get(`${timetablingSrv}/semesters`)
    }

}