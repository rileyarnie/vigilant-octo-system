import Role from './Role';
export default class ApprovingRoles {
    constructor (
        public id: number,
        public rank: string,
        public roleId: number,
        public role?: Role
    ) {}
}