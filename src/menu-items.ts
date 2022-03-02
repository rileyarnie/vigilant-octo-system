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
}

const chartData: { items: MenuItemType[] } = {
    items: [
        {
            id: 'users',
            title: 'Dashboard',
            type: 'group',
            icon: 'feather icon-monitor',
            children: [
                {
                    id: 'Default',
                    title: 'Users',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'users',
                            title: 'Users',
                            type: 'item',
                            url: '/users'
                        },
                        {
                            id: 'roles',
                            title: 'Roles',
                            type: 'item',
                            url: '/roles'
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
                            url: '/campuses'
                        },
                        {
                            id: 'venues',
                            title: 'Venues',
                            type: 'item',
                            url: '/venues'
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
                            id: 'department',
                            title: 'Departments',
                            type: 'item',
                            url: '/departments'
                        },
                        {
                            id: 'trainers',
                            title: 'Trainers',
                            type: 'item',
                            url: '/trainers'
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
                                    url: '/programs'
                                },
                                {
                                    id: 'cohort',
                                    title: 'Cohorts',
                                    type: 'item',
                                    url: '/cohorts'
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
                                    url: '/courses'
                                },
                                {
                                    id: 'cohort',
                                    title: 'Cohorts',
                                    type: 'item',
                                    url: '/coursecohorts'
                                }
                            ]
                        },
                        {
                            id: 'semesters',
                            title: 'Semesters',
                            type: 'item',
                            url: '/semesters'
                        },
                        {
                            id: 'applications',
                            title: 'Applications',
                            type: 'item',
                            url: '/applications'
                        },
                        {
                            id: 'timetable',
                            title: 'Timetable',
                            type: 'collapse',
                            icon: 'feather icon-calendar',
                            children: [
                                {
                                    id: 'timetable',
                                    title: 'Edit Timetable',
                                    type: 'item',
                                    url: '/timetable'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'Finance',
                    title: 'Finance',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'finanace',
                            title: 'Finance',
                            type: 'item',
                            url: '/studentlist'
                        }
                    ]
                },
                {
                    id: 'workflow',
                    title: 'Work Flow',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'Work Flow',
                            title: 'Work Flow',
                            type: 'item',
                            url: '/workflows'
                        }
                    ]
                },
            ]
        }
    ]
};

export default chartData;
