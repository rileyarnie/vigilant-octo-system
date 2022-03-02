import { Action } from './Action';

const timetablingServiceActions = new Map<string, Action>();
export function getTimetablingServiceActions(): Map<string, Action> {
    return timetablingServiceActions;
}
export const ACTION_CREATE_CAMPUS = new Action(
    'createCampus',
    'Create a campus',
    'POST',
    '/campuses'
);

timetablingServiceActions.set(
    ACTION_CREATE_CAMPUS.name,
    ACTION_CREATE_CAMPUS
);

export const ACTION_GET_CAMPUSES = new Action(
    'getCampuses',
    'This route requests list of campuses',
    'GET',
    '/campuses'
);

timetablingServiceActions.set(
    ACTION_GET_CAMPUSES.name,
    ACTION_GET_CAMPUSES
);

export const ACTION_UPDATE_CAMPUS = new Action(
    'updateCampusById',
    'Update a campus',
    'PUT',
    '/campuses/:campusId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_CAMPUS.name,
    ACTION_UPDATE_CAMPUS
);


export const ACTION_GET_COURSE_COHORTS = new Action(
    'getCourseCohorts',
    'get course cohorts',
    'GET',
    '/course_cohort'
);

timetablingServiceActions.set(
    ACTION_GET_COURSE_COHORTS.name,
    ACTION_GET_COURSE_COHORTS
);



export const ACTION_CREATE_COURSE_COHORT = new Action(
    'createCourseCohort',
    ' create course cohort',
    'POST',
    '/course_cohort'
);

timetablingServiceActions.set(
    ACTION_CREATE_COURSE_COHORT.name,
    ACTION_CREATE_COURSE_COHORT
);



export const ACTION_UPDATE_COURSE_COHORT = new Action(
    'updateCourseCohort',
    'update course cohort',
    'PATCH',
    '/course_cohort/:courseCohortId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_COURSE_COHORT.name,
    ACTION_UPDATE_COURSE_COHORT
);



export const ACTION_CREATE_COURSE = new Action(
    'createCourse',
    'This route will save created course to db',
    'POST',
    '/courses'
);

timetablingServiceActions.set(
    ACTION_CREATE_COURSE.name,
    ACTION_CREATE_COURSE
);





export const ACTION_GET_COURSES = new Action(
    'getCourses',
    'This route requests list of courses',
    'GET',
    '/courses'
);

timetablingServiceActions.set(
    ACTION_GET_COURSES.name,
    ACTION_GET_COURSES
);

export const ACTION_UPDATE_COURSE = new Action(
    'updateCourseById',
    'Update a course',
    'PUT',
    '/courses/:courseId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_COURSE.name,
    ACTION_UPDATE_COURSE
);


export const ACTION_CREATE_DEPARTMENT = new Action(
    'createDepartment',
    'create a department',
    'POST',
    '/departments'
);

timetablingServiceActions.set(
    ACTION_CREATE_DEPARTMENT.name,
    ACTION_CREATE_DEPARTMENT
);


export const ACTION_GET_DEPARTMENTS = new Action(
    'getDepartments',
    'This route requests list of departments',
    'GET',
    '/departments'
);

timetablingServiceActions.set(
    ACTION_GET_DEPARTMENTS.name,
    ACTION_GET_DEPARTMENTS
);


export const ACTION_UPDATE_DEPARTMENT = new Action(
    'updateDepartmentById',
    'Update a department',
    'PUT',
    '/departments/:departmentId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_DEPARTMENT.name,
    ACTION_UPDATE_DEPARTMENT
);


export const ACTION_CREATE_PROGRAM_COHORT = new Action(
    'createProgramCohort',
    'create a program cohort',
    'POST',
    '/program_cohort'
);

timetablingServiceActions.set(
    ACTION_CREATE_PROGRAM_COHORT.name,
    ACTION_CREATE_PROGRAM_COHORT
);


export const ACTION_GET_PROGRAM_COHORTS = new Action(
    'getProgramCohorts',
    'Returns a list of program cohorts',
    'GET',
    '/program_cohort'
);

timetablingServiceActions.set(
    ACTION_GET_PROGRAM_COHORTS.name,
    ACTION_GET_PROGRAM_COHORTS
);


export const ACTION_UPDATE_PROGRAM_COHORT = new Action(
    'updateProgramCohort',
    'Update a program cohort',
    'PUT',
    '/program_cohort/:programCohortId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_PROGRAM_COHORT.name,
    ACTION_UPDATE_PROGRAM_COHORT
);


