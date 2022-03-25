import { ACTION_GET_ROLES, ACTION_GET_USERS } from './authnz-library/authnz-actions';
import { ACTION_GET_FEE_REPORTS } from './authnz-library/finance-actions';
import { ACTION_GET_PROGRAM_COHORT_APPLICATIONS } from './authnz-library/sim-actions';
import {
    ACTION_GET_CAMPUSES,
    ACTION_GET_COURSES,
    ACTION_GET_COURSE_COHORTS,
    ACTION_GET_DEPARTMENTS,
    ACTION_GET_PROGRAMS,
    ACTION_GET_PROGRAM_COHORTS,
    ACTION_GET_SEMESTERS,
    ACTION_GET_TIMETABLING_UNITS,
    ACTION_GET_TRAINERS,
    ACTION_GET_VENUE
} from './authnz-library/timetabling-actions';
import { canPerformActions } from './services/ActionChecker';

interface Badge {
    title: string;
    type: string;
}

export interface MenuItemType {
    id: string;
    title: string;
    type: string;
    icon?: string;
    children?: MenuItemType[];
    breadcrumbs?: boolean;
    url?: string;
    badge?: Badge;
    target?: boolean;
    classes?: string;
    external?: boolean;
    hidden?: boolean;
}

const chartData: { items: MenuItemType[] } = {
    items: [
        {
            id: 'users',
            title: 'Dashboard',
            type: 'group',
            icon: 'feather icon-monitor',
            hidden: !canPerformActions(ACTION_GET_USERS.name, ACTION_GET_ROLES.name),
            children: [
                {
                    id: 'Default',
                    title: 'Access Control',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    hidden: !canPerformActions(ACTION_GET_USERS.name, ACTION_GET_ROLES.name),
                    children: [
                        {
                            id: 'users',
                            title: 'Users',
                            type: 'item',
                            url: '/users',
                            hidden: !canPerformActions(ACTION_GET_USERS.name)
                        },
                        {
                            id: 'roles',
                            title: 'Roles',
                            type: 'item',
                            url: '/roles',
                            hidden: !canPerformActions(ACTION_GET_ROLES.name)
                        },
                        {
                            id: 'Work Flow',
                            title: 'Workflows',
                            type: 'item',
                            url: '/workflows'
                        }
                    ]
                },
                {
                    id: 'resources',
                    title: 'Resources',
                    type: 'collapse',
                    icon: 'feather icon-book',
                    children: [
                        {
                            id: 'campuses',
                            title: 'Campuses',
                            type: 'item',
                            url: '/campuses',
                            hidden: !canPerformActions(ACTION_GET_CAMPUSES.name)
                        },
                        {
                            id: 'venues',
                            title: 'Venues',
                            type: 'item',
                            url: '/venues',
                            hidden: !canPerformActions(ACTION_GET_VENUE.name)
                        },
                        {
                            id: 'department',
                            title: 'Departments',
                            type: 'item',
                            url: '/departments',
                            hidden: !canPerformActions(ACTION_GET_DEPARTMENTS.name)
                        }
                    ]
                },
                {
                    id: 'Departments',
                    title: 'Departments',
                    type: 'collapse',
                    icon: 'feather icon-book',
                    children: [
                        {
                            id: 'trainers',
                            title: 'Trainers',
                            type: 'item',
                            url: '/trainers',
                            hidden: !canPerformActions(ACTION_GET_TRAINERS.name)
                        },
                        {
                            id: 'programs',
                            title: 'Programs',
                            type: 'collapse',
                            children: [
                                {
                                    id: 'programs',
                                    title: 'Programs',
                                    type: 'item',
                                    url: '/programs',
                                    hidden: !canPerformActions(ACTION_GET_PROGRAMS.name)
                                },
                                {
                                    id: 'cohort',
                                    title: 'Cohorts',
                                    type: 'item',
                                    url: '/cohorts',
                                    hidden: !canPerformActions(ACTION_GET_PROGRAM_COHORTS.name)
                                }
                            ]
                        },
                        {
                            id: 'courses',
                            title: 'Courses',
                            type: 'collapse',
                            children: [
                                {
                                    id: 'courses',
                                    title: 'Courses',
                                    type: 'item',
                                    url: '/courses',
                                    hidden: !canPerformActions(ACTION_GET_COURSES.name)
                                },
                                {
                                    id: 'cohort',
                                    title: 'Cohorts',
                                    type: 'item',
                                    url: '/coursecohorts',
                                    hidden: !canPerformActions(ACTION_GET_COURSE_COHORTS.name)
                                }
                            ]
                        },
                    ]
                },
                {
                    id: 'Calendar',
                    title: 'Calendar',
                    type: 'collapse',
                    icon: 'feather icon-calendar',
                    children: [
                        {
                            id: 'semesters',
                            title: 'Semesters',
                            type: 'item',
                            url: '/semesters',
                            hidden: !canPerformActions(ACTION_GET_SEMESTERS.name)
                        },
                        {
                            id: 'finanace',
                            title: 'Program Cohorts',
                            type: 'item',
                            url: '/studentlist',
                            hidden: !canPerformActions(ACTION_GET_FEE_REPORTS.name)
                        },
                        {
                            id: 'finanace',
                            title: 'Course Cohorts',
                            type: 'item',
                            url: '/studentlist',
                            hidden: !canPerformActions(ACTION_GET_FEE_REPORTS.name)
                        },
                        {
                            id: 'applications',
                            title: 'Applications',
                            type: 'item',
                            url: '/applications',
                            hidden: !canPerformActions(ACTION_GET_PROGRAM_COHORT_APPLICATIONS.name)
                        },
                        {
                            id: 'timetable',
                            title: 'Timetable',
                            type: 'item',
                            url: '/timetable',
                            hidden: !canPerformActions(ACTION_GET_TIMETABLING_UNITS.name)
                        }
                    ]
                },
                {
                    id: 'finanace',
                    title: 'Finance',
                    type: 'item',
                    icon: 'feather icon-user',
                    url: '/studentlist',
                    hidden: !canPerformActions(ACTION_GET_FEE_REPORTS.name)
                },
                {
                    id: 'Approvals',
                    title: 'Approvals',
                    type: 'item',
                    icon: 'feather icon-user',
                    url: '/actionapprovals'
                }
            ]
        }
    ]
};

export default chartData;
