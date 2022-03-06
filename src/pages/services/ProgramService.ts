import { Program } from './Program';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';

export class ProgramsService {
    static async getProgramByCourseCohortId(courseCohortId:number):Promise<Program[]> {
        return await timetablingAxiosInstance.get('/programs', {
            params: {
                courseCohortId: courseCohortId,
                loadExtras: 'program'
            }
        });
    }
}