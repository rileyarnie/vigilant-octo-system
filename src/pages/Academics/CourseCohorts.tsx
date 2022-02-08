/* eslint-disable react/display-name */
import React,{useState,useEffect} from 'react'
import {forwardRef} from 'react'

import MaterialTable, { MTableToolbar } from 'material-table'
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import { Icons } from 'material-table'
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
import {MenuItem, Select, InputLabel} from '@material-ui/core'
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
const CourseCohorts = ():JSX.Element => {
  

    const [data,setData]=useState([])
    const [trainersData,setTrainers] = useState([])
    const [semesters,setSemesters] = useState([])
    const [isError]=useState(false)
    const []=useState(false)
    const [programId,setProgramId]=useState(0)
    const [campusId,setCampusId]=useState(0)
    const [startDate,setStartDate]=useState('')
    const [banner,setBanner]=useState('')
    const [graduationDate,setGraduationDate]=useState('')
    const [description]=useState('')
    const [imageUploaded,setImageUploaded]=useState('')
    const [programs,setPrograms]=useState([])
    const [campus,setCampus]=useState([])
    const [programName,setProgramName]=useState('')
    const [selectedCampusId,setSelectedCampusId]=useState(0)
    const [selectedProgramId,setSelectedProgramId]=useState(0)
    const [selectedGraduationDate]=useState()
    const [selectedStartDate]=useState()
    const [selectedDescription]=useState()
    const [showModal,setModal]=useState(false)
    const [cohortId,setCohortId]=useState(null)
    const [errorMessages]=useState([])
    const [linearDisplay, setLinearDisplay] = useState('none')
    const timetablingSrv=Config.baseUrl.timetablingSrv
   
   

    const columns=[
        { title: 'Course cohort ID', field: 'id', hidden: false },
        { title: 'Course code', field: 'course.codePrefix' },
        { title: 'Course Name', field: 'course.name' },
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => 
                <Select>
                    <Link to='/coursecohortdetails'>
                        <MenuItem value="View courses">View details</MenuItem>
                    </Link>
                </Select>
            
        }
    ]
    useEffect(()=>{
        setLinearDisplay('block')
        fetchcourseCohorts()
        fetchTrainers()
        fetchSemesters()
    },[])
    const fetchcourseCohorts = ():void => {
        axios.get(`${timetablingSrv}/course-cohorts`, {params:{loadExtras:'trainer' }})
            .then(res => {
                const ccData = res.data
                setData(ccData)
                setLinearDisplay('none')
            })
    }

    const fetchcourseCohortsByTrainerId = (trainerId: number):void => {
        axios.get(`${timetablingSrv}/course-cohorts`, {params:{trainerId: trainerId}})
            .then(res => {
                const ccData = res.data
                setData(ccData)
                setLinearDisplay('none')
            })
    }

    const fetchcourseCohortsBySemesterId = (semesterId: number):void => {
        axios.get(`${timetablingSrv}/course-cohorts`, {params:{semesterId: semesterId}})
            .then(res => {
                const ccData = res.data
                setData(ccData)
                setLinearDisplay('none')
            })
    }

    const fetchTrainers = ():void => {
        axios.get(`${timetablingSrv}/trainers`)
            .then(res => {
                const trData = res.data
                setTrainers(trData)
            })
    }

    const fetchSemesters = ():void => {
        axios.get(`${timetablingSrv}/semesters`)
            .then(res => {
                const semData = res.data
                setSemesters(semData)
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
                            title='Course Cohorts' 
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            options={{actionsColumnIndex:-1}}
                            components={{
                                Toolbar: props => 
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{display: 'flex', padding: '0px 0px'}}>
                                            <InputLabel id="demo-simple-select-label">Trainer</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                style={{width:150, textAlign: 'center'}}
                                                onChange={(e) => {
                                                    fetchcourseCohortsByTrainerId(e.target.value) 
                                                }}
                                            >
                                                {
                                                    trainersData.map(tr => {
                                                        return (
                                                            <MenuItem value={tr.tr_id}>{tr.tr_id}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                            
                                            <InputLabel id="demo-simple-select-label">Semester</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                style={{width:150, textAlign: 'center'}}
                                                onChange={(e) => {
                                                    fetchcourseCohortsBySemesterId(e.target.value) 
                                                }}
                                            >
                                                {
                                                    semesters.map(sem => {
                                                        return (
                                                            <MenuItem value={sem.id}>{sem.name}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CourseCohorts