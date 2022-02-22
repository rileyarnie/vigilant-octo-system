import axios from 'axios';
import { Program } from './Program';
import Config from '../../config';
const timetablingSrv = Config.baseUrl.timetablingSrv;

export class ProgramsService {
    static async getProgramByCourseCohortId(courseCohortId:number):Promise<Program[]> {
        return await axios.get(`${timetablingSrv}/programs`,{
            params:{
                courseCohortId:courseCohortId,
                loadExtras: 'program'
            }
        });
    }
}