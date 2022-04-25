/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import { authnzAxiosInstance } from '../../utlis/interceptors/authnz-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
const alerts: Alerts = new ToastifyAlerts();

export const ActionsList = (props): JSX.Element => {
    const [actions, setActions] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    useEffect(() => {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get(`/actions/${props.selectedrowprops.selectedrowprops.id}`)
            .then((res) => {
                setActions(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.log('error');
                alerts.showError(error.message);
            });
    }, []);

    const columns = [
        { title: 'id', field: 'id' },
        { title: 'Action Name', field: 'name' }
    ];
    return (
        <div>
            <LinearProgress style={{ display: linearDisplay }} />
            <TableWrapper title="Action List" columns={columns} data={actions} options={{}} />
        </div>
    );
};

export default ActionsList;
