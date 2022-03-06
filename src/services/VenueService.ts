import { timetablingAxiosInstance } from '../utlis/interceptors/timetabling-interceptor';
import Venue from './Trainer';

export class VenueService {
    static async fetchVenues(): Promise<Venue[]> {
        return await timetablingAxiosInstance.get('/venues');
    }
}
