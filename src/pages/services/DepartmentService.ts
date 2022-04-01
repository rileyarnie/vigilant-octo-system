import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import Department from './Department';

export class DepartmentService {
    static async getDepartmentByHODTrainerId(id:number):Promise<Department> {
        return await timetablingAxiosInstance.get('/departments/hod/departments', {
            params: {
                hodTrainerId:id
            }
        })
            .then(res => res.data);
    }
}