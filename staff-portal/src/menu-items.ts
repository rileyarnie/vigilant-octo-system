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
                            id: "rolelist",
                            title: "Role List",
                            type: "item",
                            url: "/rolelist"
                        },
                        {
                            id: "createrole",
                            title: "Create Role",
                            type: "item",
                            url: "/createrole"
                        },
                        {
                            id: "createUser",
                            title: "Create User",
                            type: "item",
                            url: "/createuser"
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
                            id: 'courselist',
                            title: 'Courses List',
                            type: 'item',
                            url: '/courselist'
                        },
                        {
                            id: 'createcampus',
                            title: 'Create Campus',
                            type: 'item',
                            url: '/createcampus'
                        },
                        {
                            id: 'createcourse',
                            title: 'Create Course',
                            type: 'item',
                            url: '/createcourse'
                        },
                    ]
                }

            ]
        }
    ]
}

export default chartData;