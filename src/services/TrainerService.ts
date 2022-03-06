import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';
import Trainer from './Trainer';

export class TrainerService {
    static async fetchTrainers(): Promise<Trainer[]> {
        return await timetablingAxiosInstance.get('/trainers');
    }
}