export const ACTION_CREATE_PROGRAM_COHORT_SEMESTER = new Action(
    'createProgramCohortSemester',
    'create program-cohort-semester',
    'POST',
    '/program-cohort-semesters'
);

timetablingServiceActions.set(
    ACTION_CREATE_PROGRAM_COHORT_SEMESTER.name,
    ACTION_CREATE_PROGRAM_COHORT_SEMESTER
);



export const ACTION_GET_PROGRAM_COHORT_SEMESTER_BY_ID = new Action(
    'getProgramCohortSemesterById',
    'Return a single program-cohort-semester',
    'GET',
    '/program-cohort-semesters/:programCohortSemesterId'
);

timetablingServiceActions.set(
    ACTION_GET_PROGRAM_COHORT_SEMESTER_BY_ID.name,
    ACTION_GET_PROGRAM_COHORT_SEMESTER_BY_ID
);


export const ACTION_MODIFY_PROGRAM_COHORT_SEMESTER= new Action(
    'modifyProgramCohortSemester',
    'Modify program cohort semesterReturn a single program-cohort-semester',
    'PUT',
    '/program-cohort-semesters/:programCohortSemesterId'
);

timetablingServiceActions.set(
    ACTION_MODIFY_PROGRAM_COHORT_SEMESTER.name,
    ACTION_MODIFY_PROGRAM_COHORT_SEMESTER
);


export const ACTION_CREATE_PROGRAM = new Action(
    'createProgram',
    'create a program',
    'POST',
    '/programs'
);

timetablingServiceActions.set(
    ACTION_CREATE_PROGRAM.name,
    ACTION_CREATE_PROGRAM
);

export const ACTION_GET_PROGRAMS = new Action(
    'getPrograms',
    'This route requests list of programs',
    'GET',
    '/programs'
);

timetablingServiceActions.set(
    ACTION_GET_PROGRAMS.name,
    ACTION_GET_PROGRAMS
);



export const ACTION_GET_PROGRAM_COURSE_BY_ID = new Action(
    'findProgramCourseById',
    'Returns courses that belongs to a program',
    'GET',
    '/programs/:programId/courses'
);

timetablingServiceActions.set(
    ACTION_GET_PROGRAM_COURSE_BY_ID.name,
    ACTION_GET_PROGRAM_COURSE_BY_ID
);



export const ACTION_GET_PROGRAM_BY_ID = new Action(
    'getProgramById',
    'Returns a single program',
    'GET',
    '/programs/:programId'
);

timetablingServiceActions.set(
    ACTION_GET_PROGRAM_BY_ID.name,
    ACTION_GET_PROGRAM_BY_ID
);


export const ACTION_REMOVE_COURSE_FROM_PROGRAM = new Action(
    'deleteCourses',
    'Removes course from a program',
    'PUT',
    '/programs/:programId/courses/:courseId/'
);

timetablingServiceActions.set(
    ACTION_REMOVE_COURSE_FROM_PROGRAM.name,
    ACTION_REMOVE_COURSE_FROM_PROGRAM
);




export const ACTION_ASSIGN_COURSE_TO_PROGRAM = new Action(
    'assignCourses',
    'This endpoint assigns courses to a program',
    'PUT',
    '/programs/:programId/courses/'
);

timetablingServiceActions.set(
    ACTION_ASSIGN_COURSE_TO_PROGRAM.name,
    ACTION_ASSIGN_COURSE_TO_PROGRAM
);


export const ACTION_UPDATE_PROGRAM = new Action(
    'updateProgram',
    'Update a program',
    'PUT',
    '/programs/:programId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_PROGRAM.name,
    ACTION_UPDATE_PROGRAM
);


export const ACTION_GET_SAP_PROGRAM_COHORT_SEMESTERS = new Action(
    'getSAPProgramCohortSemesters',
    'Get semesters',
    'GET',
    '/sap'
);

timetablingServiceActions.set(
    ACTION_GET_SAP_PROGRAM_COHORT_SEMESTERS.name,
    ACTION_GET_SAP_PROGRAM_COHORT_SEMESTERS
);



export const ACTION_CREATE_SEMESTERS = new Action(
    'createSemester',
    'Create semester',
    'POST',
    '/semesters'
);

timetablingServiceActions.set(
    ACTION_CREATE_SEMESTERS.name,
    ACTION_CREATE_SEMESTERS
);

export const ACTION_GET_SEMESTERS = new Action(
    'getSemesters',
    'Get semesters',
    'GET',
    '/semesters'
);

timetablingServiceActions.set(ACTION_GET_SEMESTERS.name, ACTION_GET_SEMESTERS);


