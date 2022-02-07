import axios from 'axios'
import Config from '../../src/config'
import Trainer from './Trainer'
const timetablingSrv = Config.baseUrl.timetablingSrv
export class TrainerService {
    static async fetchTrainers(): Promise<Trainer[]> {
        return await axios.get(`${timetablingSrv}/trainers`)
    }
}