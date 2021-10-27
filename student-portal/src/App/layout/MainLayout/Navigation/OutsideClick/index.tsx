import React, { Component } from "react";
import { connect } from 'react-redux';
import windowSize from "react-window-size";
import * as actionTypes from "../../../../../store/actions";
import { initialState } from '../../../../../store/reducer';
interface IOutsideClickProps extends React.HTMLAttributes<Element> {
  collapseMenu?: any;
  windowWidth?: any;
  onToggleNavigation?: any;
}
class OutsideClick extends Component<IOutsideClickProps, {}> {
  wrapperRef: any;
  constructor(props: IOutsideClickProps) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
  }
  setWrapperRef(node: any) {
    this.wrapperRef = node;
  }
  /**
   * close menu if clicked on outside of element
   */
  handleOutsideClick(event: any) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.props.windowWidth < 992 && this.props.collapseMenu) {
        this.props.onToggleNavigation();
      }
    }
  }
  render() {
    return (
      <div className="nav-outside" ref={this.setWrapperRef}>
        {this.props.children}
      </div>
    );
  }
}
const mapStateToProps = (state: typeof initialState) => {
  return {
    collapseMenu: state.collapseMenu
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(windowSize(OutsideClick as any));
