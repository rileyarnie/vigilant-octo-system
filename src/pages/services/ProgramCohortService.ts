import { AxiosResponse } from 'axios';
import { simsAxiosInstance } from '../../utlis/interceptors/sims-interceptor';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import ProgramCohortSemester from './ProgramCohortSemester';
export class ProgramCohortService {
    static async publishProgramCohortSemester(programCohortSemesterId: string, programCohortSemester: unknown): Promise<void> {
        return timetablingAxiosInstance.put(`/program-cohort-semesters/${programCohortSemesterId}`, {
            ModifyProgramCohortSemesterRequest: programCohortSemester
        });
    }
    static async getProgramCohortSemesterById(programCohortSemesterId:number): Promise<ProgramCohortSemester> {
        return timetablingAxiosInstance.get(`/program-cohort-semesters/${programCohortSemesterId}`)
            .then(res => res.data);
    }
    static async cancelProgramCohort(cohortId: number, cancelletionData: unknown): Promise<void> {
        return timetablingAxiosInstance.put(`/program-cohorts/${cohortId}`, cancelletionData);
    }
    static async getGraduands(options: { programCohortId: number; studentId?: number }): Promise<AxiosResponse<[]>> {
        return simsAxiosInstance.get('/program-cohort-applications/graduates', {
            params: { loadExtras: 'marks', ...options }
        });
    }
}
