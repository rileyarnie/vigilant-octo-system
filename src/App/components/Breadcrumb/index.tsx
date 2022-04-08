import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import config from '../../../config';
import navigation, {MenuItemType} from '../../../menu-items';
import SYS from '../../../store/constant';

type BreadcrumbState = {
    item?: string;
    main?: string;
    type?: string;
    breadcrumbs?: string;
    title?: string;
};

class Breadcrumb extends Component<BreadcrumbState> {
    state = {
        main: {} as MenuItemType,
        item: {} as MenuItemType
    };

    componentDidMount() {
        navigation.items.map((item: MenuItemType) => {
            if (item.type && item.type === 'group') {
                this.getCollapse(item);
            }
            return false;
        });
    }

    UNSAFE_componentWillReceiveProps = () => {
        navigation.items.map((item: MenuItemType) => {
            if (item.type && item.type === 'group') {
                this.getCollapse(item);
            }
            return false;
        });
    };
    getCollapse = (item: MenuItemType) => {
        if (item.children) {
            item.children.filter((collapse: MenuItemType) => {
                if (collapse.type && collapse.type === 'collapse') {
                    this.getCollapse(collapse);
                } else if (collapse.type && collapse.type === 'item') {
                    if (document.location.pathname === config.basename + collapse.url) {
                        this.setState({item: collapse, main: item});
                    }
                }
                return false;
            });
        }
    };

    render(): JSX.Element {
        let main, item;
        let breadcrumb: React.ReactNode = '';
        let title = 'MIOG';
        if (this.state.main && this.state.main.type === 'collapse') {
            main = (
                <li className="breadcrumb-item">
                    <a href={SYS.BLANK_LINK}>{this.state.main.title}</a>
                </li>
            );
        }
        if (this.state.item && this.state.item.type === 'item') {
            title = this.state.item.title;
            item = (
                <li className="breadcrumb-item">
                    <a href={SYS.BLANK_LINK}>{title}</a>
                </li>
            );
            if (this.state.item.breadcrumbs !== false) {
                breadcrumb = (
                    <>
                        <div className="page-block">
                            <div className="page-header-title">
                                <h5 className="m-b-10">{title}</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">
                                        <i className="feather icon-home"/>
                                    </Link>
                                </li>
                                {main}
                                {item}
                            </ul>
                        </div>
                    </>
                );
            }
        }
        document.title = title + ' | Dashboard ';
        return <>{breadcrumb}</>;
    }
}

export default Breadcrumb;
