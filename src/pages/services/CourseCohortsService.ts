import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import { simsAxiosInstance } from '../../utlis/interceptors/sims-interceptor';
import CourseCohort from './CourseCohort';
export class CourseCohortService {
    static async fetchSemestersByProgramCohortId(loadExtras: string, programCohortId?: string): Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', { params: { programCohortId: programCohortId, loadExtras: loadExtras } });
    }
    static async fetchCourseCohortBySemesterId(loadExtras: string, semesterId?: string, programCohortId?: string): Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', {
            params: { programCohortId: programCohortId, semesterId: semesterId, loadExtras: loadExtras }
        });
    }
    static async  fetchCourses (loadExtras:string, studentId:number, courseId:number, programCohortId:string):Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', {params:{ studentId, courseId, programCohortId, loadExtras}});
    }
    static async getTranscript (programCohortId:string,semesterId:number):Promise<void> {
        return simsAxiosInstance.get('/transcripts',{params:{ programCohortId,semesterId}});
    }
    static async creditTransfer (studentId:number, credit:unknown):Promise<void> {
        return simsAxiosInstance.post(`/course-cohort-registration-marks/${studentId}`, credit);
    }
}
