import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';
import CourseCohort from './CourseCohort';
class CourseCohortService {
    static async fetchCourseCohorts(loadExtras: string, semesterId?: number): Promise<CourseCohort[]> {
        return timetablingAxiosInstance.get('/course-cohorts', { params: { semesterId: semesterId, loadExtras: loadExtras } });
    }
    static async updateCourseCohort(courseCohortId: number, updates:unknown){
        console.log('updates obj ', updates);
        return timetablingAxiosInstance.patch(`/course-cohorts/${courseCohortId}`,updates)
            .catch(err => console.log('error occured while assigning a trainer to course cohort',err));
    }
}

export default CourseCohortService;
