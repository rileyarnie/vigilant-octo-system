import axios from 'axios'
import Config from '../../src/config'
import Semester from './Semester'
import TimetablingUnit from './TimetableUnit'
const timetablingSrv = Config.baseUrl.timetablingSrv
export class TimetableService {
    static async createTimetableUnit (timetableUnit: object):Promise<void> {
        return axios.post(`${timetablingSrv}/timetabling-units`, timetableUnit)
    }
    static async updateTimetableUnit (timetableUnitData: object):Promise<void> {
        return axios.put(`${timetablingSrv}/timetabling-units`, timetableUnitData)
    }
    static async getTimetableUnit (semesterId?:number): Promise<TimetablingUnit[]> {
        return axios.get(`${timetablingSrv}/timetabling-units`, {params: { semesterId: semesterId}})
    }
}