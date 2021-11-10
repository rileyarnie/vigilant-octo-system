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
                    id: "Default",
                    title: "Users",
                    type: "collapse",
                    icon: "feather icon-user",
                    children: [
                        {
                            id: "users",
                            title: "Users",
                            type: "item",
                            url: "/users"
                        },
                        {
                            id: "roles",
                            title: "Roles",
                            type: "item",
                            url: "/roles"
                        },
                        {
                            id: "assign",
                            title: "Assign Role",
                            type: "item",
                            url: "/assignrole"
                        },
                    ]
                },
                {
                    id: 'Academics',
                    title: 'Academics',
                    type: 'collapse',
                    icon: 'feather icon-book',
                    children: [
                        {
                            id: 'department',
                            title: 'Departments',
                            type: 'item',
                            url: '/department'
                        },
                        {
                            id: 'courses',
                            title: 'Courses',
                            type: 'item',
                            url: '/courses'
                        },
                        {
                            id: 'semesters',
                            title: 'Semesters',
                            type: 'item',
                            url: '/semesters'
                        },
                        {
                            id: 'courses',
                            title: 'Courses',
                            type: 'item',
                            url: '/courses'
                        },
                        {
                            id: 'programs',
                            title: 'Programs',
                            type: 'item',
                            url: '/programs'
                        },
                        {
                            id: 'venues',
                            title: 'Venues',
                            type: 'item',
                            url: '/venues',
                        },
                        {
                            id: 'campuses',
                            title: 'Campuses',
                            type: 'item',
                            url: '/campuses'
                        },
                        {
                            id: 'trainers',
                            title: 'Trainers',
                            type: 'item',
                            url: '/trainers'
                        },
                    ]
                }

            ]
        }
    ]
}

export default chartData;