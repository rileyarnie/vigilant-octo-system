import { AxiosResponse } from 'axios';
import { financeAxiosInstance } from '../../utlis/interceptors/finance-interceptor';
import { simsAxiosInstance } from '../../utlis/interceptors/sims-interceptor';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
export class ProgramCohortService {
    static async publishProgramCohortSemester(programCohortSemesterId: string, programCohortSemester: unknown): Promise<void> {
        return timetablingAxiosInstance.put(`/program-cohort-semesters/${programCohortSemesterId}`, {
            ModifyProgramCohortSemesterRequest: programCohortSemester
        });
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
