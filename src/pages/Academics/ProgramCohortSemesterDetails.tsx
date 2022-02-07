/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react'
import {forwardRef} from 'react'
import { Alerts, ToastifyAlerts } from '../lib/Alert'
import MaterialTable from 'material-table'
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
import { Icons } from 'material-table'
import {Switch} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import Breadcrumb from '../../App/components/Breadcrumb'
import {Row, Col, Card, Button, Modal } from 'react-bootstrap'
import Config from '../../config'
import {Link} from 'react-router-dom'
import {ValidationForm, SelectGroup, TextInput} from 'react-bootstrap4-form-validation'
import { LinearProgress } from '@mui/material'
import {CourseCohortService} from '../Services/CourseCohortsService'
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
function ProgramCohortSemesterDetails () {
	const columns = [
		{title: 'ID', field: 'semester.id', editable: 'never' as const},
		{title: 'Name', field: 'semester.name'},
		{title: 'Start Date', render:(rowData)=>rowData.semester.startDate.slice(0,10)},
		{title: 'End Date', render:(rowData)=>rowData.semester.endDate.slice(0,10)}
	]
	const [errorMessages] = useState([])
	const programName = localStorage.getItem('programName')
	const anticipatedGraduation = localStorage.getItem('anticipatedGraduation')
	const programCohortId = localStorage.getItem('programCohortId')
	const [data, setData] = useState([])
	const [linearDisplay, setLinearDisplay] = useState('none')
	const [isError] = useState(false)
	useEffect(() => {
		fetchProgramCohortSemester('semester',programCohortId)
	}, [])
	function fetchProgramCohortSemester(loadExtras:string, programCohortId:string) {
		CourseCohortService.fetchCourseCohorts(loadExtras, programCohortId)
			.then(res => {
				const ccData = res['data']
				setData(ccData)
				setLinearDisplay('none')
			})
			.catch((error)=>{
				console.error(error)
				alerts.showError(error.message)
			})
	}
	return (
		<>
			<Row className='align-items-center page-header'>
				<Col>
					<Breadcrumb/>
				</Col>

			</Row>
			<LinearProgress style={{display: linearDisplay}} />
			<Row>

				<Col>
					<Card>
						<div>
							{isError &&
                            <Alert severity='error'>
								{errorMessages.map((msg, i) => {
									return <div key={i}>{msg}</div>
								})}
                            </Alert>
							}
						</div>
						<MaterialTable
							title={`${programName} of ${anticipatedGraduation} semesters`}
							columns={columns}
							data={data}
							icons={tableIcons}
						/>
					</Card>
				</Col>
			</Row>
		</>
	)
}
export default ProgramCohortSemesterDetails