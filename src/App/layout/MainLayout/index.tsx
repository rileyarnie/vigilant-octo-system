/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import Navigation from './Navigation';
import NavBar from './NavBar';
import Configuration from './Configuration';
import Loader from '../Loader';
import routes from '../../../routes';

import * as actionTypes from '../../../store/actions';
import { initialState } from '../../../store/reducer';
interface IMainLayoutProps extends React.HTMLAttributes<Element> {
    defaultPath?: string;
    fullWidthLayout?: string;
    collapseMenu?: string;
    windowWidth?: unknown;
    onComponentWillMount?: any;
    layout?: string;
}
class MainLayout extends Component<IMainLayoutProps> {
    componentDidMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onComponentWillMount();
        }
    }
    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onComponentWillMount();
        }
    }
    render() {
        const menu = routes.map((route, index) => {
            return route.component ? (
                <Route key={index} path={route.path} exact={route.exact} render={(props) => <route.component {...props} />} />
            ) : null;
        });
        let mainClass = ['content-main'];
        if (this.props.fullWidthLayout) {
            mainClass = [...mainClass, 'container-fluid'];
        } else {
            mainClass = [...mainClass, 'container'];
        }
        return (
            <>
                <NavBar />
                <div className={mainClass.join(' ')}>
                    <Navigation />
                    <div className="pcoded-main-container full-screenable-node" onClick={() => this.mobileOutClickHandler}>
                        <div className="pcoded-wrapper">
                            <div className="pcoded-content">
                                <div className="pcoded-inner-content">
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                            <Suspense fallback={<Loader />}>
                                                <Switch>
                                                    {menu}
                                                    <Redirect from="/" to={this.props.defaultPath} />
                                                </Switch>
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Configuration />
            </>
        );
    }
}
const mapStateToProps = (state: typeof initialState) => {
    return {
        defaultPath: state.defaultPath,
        collapseMenu: state.collapseMenu,
        layout: state.layout,
        fullWidthLayout: state.fullWidthLayout
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(windowSize(MainLayout as any));
