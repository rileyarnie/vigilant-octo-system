/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavRight from './NavRight';
import * as actionTypes from '../../../../store/actions';
import logo from '../../../../assets/images/logo.png';
import darkLogo from '../../../../assets/images/logo-dark.png';
import { initialState } from '../../../../store/reducer';
import SYS from '../../../../store/constant';
interface INavBarProps extends React.HTMLAttributes<Element> {
  onToggleNavigation?: any;
  fullWidthLayout?: any;
  headerBackColor?: any;
  collapseMenu?: any;
  headerFixedLayout?: any;
}

class NavBar extends Component<INavBarProps> {
    render(): JSX.Element {
        let headerClass = [
            'navbar',
            'pcoded-header',
            'navbar-expand-lg',
            this.props.headerBackColor
        ];
        if (this.props.headerFixedLayout) {
            headerClass = [...headerClass, 'headerpos-fixed'];
        }
        let toggleClass = ['mobile-menu'];
        if (this.props.collapseMenu) {
            toggleClass = [...toggleClass, 'on'];
        }
        let mainLogo = logo;
        if (this.props.headerBackColor === '') {
            mainLogo = darkLogo;
        }
        let mainHeaderClass = ['content-main'];
        if (this.props.fullWidthLayout) {
            mainHeaderClass = [...mainHeaderClass, 'container-fluid'];
        } else {
            mainHeaderClass = [...mainHeaderClass, 'container'];
        }
        const navBar = (
            <>
                <div className={mainHeaderClass.join(' ')}>
                    <div className="m-header">
                        <a
                            className={toggleClass.join(' ')}
                            id="mobile-collapse1"
                            href={SYS.BLANK_LINK}
                            onClick={this.props.onToggleNavigation}
                        >
                            <span />
                        </a>
                        <a href={SYS.BLANK_LINK} className="b-brand">
                            <img id="main-logo" src={mainLogo} alt="" className="logo" />
                        </a>
                    </div>
                    <a className="mobile-menu" id="mobile-header" href={SYS.BLANK_LINK}>
                        <i className="feather icon-more-horizontal" />
                    </a>
                    <div className="collapse navbar-collapse">
                        <NavRight />
                    </div>
                </div>
            </>
        );
        return (
            <>
                <header className={headerClass.join(' ')}>{navBar}</header>
            </>
        );
    }
}
const mapStateToProps = (state: typeof initialState) => {
    return {
        headerBackColor: state.headerBackColor,
        headerFixedLayout: state.headerFixedLayout,
        collapseMenu: state.collapseMenu,
        layout: state.layout,
        fullWidthLayout: state.fullWidthLayout
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
