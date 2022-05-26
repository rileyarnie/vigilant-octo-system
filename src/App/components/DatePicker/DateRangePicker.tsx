import React from 'react';
import { DateRangePicker } from 'react-date-range';

interface Props {
    setDateRange: (selection) => void;
    ranges
}

const DateRangePickerElement: React.FunctionComponent<Props> = (props) => {

    return (
        <DateRangePicker
            onChange={(item) => props.setDateRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={props.ranges}
            direction="horizontal"
        />
    );
};

export default DateRangePickerElement;
