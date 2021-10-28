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
                            id: 'createUser',
                            title: 'Create User',
                            type: 'item',
                            url: '/createuser'
                        },
                        {
                            id: 'userlist',
                            title: 'Staff',
                            type: 'item',
                            url: '/userlist'
                        },
                    ]
                }

            ]
        }
    ]
}

export default chartData;