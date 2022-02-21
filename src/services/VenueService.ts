import axios from 'axios';
import Config from '../../src/config';
import Venue from './Trainer';
const timetablingSrv = Config.baseUrl.timetablingSrv;
export class VenueService {
    static async fetchVenues(): Promise<Venue[]> {
        return await axios.get(`${timetablingSrv}/venues`);
    }
}
