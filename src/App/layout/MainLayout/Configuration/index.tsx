/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import Layout from './Layout';
import TabConfig from './TabConfig';
import SYS from '../../../../store/constant';
type ConfigurationState = {
    configOpen?: boolean;
};
class Configuration extends Component<any, ConfigurationState> {
    state = {
        configOpen: false
    };
    render(): JSX.Element {
        let configClass = ['menu-styler'];
        if (this.state.configOpen) {
            configClass = [...configClass, 'open'];
        }
        return (
            <>
                <div id="styleSelector" className={configClass.join(' ')}>
                    <div className="style-toggler">
                        <a
                            href={SYS.BLANK_LINK}
                            onClick={() =>
                                this.setState((prevState) => {
                                    return { configOpen: !prevState.configOpen };
                                })
                            }
                        >
                            *
                        </a>
                    </div>
                    <div className="style-block">
                        <h5 className="mb-2 text-white">MIOG Live Customizer</h5>
                        <div className="m-style-scroller">
                            <TabConfig />
                            <Layout />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Configuration;