export const ACTION_UPDATE_SEMESTERS = new Action(
    'getSemesters',
    'Get semesters',
    'GET',
    '/semesters/:semesterId'
);

timetablingServiceActions.set(ACTION_UPDATE_SEMESTERS.name, ACTION_UPDATE_SEMESTERS);


export const ACTION_CREATE_TIMETABLING_UNIT = new Action(
    'createTimetablingUnit',
    'create a timetabling-unit',
    'POST',
    '/timetabling-units'
);

timetablingServiceActions.set(ACTION_CREATE_TIMETABLING_UNIT.name, ACTION_CREATE_TIMETABLING_UNIT);




export const ACTION_MODIFY_TIMETABLING_UNIT = new Action(
    'modifyTimetablingUnit',
    'modify a timetabling-unit',
    'PUT',
    '/timetabling-units/:timetablingUnitId'
);

timetablingServiceActions.set(
    ACTION_MODIFY_TIMETABLING_UNIT.name,
    ACTION_MODIFY_TIMETABLING_UNIT
);


export const ACTION_GET_TIMETABLING_UNITS = new Action(
    'getTimetablingUnits',
    ' get timetabling-units',
    'GET',
    '/timetabling-units'
);

timetablingServiceActions.set(
    ACTION_GET_TIMETABLING_UNITS.name,
    ACTION_GET_TIMETABLING_UNITS
);



export const ACTION_GET_TIMETABLING_UNITS_ERRORS = new Action(
    'getTimetablingUnitsErrors',
    'get a semester\'s timetabling-units\' errors',
    'GET',
    '/timetabling-units/errors'
);

timetablingServiceActions.set(
    ACTION_GET_TIMETABLING_UNITS_ERRORS.name,
    ACTION_GET_TIMETABLING_UNITS_ERRORS
);



export const ACTION_ASSIGN_TRAINER_TO_COURSE= new Action(
    'assignTrainerToCourse',
    'Assign courses to trainer',
    'POST',
    '/trainer_courses'
);

timetablingServiceActions.set(
    ACTION_ASSIGN_TRAINER_TO_COURSE.name,
    ACTION_ASSIGN_TRAINER_TO_COURSE
);


export const ACTION_UPDATE_TRAINER_ASSIGNMENT_TO_COURSE = new Action(
    'updateTrainerAssignmentToCourse',
    'Update course assignment to trainer',
    'PUT',
    '/trainer_courses/:trainerCourseId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_TRAINER_ASSIGNMENT_TO_COURSE.name,
    ACTION_UPDATE_TRAINER_ASSIGNMENT_TO_COURSE
);




export const ACTION_CREATE_TRAINER = new Action(
    'createTrainer',
    'Creates a new trainer',
    'POST',
    '/trainer'
);

timetablingServiceActions.set(
    ACTION_CREATE_TRAINER.name,
    ACTION_CREATE_TRAINER
);



export const ACTION_GET_TRAINERS = new Action(
    'getTrainers',
    'Gets a paginated list of trainers',
    'GET',
    '/trainer'
);

timetablingServiceActions.set(
    ACTION_GET_TRAINERS.name,
    ACTION_GET_TRAINERS
);



export const ACTION_UPDATE_TRAINER = new Action(
    'updateTrainer',
    'Updates a trainer',
    'PATCH',
    '/trainer/:trainerId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_TRAINER.name,
    ACTION_UPDATE_TRAINER
);

export const ACTION_UPLOAD_FILE = new Action(
    'uploadFile',
    'upload file',
    'PATCH',
    '/upload_file'
);

timetablingServiceActions.set(
    ACTION_UPLOAD_FILE.name,
    ACTION_UPLOAD_FILE
);
export const ACTION_CREATE_VENUE = new Action(
    'createVenue',
    'create a venue',
    'POST',
    '/venues'
);

timetablingServiceActions.set(
    ACTION_CREATE_VENUE.name,
    ACTION_CREATE_VENUE
);

export const ACTION_UPDATE_VENUE = new Action(
    'updateVenue',
    'Update a venue',
    'PUT',
    '/venues/:venueId'
);

timetablingServiceActions.set(
    ACTION_UPDATE_VENUE.name,
    ACTION_UPDATE_VENUE
);

export const ACTION_GET_VENUE = new Action(
    'fetchVenues',
    'Returns a list of venues filtered by campus ID or active status',
    'get',
    '/venues'
);

timetablingServiceActions.set(
    ACTION_GET_VENUE.name,
    ACTION_GET_VENUE
);




