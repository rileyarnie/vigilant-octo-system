import Semester from './Semester'
export default class CourseCohort {
    constructor(
        public isPublished: string,
        public id: number,
        public trainerId: number,
        public text: string,
        public totalNumSessions: number

    ) {}
}