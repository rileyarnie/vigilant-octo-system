import { Action } from './Action';
const simServiceActions = new Map<string, Action>();
export function getSimServiceActions(): Map<string, Action> {
    return simServiceActions;
}
export const ACTION_INSERT_COURSE_COHORT_EVALUATION = new Action(
    'insertCourseCohortEvaluation',
    'Create course cohort evaluation',
    'POST',
    '/course-cohort-evaluations/'
);

simServiceActions.set(
    ACTION_INSERT_COURSE_COHORT_EVALUATION.name,
    ACTION_INSERT_COURSE_COHORT_EVALUATION
);

export const ACTION_GET_COURSE_COHORT_MARK_TRANSFERS = new Action(
    'getCourseCohortRegistrations',
    'Get course-cohort-mark-transfers',
    'GET',
    '/course-cohort-mark-transfers'
);

simServiceActions.set(
    ACTION_GET_COURSE_COHORT_MARK_TRANSFERS.name,
    ACTION_GET_COURSE_COHORT_MARK_TRANSFERS
);

export const ACTION_POST_COURSE_COHORT_REGISTRATION_MARKS = new Action(
    'createCourseCohortRegistrationMarks',
    'Create course-cohort-registration-marks',
    'POST',
    '/course-cohort-registration-marks'
);

simServiceActions.set(
    ACTION_POST_COURSE_COHORT_REGISTRATION_MARKS.name,
    ACTION_POST_COURSE_COHORT_REGISTRATION_MARKS
);

export const ACTION_UPDATE_COURSE_COHORT_REGISTRATION_MARKS = new Action(
    'getCourseCohortRegistrations',
    'Update course-cohort-registration-marks',
    'PUT',
    '/course-cohort-mark-transfers/:id'
);

simServiceActions.set(
    ACTION_UPDATE_COURSE_COHORT_REGISTRATION_MARKS.name,
    ACTION_UPDATE_COURSE_COHORT_REGISTRATION_MARKS
);

export const ACTION_CREATE_COURSE_COHORT_MARK_TRANSFER = new Action(
    'createCourseCohortMarkTransfer',
    'Create course-cohort-mark-transfer',
    'POST',
    '/course-cohort-mark-transfers/transfers'
);

simServiceActions.set(
    ACTION_CREATE_COURSE_COHORT_MARK_TRANSFER.name,
    ACTION_CREATE_COURSE_COHORT_MARK_TRANSFER
);

export const ACTION_CREATE_COURSE_COHORT_REGISTRATION = new Action(
    'createCourseCohortRegistration',
    'register a student to a courseCohort',
    'POST',
    '/course-cohort-registrations'
);

simServiceActions.set(
    ACTION_CREATE_COURSE_COHORT_REGISTRATION.name,
    ACTION_CREATE_COURSE_COHORT_REGISTRATION
);

export const ACTION_GET_COURSE_COHORT_REGISTRATIONS = new Action(
    'getCourseCohortRegistrations',
    'Get course-cohort-registrations',
    'GET',
    '/course-cohort-registrations'
);

simServiceActions.set(
    ACTION_GET_COURSE_COHORT_REGISTRATIONS.name,
    ACTION_GET_COURSE_COHORT_REGISTRATIONS
);

export const ACTION_UPDATE_COURSE_COHORT_REGISTRATIONS = new Action(
    'updateCourseCohortRegistration',
    'update course-cohort-registration',
    'PUT',
    '/course-cohort-registrations/:id'
);

simServiceActions.set(
    ACTION_UPDATE_COURSE_COHORT_REGISTRATIONS.name,
    ACTION_UPDATE_COURSE_COHORT_REGISTRATIONS
);

export const ACTION_APPLY_TO_PROGRAM = new Action(
    'applyToProgram',
    'Apply for a published program',
    'POST',
    '/program-cohort-applications'
);

simServiceActions.set(ACTION_APPLY_TO_PROGRAM.name, ACTION_APPLY_TO_PROGRAM);

export const ACTION_GET_PROGRAM_COHORT_APPLICATIONS = new Action(
    'getProgramCohortApplications',
    'Get program-cohort-applications',
    'GET',
    '/program-cohort-applications'
);

simServiceActions.set(
    ACTION_GET_PROGRAM_COHORT_APPLICATIONS.name,
    ACTION_GET_PROGRAM_COHORT_APPLICATIONS
);

export const ACTION_MODIFY_PROGRAM_COHORT_APPLICATIONS = new Action(
    'modifyProgramCohortApplication',
    'Modify program-cohort-application',
    'PUT',
    '/program-cohort-applications/:applicationId'
);

simServiceActions.set(
    ACTION_MODIFY_PROGRAM_COHORT_APPLICATIONS.name,
    ACTION_MODIFY_PROGRAM_COHORT_APPLICATIONS
);

export const ACTION_CREATE_PROGRAM_COHORT_CLEARANCES = new Action(
    'createProgramCohortClearance',
    'Create program-cohort-clearances',
    'POST',
    '/program-cohort-applications/:applicationId'
);

simServiceActions.set(
    ACTION_CREATE_PROGRAM_COHORT_CLEARANCES.name,
    ACTION_CREATE_PROGRAM_COHORT_CLEARANCES
);

export const ACTION_GET_PROGRAM_COHORT_COMPLETIONS = new Action(
    'getProgramCohortApplicationCompletions',
    'Get program-cohort-applications-completions',
    'POST',
    '/program-cohort-applications/completions'
);

simServiceActions.set(
    ACTION_GET_PROGRAM_COHORT_COMPLETIONS.name,
    ACTION_GET_PROGRAM_COHORT_COMPLETIONS
);

export const ACTION_GET_PROGRAM_COHORT_CLEARANCES = new Action(
    'getProgramCohortClearances',
    'Get program-cohort-applications-clearances',
    'GET',
    '/program-cohort-applications/clearences'
);

simServiceActions.set(
    ACTION_GET_PROGRAM_COHORT_CLEARANCES.name,
    ACTION_GET_PROGRAM_COHORT_CLEARANCES
);

export const ACTION_GET_PROGRAM_COHORT_GRADUATES = new Action(
    'getProgramCohortApplicationGraduates',
    'Get program-cohort-applications-graduates',
    'GET',
    '/program-cohort-applications/graduates'
);

simServiceActions.set(
    ACTION_GET_PROGRAM_COHORT_GRADUATES.name,
    ACTION_GET_PROGRAM_COHORT_GRADUATES
);
