/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';

import NavIcon from './../NavIcon';
import NavBadge from './../NavBadge';
import * as actionTypes from '../../../../../../store/actions';
import { initialState } from '../../../../../../store/reducer';
interface INavItemProps extends React.HTMLAttributes<Element> {
  layout?: any;
  windowWidth?: any;
  classes?: any;
  item?: any;
  onItemClick?: any;
  onItemLeave?: any;
  external?: any;
  url?: any;
  target?: any;
  icon?: any;
  title?: any;
}
class NavItem extends Component<INavItemProps> {
    render() {
        let itemTitle = this.props.item.title;
        if (this.props.item.icon) {
            itemTitle = <span className="pcoded-mtext">{this.props.item.title}</span>;
        }
        let itemTarget = '';
        if (this.props.item.target) {
            itemTarget = '_blank';
        }
        let subContent;
        if (this.props.item.external) {
            subContent = (
                <a href={this.props.item.url} target="_blank" rel="noopener noreferrer">
                    <NavIcon items={this.props.item} />
                    {itemTitle}
                    <NavBadge layout={this.props.layout} items={this.props.item} />
                </a>
            );
        } else {
            subContent = (
                <NavLink
                    to={this.props.item.url}
                    className="nav-link"
                    exact={true}
                    target={itemTarget}
                >
                    <NavIcon items={this.props.item} />
                    {itemTitle}
                    <NavBadge layout={this.props.layout} items={this.props.item} />
                </NavLink>
            );
        }
        let mainContent: React.ReactNode = '';
        if (this.props.layout === 'horizontal') {
            mainContent = <li onClick={this.props.onItemLeave}>{subContent}</li>;
        } else {
            if (this.props.windowWidth < 992) {
                mainContent = (
                    <li
                        className={this.props.item.classes}
                        onClick={this.props.onItemClick}
                    >
                        {subContent}
                    </li>
                );
            } else {
                mainContent = <li className={this.props.item.classes}>{subContent}</li>;
            }
        }
        return <>{mainContent}</>;
    }
}
const mapStateToProps = (state: typeof initialState) => {
    return {
        layout: state.layout,
        collapseMenu: state.collapseMenu
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        onItemClick: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
        onItemLeave: () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE })
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(windowSize(NavItem as any))
) as any;
