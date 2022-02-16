/* eslint-disable react/display-name */
import React,{useState,useEffect,forwardRef} from 'react'
import MaterialTable, { Icons } from 'material-table'
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import axios from 'axios'
import Card from '@material-ui/core/Card'
import Alert from '@material-ui/lab/Alert'
import Breadcrumb from '../../App/components/Breadcrumb'
import {Row,Col,Modal,Button} from 'react-bootstrap'
import Config from '../../config'
import {MenuItem, Select, Switch} from '@material-ui/core'
import {ValidationForm,SelectGroup,FileInput,TextInput} from 'react-bootstrap4-form-validation'
import CardPreview from './CardPreview'
import {Link} from 'react-router-dom'
import { Alerts, ToastifyAlerts } from '../lib/Alert'
import { LinearProgress } from '@mui/material'
const alerts: Alerts = new ToastifyAlerts()
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
}
const CourseCohortsDetails = (props:any):JSX.Element => {
    const [data,setData]=useState([])
    const [trainersData,setTrainers] = useState([])
    const [semesters,setSemesters] = useState([])
    const [isError]=useState(false)
    const [,setDisabled]=useState(false)
    const [errorMessages]=useState([])
    const [linearDisplay, setLinearDisplay] = useState('none')
    const timetablingSrv=Config.baseUrl.timetablingSrv
   
    const columns=[
        { title: 'Course Cohort ID', field: 'id', hidden: false },
        { title: 'Student ID', field: 'registration.student.id', hidden: false },
        { title: 'Marks Type', field: 'courseCohortMarks.typeOfMarks' },
        { title: 'Diploma Marks', field: 'courseCohortMarks.diplomaMarks' },
        { title: 'Bachelor Marks', field: 'courseCohortMarks.bachelorMarks' },
        { title: 'Masters Marks', field: 'courseCohortMarks.mastersMarks' },
        { title: 'PHD Marks', field: 'courseCohortMarks.phdMarks' },
        { title: 'CB Marks', field: 'courseCohortMarks.competencyBasedMarks' },
        { title: 'Short Term Marks', field: 'courseCohortMarks.shortTermMarks' }
    ]
    useEffect(()=>{
        setLinearDisplay('block')
        fetchcourseCohorts()
    },[])

    const courseCohortId = props.match.params.id
    
    const fetchcourseCohorts = ():void => {
        axios.get(`${timetablingSrv}/course-cohorts`, {params:{loadExtras:'marks,student', id:courseCohortId }})
            .then(res => {
                const ccData = res.data
                setData(ccData)
                setLinearDisplay('none')
            })
    }

    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb/>
                </Col>
            </Row>
            <LinearProgress  style={{display: linearDisplay}} /> 
            <Row>
                <Col>
                    <Card>
                        <div>
                            {isError&&
                            <Alert severity='error'>
                                {errorMessages.map((msg,i)=>{
                                    return <div key={i}>{msg}</div>
                                })}
                            </Alert>
                            }
                        </div>
                        <MaterialTable
                            title='Course Cohort Student/Marks Details' 
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            options={{actionsColumnIndex:-1}}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CourseCohortsDetails