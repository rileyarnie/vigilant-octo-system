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
import SelectCurrency from 'react-select-currency'
import { Icons } from 'material-table'
import Alert from '@material-ui/lab/Alert'
import Breadcrumb from '../../App/components/Breadcrumb'
import {Row, Col, Card, Button, Modal } from 'react-bootstrap'
import {ValidationForm, TextInput} from 'react-bootstrap4-form-validation'
import { LinearProgress } from '@mui/material'
import {CourseCohortService} from '../services/CourseCohortsService'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { FeesManagementService } from '../services/FeesManagementService'
import { ProgramCohortService } from '../services/ProgramCohortService'
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
    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: any;
    }
    const selectStyle = {
        width:'100%',
        height: '30px'
    }
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                {value === index && 
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                }
            </div>
        )
    }
    function a11yProps(index: any) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`
        }
    }
    const useStyles = makeStyles((theme: Theme) => ({
        root: {
            flexGrow: 1,
            width: '100%',
            backgroundColor: theme.palette.background.paper
        }
    }))
    const columns = [
        {title: 'ID', field: 'course.id', editable: 'never' as const},
        {title: 'Name', field: 'course.name'},
        { title: 'Start Date', render: (rowData) => rowData.programCohortSemester.semester.startDate.slice(0, 10) },
        { title: 'End Date', render: (rowData) => rowData.programCohortSemester.semester.endDate.slice(0, 10) }
    ]
    const feeItemColumns = [
        {title: 'ID', field: 'id', editable: 'never' as const},
        {title: 'Narrative', field: 'narrative'},
        {title: 'Amount', render:(rowData)=>rowData.currency+' '+rowData.amount }
    ]
    const [errorMessages] = useState([])
    const [narrative, setNarrative] = useState('')
    const [amount, setAmount] = useState(0)
    const [currency,setCurrency] = useState('KES')
    const [feeItemId, setFeeItemId] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showPublishDialog, setShowPublishDialog] = useState(false)
    const [anticipatedStartDate, setAnticipatedStartDate] = useState('')
    const [numOfSlots, setNumOfSlots] = useState('')
    const [examCutOffDate, setExamCutOffDate] = useState('')
    const [selectedNarrative, setSelectedNarrative] = useState('')
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const programName = localStorage.getItem('programName')
    const semStartDate = localStorage.getItem('semStartDate')
    const semEndDate = localStorage.getItem('semEndDate')
    const semesterId = localStorage.getItem('semesterId')
    const anticipatedGraduation = localStorage.getItem('anticipatedGraduation')
    const programCohortId = localStorage.getItem('')
    const programCohortSemesterId = localStorage.getItem('programCohortSemesterId')
    const programCohortCode = localStorage.getItem('programCohortCode')
    const [courseCohortData, setCourseCohortData] = useState([])
    const [feeItemsData, setFeeItemData] = useState([])
    const [linearDisplay, setLinearDisplay] = useState('none')
    const [isError] = useState(false)
    useEffect(() => {
        fetchCourseCohortBySemesterId('course',programCohortSemesterId,programCohortId)
        getFeesItems()
    }, [])
    function fetchCourseCohortBySemesterId(loadExtras:string, semesterId:string, programCohortId:string) {
        CourseCohortService.fetchCourseCohortBySemesterId(loadExtras, semesterId, programCohortId)
            .then(res => {
                const ccData = res['data']
                setCourseCohortData(ccData)
                setLinearDisplay('none')
            })
            .catch((error)=>{
                console.error(error)
                alerts.showError(error.message)
            })
    }
    const classes = useStyles()
    const [value, setValue] = React.useState(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }
    function getFeesItems () {
        FeesManagementService.getFeesItems()
            .then((res)=>{
                const feeData = res['data']
                setFeeItemData(feeData)
            })
            .catch((error) => {
                alerts.showError(error.message)
                console.log(error)
            })
    }
    function handleFeeItemsCreation () {
        const createFeeItemRequest = {
            narrative:narrative,
            amount: amount,
            currency:currency,
            programCohortSemesterId: programCohortSemesterId
        }
        FeesManagementService.createFeesItems(createFeeItemRequest)
            .then((res)=>{
                console.log(res)
                alerts.showSuccess('Successfully created a fee item')
            })
            .catch((error) => {
                alerts.showError(error.message)
                console.log(error)
            })
    }
    function updateFeeItem(feeItemId, updates) {
        setLinearDisplay('block')
        FeesManagementService.updateFeesItems(updates)
            .then(() => {
                setLinearDisplay('none')
                alerts.showSuccess('Successfully updated a fee item')
                resetStateCloseModal()
            })
            .catch(error => {
                setLinearDisplay('block')
                alerts.showError(error.message)
                setLinearDisplay('none')
            })
    }
    const handleEdit = (e) => {
        e.preventDefault()
        const updates = {
            narrative: narrative === '' ? selectedNarrative : narrative,
            amount: amount === 0 ? selectedAmount : amount,
            currency: currency === '' ? selectedCurrency : currency,
            programCohortSemesterId: programCohortSemesterId
        }
        updateFeeItem(feeItemId, updates)

    }
    function publishProgramCohort () {
        const programCohortSemester = {
            status: 'PUBLISHED'
        }
        ProgramCohortService.publishProgramCohortSemester(programCohortSemesterId,programCohortSemester)
            .then((res)=>{
                console.log(res)
                alerts.showSuccess('Successfully published program cohort semester')
            })
            .catch((error) => {
                alerts.showError(error.message)
                console.log(error)
            })
    }
    const resetStateCloseModal=(): void =>{
        setFeeItemId(null)
        setNarrative('')
        setAmount(0)
        setCurrency('')
        setShowModal(false)
        setShowCancelModal(false)
    }
    // create fee items
    const showCreateModal = () => {
        showModal?resetStateCloseModal():setShowModal(true)
    }
    const toggleDialog = () => {
        showModal ? setShowDialog(false) : setShowDialog(true)
    }
    //publish program cohort semester
    const showPublishSemesterModal = () => {
        showPublishModal?resetStateCloseModal():setShowPublishModal(true)
    }
    const showCancelSemesterModal = () => {
        showCancelModal?resetStateCloseModal():setShowCancelModal(true)
    }
    const togglePublishModalDialog = () => {
        showPublishModal ? setShowPublishDialog(false) : setShowPublishDialog(true)
    }
    const onSelectedCurrency = currencyAbbrev => {
        setCurrency(currencyAbbrev)
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
                <div className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Course Cohorts" {...a11yProps(0)} />
                            <Tab label="Fees Items" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Col>
                            <Card>
                                <Col>
                                    <Button className="float-right" variant="danger" onClick={()=>{
                                        showCreateModal()
                                    }}>
                                        Create Course Cohort
                                    </Button>{' '}{' '}
                                    <Button className="float-center" variant="danger" onClick={()=>{
                                        showPublishSemesterModal()
                                    }}>Publish </Button>
                                    <Button className="float-center" style={{ marginLeft: '48px' }} variant="danger" onClick={()=>{
                                        showCancelSemesterModal()
                                    }}>Cancel </Button>
                                </Col>
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
                                    title={`${programName} of ${anticipatedGraduation} course cohorts`}
                                    columns={columns}
                                    data={courseCohortData}
                                    icons={tableIcons}
                                />
                            </Card>
                        </Col>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Col>
                            <Card>
                                <Col>
                                    <Button className="float-right" variant="danger" onClick={()=>{
                                        showCreateModal()
                                    }}>
                                        Create Fee Item
                                    </Button>
                                </Col>
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
                                    title={`${programName} of ${anticipatedGraduation} Fees Items`}
                                    columns={feeItemColumns}
                                    data={feeItemsData}
                                    icons={tableIcons}
                                    options={{actionsColumnIndex:-1}}
                                    actions={[
                                        {
                                            icon: Edit,
                                            tooltip: 'Edit Row',
                                            onClick: (event, rowData) => {
                                                setFeeItemId(rowData.id)
                                                setSelectedNarrative(rowData.narrative)
                                                setSelectedAmount(rowData.amount)
                                                setSelectedCurrency(rowData.currency)
                                                showCreateModal()
                                            }
                                        }
                                    ]}
                                />
                            </Card>
                        </Col>
                    </TabPanel>
                </div>
            </Row>
            <Modal
                show={showModal}
                onHide={showCreateModal}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {feeItemId ? 'Edit fee item' : 'Create a fee item'} for {programName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor='narrative'><b>Narrative</b></label><br/>
                            <TextInput name='narrative'  id='narrative'  type="text" value = {narrative}
                                onChange={(e)=>{
                                    setNarrative(e.target.value)  
                                }} required /><br/>
                            <label htmlFor='amount'><b>Amount</b></label><br/>
                            <TextInput name='amount'  id='amount'  type="text" value = {amount}
                                onChange={(e)=>{
                                    setAmount(e.target.value)  
                                }} required /><br/>
                            <label htmlFor='currency'><b>Currency</b></label><br />
                            <SelectCurrency style = {selectStyle} name= 'currency' value={currency} onChange={onSelectedCurrency} />
                        </div>
                        <div className='form-group'>
                            <button className="btn btn-info float-left"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowDialog(true)
                                }}
                            >
                                Preview
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-right" onClick={showCreateModal}> Close </button>
                </Modal.Body>
            </Modal>
            <Modal
                show={showDialog}
                onHide={toggleDialog}
                size="lg"
                backdrop="static"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Do you want to create fee item for {programName} ?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor='narrative'><b>Narrative : </b>{narrative}</label><br/>
                            <label htmlFor='amount'><b>Amount : </b>{amount}</label><br/>
                            <label htmlFor='currency'><b>Currency : </b>{currency}</label><br />
                        </div><br/>
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="btn btn-info btn-rounded" onClick={(e) => {
                        e.preventDefault()
                        setShowDialog(false)
                    }}>Continue editing</Button>
                    <Button onClick={(e)=>{
                        feeItemId? handleEdit(e) :  handleFeeItemsCreation()
                    }} variant="btn btn-danger btn-rounded">Submit</Button>
                </Modal.Footer>
            </Modal>
            {/*Publish course cohort semester*/}
            <Modal
                show={showPublishModal}
                onHide={showPublishSemesterModal}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Publish {programName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <div className='form-group'>
                            <label htmlFor='narrative'><b>Anticipated startDate</b></label><br/>
                            <TextInput name='narrative'  id='narrative' type="date" min={semStartDate} max={semEndDate}   value = {anticipatedStartDate}
                                onChange={(e)=>{
                                    setAnticipatedStartDate(e.target.value)
                                }} required /><br/>
                            <label htmlFor='narrative'><b>Exam Cut off Date</b></label><br/>
                            <TextInput name='examCutoff'  id='examCutoff'  type="date" min={semStartDate} max={semEndDate} value = {examCutOffDate}
                                onChange={(e)=>{
                                    setExamCutOffDate(e.target.value)
                                }} required /><br/>
                            <label htmlFor='amount'><b>Number of Slots</b></label><br/>
                            <TextInput name='number of Slots'  id='number of Slots'  type="number" value = {numOfSlots}
                                onChange={(e)=>{
                                    setNumOfSlots(e.target.value)
                                }} required /><br/>
                        </div>
                        <div className='form-group'>
                            <button className="btn btn-info float-left"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowPublishDialog(true)
                                }}
                            >
                                Publish
                            </button>
                        </div>
                    </ValidationForm>
                    <button className="btn btn-danger float-right" onClick={(e) => {
                        e.preventDefault()
                        setShowPublishModal(false)
                        }}> Close </button>
                </Modal.Body>
            </Modal>
            {/* cancel programCohortSemester modal */}
            <Modal
                show={showCancelModal}
                onHide={showCancelSemesterModal}
                size="lg"
                backdrop="static"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Cancelling a program-cohort cancels all active course-cohorts and prevents addition of the cohort to a semester or timetabling of the same, 
                    are you sure you want to proceed? 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="btn btn-info btn-rounded" onClick={(e) => {
                        e.preventDefault()
                        setShowCancelModal(false)
                    }}>No</Button>
                    <Button variant="btn btn-danger btn-rounded">Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showPublishDialog}
                onHide={togglePublishModalDialog}
                size="sm"
                backdrop="static"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        publish {programName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationForm>
                        <p>”Publishing a semester for {programCohortCode} will disable you from adding semesters to this semester for the course, continue?”</p>
                        <div className='form-group'>
                            <label htmlFor='narrative'><b>Anticipated Start Date : </b>{anticipatedStartDate}</label><br/>
                            <label htmlFor='amount'><b>Exam Cutoff Date : </b>{examCutOffDate}</label><br/>
                            <label htmlFor='currency'><b>Number of Slots : </b>{numOfSlots}</label><br/>
                        </div><br/>
                    </ValidationForm>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="btn btn-danger btn-rounded" onClick={(e) => {
                        e.preventDefault()
                        setShowPublishDialog(false)
                    }}>Continue editing</Button>
                    <Button onClick={publishProgramCohort} variant="btn btn-info btn-rounded">Continue to Publish</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ProgramCohortSemesterDetails