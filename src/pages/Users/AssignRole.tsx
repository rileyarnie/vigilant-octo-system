/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import Config from '../../config';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Icons } from 'material-table';
import { Assign } from './Role/Assign';
import { Alerts, ToastifyAlerts } from '../lib/Alert';

const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const AssignRole = (): JSX.Element => {
    const columns = [
        { title: 'id', field: 'id' },
        { title: 'AAD ALIAS', field: 'AADAlias' },
        { title: 'Actions', render: (row) => <Assign {...row}></Assign> }
    ];
    const [data, setData] = useState([]);

    //for error handling
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);

    useEffect(() => {
        const authnzSrv = Config.baseUrl.authnzSrv;
        axios
            .get(`${authnzSrv}/users`)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.log('Error');
                alerts.showError(error.message);
            });
    }, []);

    return (
        <>
            <div>
                <Row className="align-items-center page-header">
                    <Col>
                        <Breadcrumb />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <div>
                                {iserror && (
                                    <Alert severity="error">
                                        {errorMessages.map((msg, i) => {
                                            return <div key={i}>{msg}</div>;
                                        })}
                                    </Alert>
                                )}
                            </div>
                            <MaterialTable icons={tableIcons} title="Select User to assign role" columns={columns} data={data} />
                        </Card>
                    </Col>
                </Row>
                &nbsp;&nbsp;&nbsp;
            </div>
        </>
    );
};

export default AssignRole;
