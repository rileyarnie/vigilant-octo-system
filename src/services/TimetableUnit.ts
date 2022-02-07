export default class TimetablingUnit {
    constructor (
		public id:number,
		public courseCohortId:number,
		public dayOfWeek: string,
		public startTime:string,
		public endTime:string,
		public numSessions:number,
		public venueId?:number,
		public trainerId?:number

    ) {}
}