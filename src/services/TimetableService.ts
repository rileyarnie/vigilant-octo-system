import axios from 'axios';
import Config from '../../src/config';
import TimetablingUnit from './TimetableUnit';
const timetablingSrv = Config.baseUrl.timetablingSrv;

export class TimetableService {

    static async createTimetableUnit(timetableUnit: object): Promise<void> {
        return axios.post(`${timetablingSrv}/timetabling-units`, timetableUnit);
    }
    static async updateTimetableUnit(timetableUnitData): Promise<void> {
        return axios.put(`${timetablingSrv}/timetabling-units/${timetableUnitData.timetablingUnitId}`, { timetableUnitData });
    }
    static async getTimetableUnit(semesterId?: number): Promise<TimetablingUnit[]> {
        return axios.get(`${timetablingSrv}/timetabling-units`, { params: { semesterId: semesterId } });
    }
    static async getTimetableUnitErrors(semesterid: number): Promise<void> {
        return axios.get(`${timetablingSrv}/timetabling-units/errors`,{params: {semesterId:semesterid}});
    }
}
