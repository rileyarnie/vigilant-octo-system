/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../../../../store/actions';
import { initialState } from '../../../../../store/reducer';
import SYS from '../../../../../store/constant';
interface ILayoutProps extends React.HTMLAttributes<Element> {
  onReset?: any;
  onChangeLayoutType?: any;
  layoutType: string;
}
class Layout extends Component<ILayoutProps> {
    render(): JSX.Element {
        const layoutOption = (
            <div>
                <h6>Layouts</h6>
                <div className="theme-color layout-type">
                    <a
                        href={SYS.BLANK_LINK}
                        onClick={() => this.props.onChangeLayoutType('menu-dark')}
                        title="Default Layout"
                        className={this.props.layoutType === 'menu-dark' ? 'active' : ''}
                        data-value="menu-dark"
                    >
                        <span />
                        <span />
                    </a>
                    <a
                        href={SYS.BLANK_LINK}
                        onClick={() => this.props.onChangeLayoutType('menu-light')}
                        title="Light"
                        className={this.props.layoutType === 'menu-light' ? 'active' : ''}
                        data-value="menu-light"
                    >
                        <span />
                        <span />
                    </a>
                </div>
                <a
                    href={SYS.BLANK_LINK}
                    onClick={() => this.props.onReset('dark')}
                    title="Reset"
                    className="btn btn-block btn-danger"
                    data-value="reset"
                >
          Reset
                </a>
            </div>
        );
        return <>{layoutOption}</>;
    }
}
const mapStateToProps = (state: typeof initialState) => {
    return {
        layoutType: state.layoutType
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        onChangeLayoutType: (layoutType: string) =>
            dispatch({ type: actionTypes.LAYOUT_TYPE, layoutType: layoutType }),
        onReset: (layoutType: string) =>
            dispatch({ type: actionTypes.RESET, layoutType: layoutType })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
