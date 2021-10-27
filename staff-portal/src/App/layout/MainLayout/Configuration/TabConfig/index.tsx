import React, { Component } from "react";
import { connect } from "react-redux";
import ColorOptions from "./ColorOptions";
import LayoutOptions from "./LayoutOptions";
import { initialState } from '../../../../../store/reducer';

class TabConfig extends Component<{}, {}> {
  render() {
    return (
      <>
        <ColorOptions />
        <hr />
        <LayoutOptions />
        <hr />
      </>
    );
  }
}
const mapStateToProps = (state: typeof initialState) => {
  return {
    layout: state.layout
  };
};

export default connect(mapStateToProps)(TabConfig);
