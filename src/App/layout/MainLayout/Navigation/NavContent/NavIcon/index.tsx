import * as React from 'react';
import { MenuItemType } from '../../../../../../menu-items';
interface NavIconProps {
    items: MenuItemType;
}
const NavIcon = (props: NavIconProps): JSX.Element => {
    return props.items.icon ? (
        <span className="pcoded-micon">
            <i className={props.items.icon} />
        </span>
    ) : null;
};
export default NavIcon;
