import { Action } from './Action';

const financeServiceActions = new Map<string, Action>();
export function getFinanceServiceActions(): Map<string, Action> {
    return financeServiceActions;
}
export const ACTION_CREATE_FEE_ITEM = new Action(
    'createFeeItem',
    'Create a fee item',
    'POST',
    '/fee-items'
);
financeServiceActions.set(
    ACTION_CREATE_FEE_ITEM.name,
    ACTION_CREATE_FEE_ITEM
);

export const ACTION_GET_FEE_ITEMS = new Action(
    'getFeeItems',
    'Get fee items',
    'GET',
    '/fee-items'
);

financeServiceActions.set(
    ACTION_GET_FEE_ITEMS.name,
    ACTION_GET_FEE_ITEMS
);

export const ACTION_CREATE_FEE_WAIVER = new Action(
    'createFeeWaiver',
    'Create a fee waiver',
    'POST',
    '/fees/waivers'
);

financeServiceActions.set(
    ACTION_CREATE_FEE_WAIVER.name,
    ACTION_CREATE_FEE_WAIVER
);

export const ACTION_GET_FEE_REPORTS = new Action(
    'getFeeReport',
    'Get fee reports',
    'POST',
    '/fees/reports'
);

financeServiceActions.set(
    ACTION_GET_FEE_REPORTS.name,
    ACTION_GET_FEE_REPORTS
);

export const ACTION_CREATE_FEE_INVOICE = new Action(
    'createFeeInvoice',
    'Create a fee invoice',
    'POST',
    '/fees/invoices'
);

financeServiceActions.set(
    ACTION_CREATE_FEE_INVOICE.name,
    ACTION_CREATE_FEE_INVOICE
);

export const ACTION_PERFORM_FEE_REVERSAL = new Action(
    'createFeeReversal',
    'Perform a fee reversal',
    'POST',
    '/fees/reversals'
);

financeServiceActions.set(
    ACTION_PERFORM_FEE_REVERSAL.name,
    ACTION_PERFORM_FEE_REVERSAL
);

export const ACTION_CREATE_FEE_PAYMENT = new Action(
    'createFeePayment',
    'Create a fee payment',
    'POST',
    '/fees/payments'
);

financeServiceActions.set(
    ACTION_CREATE_FEE_PAYMENT.name,
    ACTION_CREATE_FEE_PAYMENT
);

export const ACTION_CREATE_PROGRAM_COHORT_SEMESTER_REGISTRATION = new Action(
    'postProgramCohortSemesterRegistration',
    'create program-cohort-semesters-registration',
    'POST',
    'program-cohort-semester/:programCohortSemesterId/registrations'
);

financeServiceActions.set(
    ACTION_CREATE_PROGRAM_COHORT_SEMESTER_REGISTRATION.name,
    ACTION_CREATE_PROGRAM_COHORT_SEMESTER_REGISTRATION
);
