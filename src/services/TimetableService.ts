import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';
import TimetablingUnit from './TimetableUnit';

export class TimetableService {

    static async createTimetableUnit(timetableUnit: unknown): Promise<void> {
        return timetablingAxiosInstance.post('/timetabling-units', timetableUnit);
    }
    static async updateTimetableUnit(timetableUnitData): Promise<void> {
        return timetablingAxiosInstance.put(`/timetabling-units/${timetableUnitData.timetablingUnitId}`, { timetableUnitData });
    }
    static async getTimetableUnit(semesterId?: number): Promise<TimetablingUnit[]> {
        return timetablingAxiosInstance.get('/timetabling-units', { params: { semesterId: semesterId } });
    }
    static async getTimetableUnitErrors(semesterid: number): Promise<void> {
        return timetablingAxiosInstance.get('/timetabling-units/errors',{params: {semesterId:semesterid}});
    }
    static async handleFileUpload (form:unknown, config:unknown):Promise<void> {
        return timetablingAxiosInstance.post('/files', form, config);
    }
}
