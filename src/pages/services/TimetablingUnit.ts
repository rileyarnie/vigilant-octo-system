export class TimetablingUnit {
    // eslint-disable-next-line no-useless-constructor
    constructor (
      public courseCohortId:number,
      public dayOfWeek:string,
      public startTime:string,
      public endTime:string,
      public numSessions:number,
      public venueId:number,
      public trainerId:number
    ) {}
}