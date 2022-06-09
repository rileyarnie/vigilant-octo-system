import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import CourseCohort from './CourseCohort';
import {simsAxiosInstance} from '../../utlis/interceptors/sims-interceptor';
export class CourseCohortService {
    static async fetchSemestersByProgramCohortId(loadExtras: string, programCohortId?: string): Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', { params: { programCohortId: programCohortId, loadExtras: loadExtras } });
    }
    static async fetchCourseCohortBySemesterId(loadExtras: string, semesterId?: string, programCohortId?: string): Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', {
            params: { programCohortId: programCohortId, semesterId: semesterId, loadExtras: loadExtras }
        });
    }
    static async getTranscript (programCohortId:string,semesterId:number):Promise<void> {
        return simsAxiosInstance.get('/transcripts',{params:{ programCohortId,semesterId}})
            .then(res => {
                window.open(res.data);
            });
    }
}
