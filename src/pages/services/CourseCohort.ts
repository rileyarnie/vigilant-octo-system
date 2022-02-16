/* eslint-disable no-useless-constructor */
import Course from './Course'
import ProgramCohortSemester from './ProgramCohortSemester'
import Semester from './Semester'
export default class CourseCohort {
  constructor (
        public isPublished: string,
        public id: number,
        public trainerId: number,
        public text: string,
        public course: Course,
        public semester: Semester,
        public programCohortId: number,
        public programCohortSemester: ProgramCohortSemester,
        public totalNumSessions: number

  ) {}
}
