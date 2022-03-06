import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';
import Semester from './Semester';
export class SemesterService {
    static async fetchSemesters(): Promise<Semester[]> {
        return timetablingAxiosInstance.get('/semesters');
    }

    static async publishTimetable(semesterId: number): Promise<void> {
        return timetablingAxiosInstance.put(`/semesters/${semesterId}`, { body: { isPublished: true } });
    }
}
