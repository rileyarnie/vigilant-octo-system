import React from 'react';
import MaterialTable from 'material-table';

interface Iprops {
    title?: string;
    data: [];
    columns: [];
}

const TableWrapper = ({ title, data, columns, ...props }: Iprops): JSX.Element => {
    return <MaterialTable title={title} data={data} columns={columns} options={{ pageSize: 50 }} {...props} />;
};

export default TableWrapper;
