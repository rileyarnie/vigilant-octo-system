import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { IconButton, Tooltip } from '@material-ui/core';

interface Props {
    clearFilter: () => void;
}
const ClearFilter: React.FunctionComponent<Props> = (props) => {
    return (
        <Tooltip title={<h5 style={{ color: 'white' }}>Clear Filters</h5>} placement="top">
            <IconButton onClick={() => props.clearFilter()} aria-label="delete">
                <HighlightOffIcon />
            </IconButton>
        </Tooltip>
    );
};

export default ClearFilter;
