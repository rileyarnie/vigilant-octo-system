import * as React from 'react';
const loader = (): JSX.Element => {
    return (
        <div className="loader-bg">
            <div className="loader-track">
                <div className="loader-fill" />
            </div>
        </div>
    );
};
export default loader;
