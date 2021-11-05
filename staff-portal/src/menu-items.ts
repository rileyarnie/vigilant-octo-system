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
                            id: "createuser",
                            title: "Create User",
                            type: "item",
                            url: "/createuser"
                        },

                        {
                            id: "userlist",
                            title: "User List",
                            type: "item",
                            url: "/userlist"
                        },
                        {
                            id: "rolelist",
                            title: "Role List",
                            type: "item",
                            url: "/rolelist"
                        },
                        {
                            id: "users",
                            title: "Users",
                            type: "item",
                            url: "/users"
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
                            id: 'createcampus',
                            title: 'Create Campus',
                            type: 'item',
                            url: '/createcampus'
                        },
                        {
                            id: 'semesterlist',
                            title: 'Semester List',
                            type: 'item',
                            url: '/semesterlist'
                        },
                        {    
                            id: 'createvenue',
                            title: 'Create Venue',
                            type: 'item',
                            url: '/createvenue'
                        },
                        {
                            id: 'createprogram',
                            title: 'Create Program',
                            type: 'item',
                            url: '/createprogram'
                        },
                        {
                            id: 'createcourse',
                            title: 'Create Course',
                            type: 'item',
                            url: '/createcourse'
                        },

                        {
                            id: 'campuslist',
                            title: 'Campus List',
                            type: 'item',
                            url: '/campuslist',
                        },
                        {

                            id: 'createvenue',
                            title: 'Create Venue',
                            type: 'item',
                            url: '/createvenue'
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
                            id: 'trainerlist',
                            title: 'Trainer List',
                            type: 'item',
                            url: '/trainerlist'
                        }
                    ]
                }

            ]
        }
    ]
}

export default chartData;