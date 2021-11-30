import * as React from 'react';
import { MenuItemType } from '../../../../../../menu-items';
interface NavBadgeProps {
  items: MenuItemType;
  layout?: string;
}
const NavBadge = (props: NavBadgeProps) => {
    return props.items.badge ? (
        <span className={['label', 'pcoded-badge', props.items.badge.type].join(' ')}>{props.items.badge.title}</span>
    ) : null;
};
export default NavBadge;
