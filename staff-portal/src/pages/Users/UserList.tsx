import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';

const tableIcons = {
    Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref: any) => <Check {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    Filter: forwardRef((props, ref: any) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: any) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: any) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: any) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: any) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: any) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: any) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: any) => <ViewColumn {...props} ref={ref} />)
};

function UserList() {

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'AAD Alias', field: 'AADAlias' },


    ];
    const [data, setData] = useState([]);
    const baseUrl = Config.baseUrl.authnzSrv;
    useEffect(() => {
        axios.get(`${baseUrl}/users`)
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                //handle error using logging library
                console.log('Error');
            });
    }, []);

    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5>Users</h5>
                        </Card.Header>
                        <MaterialTable
                            title=''
                            columns={columns}
                            data={data}
                            // @ts-ignore
                            icons={tableIcons}

                        />

                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default UserList;