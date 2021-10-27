import React, { Component } from "react";
import { connect } from 'react-redux';
import PerfectScrollbar from "react-perfect-scrollbar";
import * as actionTypes from "../../../../../../store/actions";
import { initialState } from '../../../../../../store/reducer';
import SYS from '../../../../../../store/constant';
interface IColorOptionsProps extends React.HTMLAttributes<Element> {
  onChangeHeaderBackColor?: any;
  headerBackColor: string;
}
class ColorOptions extends Component<IColorOptionsProps, {}> {
  render() {
    let colorOptions = (
      <div>
        <h6>Header Background Color</h6>
        <div className="theme-color header-color small">
          <a
            href={SYS.BLANK_LINK}
            onClick={() => this.props.onChangeHeaderBackColor("")}
            className={this.props.headerBackColor === "" ? "active" : ""}
            data-value="header-default"
          >
            <span />
            <span />
          </a>
          <a
            href={SYS.BLANK_LINK}
            onClick={() => this.props.onChangeHeaderBackColor("header-blue")}
            className={
              this.props.headerBackColor === "header-blue" ? "active" : ""
            }
            data-value="header-blue"
          >
            <span />
            <span />
          </a>
          <a
            href={SYS.BLANK_LINK}
            onClick={() => this.props.onChangeHeaderBackColor("header-red")}
            className={
              this.props.headerBackColor === "header-red" ? "active" : ""
            }
            data-value="header-red"
          >
            <span />
            <span />
          </a>
          <a
            href={SYS.BLANK_LINK}
            onClick={() => this.props.onChangeHeaderBackColor("header-purple")}
            className={
              this.props.headerBackColor === "header-purple" ? "active" : ""
            }
            data-value="header-purple"
          >
            <span />
            <span />
          </a>
          <a
            href={SYS.BLANK_LINK}
            onClick={() => this.props.onChangeHeaderBackColor("header-info")}
            className={
              this.props.headerBackColor === "header-info" ? "active" : ""
            }
            data-value="header-info"
          >
            <span />
            <span />
          </a>
          <a
            href={SYS.BLANK_LINK}
            onClick={() => this.props.onChangeHeaderBackColor("header-dark")}
            className={
              this.props.headerBackColor === "header-dark" ? "active" : ""
            }
            data-value="header-dark"
          >
            <span />
            <span />
          </a>
        </div>
      </div>
    );
    return (
      <>
        <div className="config-scroll">
          <PerfectScrollbar>{colorOptions}</PerfectScrollbar>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state: typeof initialState) => {
  return {
    layout: state.layout,
    headerBackColor: state.headerBackColor
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeHeaderBackColor: (headerBackColor: string) =>
      dispatch({
        type: actionTypes.HEADER_BACK_COLOR,
        headerBackColor: headerBackColor
      })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ColorOptions);
