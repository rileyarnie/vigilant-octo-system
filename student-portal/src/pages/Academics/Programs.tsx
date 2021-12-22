/* eslint-disable react/display-name */
import React,{useState,useEffect} from 'react';
import {forwardRef} from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import { Redirect } from 'react-router-dom';
import { Icons } from 'material-table';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Row,Col} from 'react-bootstrap';
import Config from '../../config';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
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
const Programs = ():JSX.Element => {
    const [data,setData]=useState([]);
    const [isError]=useState(false);
    const [studentId]=useState(1);
    const [errorMessages]=useState([]);
    const timetablingSrv=Config.baseUrl.timetablingSrv;
    const columns=[
        {title:'ID',field:'program_cohorts_id'},
        {title:'Code',field:'program_cohorts_code'},
        {title:'Program Name',field:'pg_name'},
        {title:'Requires Clearance',field:'pg_requiresClearance'},
        {title:'Duration',field:'pg_duration'},
        {title:'Certification Type', field: 'pg_certificationType' },
        {title:'Start Date', render:(rowData)=>rowData.program_cohorts_startDate.slice(0,10)},
        {
            title:'Anticipated Graduation Date',
            render:(rowData)=>rowData.program_cohorts_anticipatedGraduationMonth+'-'+rowData.program_cohorts_anticipatedGraduationYear
        },
    ];
    useEffect(()=>{
        axios.get(`${timetablingSrv}/program-cohorts`,{params:{studentId:studentId}})
            .then(res=>{
                setData(res.data);
                console.log(res.data);
                handleRedirect();
            })
            .catch((error)=>{
                console.error(error);
                alerts.showError(error.message);
            });
    },[studentId]);
    const handleRedirect=() => {
        if (Row.length === 1) {
            return <Redirect from={'/programs'} to={'/semesters'} />;
        }
        return <Redirect from={'/programs'} to={'/semesters'} />;
    };
    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <div>
                            {isError&&
                            <Alert severity='error'>
                                {errorMessages.map((msg,i)=>{
                                    return <div key={i}>{msg}</div>;
                                })}
                            </Alert>
                            }
                        </div>
                        <MaterialTable
                            title='Programs'
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            onRowClick={(event, row) => {
                                window.location.href=('/semesters');
                                localStorage.setItem('programName', row.pg_name);
                                localStorage.setItem('programCode', row.program_cohorts_code);
                                localStorage.setItem('programCohortId', row.program_cohorts_id);
                                event.stopPropagation();
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Programs;