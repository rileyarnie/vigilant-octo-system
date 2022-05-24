import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
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
}
