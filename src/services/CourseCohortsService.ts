import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';
import CourseCohort from './CourseCohort';
class CourseCohortService {
    static async fetchCourseCohorts(loadExtras: string, semesterId?: number): Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', { params: { semesterId: semesterId, loadExtras: loadExtras } });
    }
}

export default CourseCohortService;
