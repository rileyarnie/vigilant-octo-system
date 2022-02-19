import Course from './Course';
import TimetablingUnit from './TimetableUnit';
export default class CourseCohort {
    constructor(
        public isPublished: string,
        public id: number,
        public trainerId: number,
        public text: string,
        public course: Course,
        public totalNumSessions: number,
        public timetablingUnit: TimetablingUnit[]
    ) {}
}
