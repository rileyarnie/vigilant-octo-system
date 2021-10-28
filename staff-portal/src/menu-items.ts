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
                    id: "project",
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
                    ]
                }

            ]
        }
    ]
}

export default chartData;