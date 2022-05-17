import React from 'react'
import Scheduler, { AppointmentDragging, Resource } from 'devextreme-react/scheduler'
import Draggable from 'devextreme-react/draggable'
import 'devextreme/dist/css/dx.light.css'
import ScrollView from 'devextreme-react/scroll-view'
import './timetable.css'
import SelectBox from 'devextreme-react/select-box'
import CourseCohortService from '../../services/CourseCohortsService'
import { TrainerService } from '../../services/TrainerService'
import { TimetableService } from '../../services/TimetableService'
import { VenueService } from '../../services/VenueService'
import { Button } from 'react-bootstrap'
import { ToastifyAlerts } from '../lib/Alert'
import AppointmentTooltip from './AppointmentTooltip'
import { SemesterService } from '../../services/SemesterService'
const alerts = new ToastifyAlerts()
const currentDate = new Date()
const draggingGroupName = 'appointmentsGroup'
const venueData = VenueService.fetchVenues().then((res) => {
    return res['data'].map((venue) => {
        return { id: venue.venue_id, text: venue.venue_name }
    })
})
    .catch((error) => {
        console.error(error)
    })
const trainerData = TrainerService.fetchTrainers().then((res) => {
    return res['data'].map((t) => {
        return { id: t.tr_id, text: t.stf_name }
    })
})
    .catch((error) => {
        console.error(error)
    })
const priorities = [
    {
        text: 'High',
        id: 1,
        color: '#cc5c53',
    }, {
        text: 'Low',
        id: 2,
        color: '#ff9747',
    },
]

class Timetable extends React.Component {
    courseCohortData = []
    constructor(props) {
        super(props)
        this.state = {
            courseCohort: [],
            venues: [],
            startDate: '',
            endDate: '',
            timetableVenues: [],
            timetableUnits: [],
            tempTimetableUnit: [],
            maxNumUnitRepetition: 0,
            semesters: [],
            courseCohortId: 0,
            trainerId: 0,
            venueId: 0,
            semesterId: 0,
            numSessions: 0,
            startTime: '',
            endTime: '',
            dayOfWeek: '',
            openedCourseCohort: {},
            durationInMinutes: 0,
            recurrenceStartDate: new Date(),
            recurrenceEndDate: new Date(),
            color: '',
            status: '',
            errorMessage: '',
            colorData: [],
            colorId: 0,
            timeTabledUnitErrors: [],
            timetableDataWithErrors: [],
            itemsWithColor: [],
            priorityId: 2,
            disablePublishButton: false
        }
        this.onAppointmentRemove = this.onAppointmentRemove.bind(this)
        this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this)
        this.onAppointmentAdd = this.onAppointmentAdd.bind(this)
        this.timeTabledUnitsWithErrors = this.timeTabledUnitsWithErrors.bind(this)
        //this.onVenueChanged = this.onVenueChanged.bind(this)
        //this.handleEdit()
        //this.courseCohortData

    }
    // selectedTimetablingUnit = {}
    componentDidMount() {
        this.fetchCourseCohorts('course, timetablingUnits, semester', this.state.semesterId)
        this.fetchSemesters()
        this.sumNumSession()
        this.fetchTimetableUnitErrors(this.state.semesterId)
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.timeTabledUnitErrors !== this.state.timeTabledUnitErrors || prevState.timetableData !== this.state.timetableData) {
            this.timeTabledUnitsWithErrors(this.state.timetableData, this.state.timeTabledUnitErrors)
        }
    }

    /** Check if timetable has errors */
    checkTimeTableErrors() {
        // find if timetable has errors and disable publish button
        const conflictFound = this.state.timeTabledUnitErrors.find(error => error?.errors?.length > 0)

        this.setState({ disablePublishButton: conflictFound ? true : false })
    }

    fetchTimetableUnitErrors = (semesterId) => {
        TimetableService.getTimetableUnitErrors(semesterId)
            .then((res) => {
                const errors = res.data
                this.setState({ timeTabledUnitErrors: errors })
                this.checkTimeTableErrors() // check timetable for errors/conflicts
            })
    }
    fetchCourseCohorts = (loadExtras, semesterId) => {
        CourseCohortService.fetchCourseCohorts(loadExtras, semesterId)
            .then((res) => {
                const courseCohorts = res.data
                const courseCohortData = courseCohorts.filter(ch => ch.programCohortSemester.status === 'PUBLISHED').map((cc) => {
                    return {
                        text: cc.course.name,
                        id: cc.id,
                        trainerId: cc.trainerId,
                        programCohortId: cc.programCohortId,
                        timetablingUnits: cc.timetablingUnit,
                        trainingHours: cc.course.trainingHours
                    }
                })
                this.setState({ courseCohort: courseCohortData })
                let datasourceTu = []
                for (const courseCohort of courseCohorts) {
                    courseCohort.timetablingUnit.map((tu) => {
                        datasourceTu.push({
                            text: courseCohort.course.name,
                            timetablingUnitId: tu.id,
                            courseCohortId: tu.courseCohortId,
                            dayOfWeek: new Date(tu.recurrenceStartDate).toLocaleString('en-us', { weekday: 'short' }),
                            numSessions: tu.numSessions,
                            venueId: tu.venueId,
                            trainerId: courseCohort.trainerId,
                            startDate: new Date(tu.recurrenceStartDate),
                            endDate: new Date(tu.recurrenceEndDate),
                        })
                    })
                }


                this.setState({ timetableData: datasourceTu })
            })
            .catch((error) => {
                console.error(error)
                alerts.showError(error.message)
            })
    }


    timeTabledUnitsWithErrors(timeTabledUnits, timeTabledUnitErrors) {
        const items = timeTabledUnits?.map(unit => ({
            ...timeTabledUnitErrors?.find((error) => (error.timetablingUnitId === unit.timetablingUnitId) && error), priorityId: 2
            , ...unit
        }))
        const itemsWithColor = []
        // const itemsWithColor=items.map(item=>item.errors.length>0?({...item,item.color:"#ff0000"}):({{...item,item.color:"#000ff0"}})}
        for (let i = 0; i < items.length; i++) {
            if (items[i].errors?.length > 0) {
                itemsWithColor.push({ ...items[i], color: '#ff97471' })
            }
            else {
                itemsWithColor.push({ ...items[i], priorityId: 2 })
            }
        }
        return this.setState({ timetableDataWithErrors: items, itemsWithColor: itemsWithColor })
    }

    fetchSemesters = () => {
        SemesterService.fetchSemesters()
            .then((res) => {
                const semData = res['data']
                this.setState({ semesters: semData })
            })
            .catch((error) => {
                console.error(error)
                alerts.showError(error.message)
            })
    }
    sumNumSession = () => {
        return this.state.courseCohort.map(t => {
            t.totalNumSessions = 0
            t.timetablingUnit.forEach(tu => {
                t.totalNumSessions += tu.numSessions
            })
        })
    }

    onAppointmentRemove(e) {
        const index = this.state.timetableDataWithErrors.indexOf(e.itemData)
        if (index >= 0) {
            this.state.timetableDataWithErrors.splice(index, 1)
            this.state.courseCohort.push(e.itemData)
            this.checkTimeTableErrors() // check timetable for errors/conflicts
            this.setState({
                courseCohort: [...this.state.courseCohort],
                timetableDataWithErrors: [...this.state.timetableDataWithErrors]
            })
        }
    }

    /** add unit to the timetable and save the status to the database  */
    onAppointmentAdd(e) {
        const index = this.state.courseCohort.indexOf(e.fromData)
        const timetableData = e['itemData']
        const min = Math.min(timetableData.trainingHours, this.state.maxNumUnitRepetition)
        const timetableUnit = {
            courseCohortId: timetableData.id,
            recurrenceStartDate: new Date(timetableData.startDate),
            recurrenceEndDate: new Date(timetableData.endDate),
            startTime: timetableData.startDate.toTimeString().slice(0, 8),
            numSessions: min || 1,
            durationInMinutes: 60,
            colorId: this.state.colorId,
        }

        this.state.tempTimetableUnit.push(timetableUnit) // push to temporally array

        // save timetableUnit to the database
        TimetableService.createTimetableUnit(timetableUnit).then(() => {
            alerts.showSuccess('TimetableUnit added successfully')
        }).catch((error) => {
            console.error(error)
            alerts.showError(error.message)
        })

        // get expected hours for the course
        const expectedTrainingHours = timetableData.trainingHours

        // get the total duration for all the units for the course-cohort
        const currentSessionDuration = this.state.tempTimetableUnit.filter(u => u.courseCohortId === timetableData.id).map(unit => unit.durationInMinutes).reduce((a, b) => a + b, 0)
        const totalDurationBeforeLatestAdd = timetableData.timetablingUnits.map(unit => unit.durationInMinutes).reduce((a, b) => a + b, 0) + currentSessionDuration
        const totalDurationInHours = (totalDurationBeforeLatestAdd / 60)

        // check if all hours have been exhausted on the timetable
        const removeCoursesFromList = expectedTrainingHours === totalDurationInHours || totalDurationInHours > expectedTrainingHours
        if (!removeCoursesFromList) { console.log('Don\'t remove courses from the side, add more units') }

        // remove the course from the side list only if all hours have been met
        if (index >= 0 && removeCoursesFromList) {
            console.log(`All units meet the expected hours: ${totalDurationInHours} for the current cohort`)
            this.state.courseCohort.splice(index, 1)
        }

        // update the values 
        this.state.timetableDataWithErrors.push(e.itemData)
        this.setState({
            timetableUnits: [...this.state.courseCohort],
            timetableDataWithErrors: [...this.state.timetableDataWithErrors]
        })

        // check timetable for errors/conflicts
        this.checkTimeTableErrors()
    }

    async onAppointmentFormOpening(e) {
        const max = Math.max(20, 40)
        const { form } = e
        let trainerId = 0
        form.option('items', [
            {
                label: {
                    text: 'Select Trainer'
                },
                editorType: 'dxSelectBox',
                dataField: 'trainerId',
                editorOptions: {
                    items: await trainerData,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    onValueChange(e) {
                        this.setState({ trainerId: e.target.value })
                        trainerId = e.target.value
                        console.log('TRAINER ID', trainerId)
                        alert(trainerId)
                    }
                },
            }, {
                label: {
                    text: 'Select a Venue'
                },
                editorType: 'dxSelectBox',
                dataField: 'venueId',
                editorOptions: {
                    items: await venueData,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    onChange(e) {
                        this.setState({ venueId: e.target.value })
                    }
                }
            },
            {
                label: {
                    text: 'Start Time'
                },
                dataField: 'startDate',
                editorType: 'dxDateBox',
                itemTemplate: 'TestTextInput',
                editorOptions: {
                    width: '100%',
                    type: 'time',
                    onChange(args) {
                        this.setState({ startTime: args.value })
                    }
                }
            }, {
                label: {
                    text: 'End Time'
                },
                dataField: 'endDate',
                editorType: 'dxDateBox',
                editorOptions: {
                    width: '100%',
                    type: 'time',
                    onChange(args) {
                        this.setState({ endTime: args.value })
                    }
                }
            }, {
                label: {
                    text: 'Number of Sessions'
                },
                dataField: 'numSessions',
                editorType: 'dxNumberBox',
                editorOptions: {
                    width: '100%',
                    min: 0,
                    max: max,
                    format: '',
                    showSpinButtons: true,
                    type: 'number',
                    onChange(args) {
                        this.setState({ numSessions: args.value })
                    }
                }
            },

            {
                label: {
                    text: 'Duration in hours'
                },
                dataField: 'duration',
                editorType: 'dxNumberBox',
                editorOptions: {
                    width: '100%',
                    min: 0,
                    max: max,
                    format: '',
                    showSpinButtons: true,
                    type: 'number',
                    onChange(args) {
                        console.log('duration in hours data ', args)
                        this.setState({ durationInMinutes: args.value })
                    }
                }
            }


        ])
    }
    handleEdit(e) {
        const updatedTimetablingUnit = {
            timetablingUnitId: e.appointmentData.timetablingUnitId,
            venueId: e.appointmentData.venueId,
            recurrenceStartDate: e.appointmentData.startDate,
            recurrenceEndDate: e.appointmentData.endDate,
            durationInMinutes: e.appointmentData.durationInMinutes,
            startTime: e.appointmentData.startTime,
            numSessions: e.appointmentData.numSessions,
            trainerId: e.appointmentData.trainerId
        }
        const courseCohortId = this.getCourseCohortProgramCohortId(this.state.courseCohort, updatedTimetablingUnit.timetablingUnitId).ccId
        const programCohortId = this.getCourseCohortProgramCohortId(this.state.courseCohort, updatedTimetablingUnit.timetablingUnitId).pcId
        if (updatedTimetablingUnit.timetablingUnitId) {
            CourseCohortService.updateCourseCohort(courseCohortId, { trainerId: updatedTimetablingUnit.trainerId, programCohortId: programCohortId })
        }
        TimetableService.updateTimetableUnit(updatedTimetablingUnit)
            .then(() => {
                alerts.showSuccess('Timetable updated successfully')
                this.checkTimeTableErrors() // check timetable for errors/conflicts
            })
            .catch((error) => {
                console.error(error)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                alerts.showError('Couldn\'t update Timetable')
            })
    }
    onListDragStart(e) {
        e.cancel = true
    }
    onItemDragStart(e) {
        e.itemData = e.fromData
    }
    onItemDragEnd(e) {
        if (e.toData) {
            e.cancel = true
        }
    }
    async publishTimetable() {
        await SemesterService.publishTimetable(this.state.semesterId)
            .then(() => {
                alerts.showSuccess('Timetable published successfully')
            })
            .catch((error) => {
                console.error(error)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                alerts.showError(error.message)
            })
    }
    getTimetablingUnitId(courseCohorts, courseCohortId) {
        const cc = courseCohorts.filter(courseCohort => courseCohort.id === courseCohortId)

        return cc.timetablingUnit.id
    }
    getCourseCohortProgramCohortId(courseCohorts, timetablingUnitId) {
        const cc = courseCohorts.filter(it => it.timetablingUnits.map(tu => tu.id).includes(timetablingUnitId))[0]
        return {
            ccId: cc.id,
            pcId: cc.programCohortId
        }
    }
    alertTx(e) {
        alert(JSON.stringify(e.appointmentData))
    }
    render() {
        return (
            <React.Fragment>
                {this.state.semesterId ?
                    <Button
                        disabled={this.state.disablePublishButton}
                        onClick={() => this.publishTimetable()}
                        className="float-right" variant="danger"
                        style={{ transform: `translateX(${-40}px)` }}> Publish Timetable</Button>
                    : ''
                }
                <div className="option">
                    <span className="text-center"><b>Select a semester</b></span>
                    <SelectBox
                        items={this.state.semesters}
                        displayExpr="name"
                        valueExpr="id"
                        width={240}
                        //value={id}
                        onValueChanged={(e) => {
                            this.setState({ semesterId: e.value })
                            this.fetchCourseCohorts('course, timetablingUnits, semester', this.state.semesterId)
                            this.fetchTimetableUnitErrors(this.state.semesterId)
                            this.timeTabledUnitsWithErrors(this.state.timetableData, this.state.timeTabledUnitErrors)
                        }}
                    />
                </div>

                <ScrollView id="scroll">
                    {/* {this.state.semesterId? <Button className="float-right" variant="danger">Publish Timetable</Button> : ''} */}

                    <Draggable
                        id="list"
                        data="dropArea"
                        group={draggingGroupName}
                        onDragStart={this.onListDragStart}>
                        {this.state.courseCohort.map((courseCohort) =>
                            <Draggable
                                id="list-item-draggable"
                                key={courseCohort.id}
                                className="item dx-card dx-theme-text-color dx-theme-background-color"
                                clone={true}
                                group={draggingGroupName}
                                data={courseCohort}
                                onDragStart={this.onItemDragStart}
                                onDragEnd={this.onItemDragEnd}>
                                {<>Course name: {courseCohort.text}</>}<br />{<>TrainingHours: {courseCohort.trainingHours}</>}<br />{<>Trainer: {courseCohort.trainerId || 'No Set Trainer'}</>}<br />
                            </Draggable>)}
                    </Draggable>
                </ScrollView>
                <Scheduler
                    timeZone="Africa/Nairobi"
                    id="scheduler"
                    dataSource={this.state.timetableDataWithErrors}
                    views={['day', 'week', 'workWeek']}
                    defaultCurrentView="week"
                    firstDayOfWeek={1}
                    cellDuration={60}
                    defaultCurrentDate={currentDate}
                    height={600}
                    startDayHour={8}
                    endDayHour={17}
                    editing={true}
                    appointmentTooltipComponent={AppointmentTooltip}
                    onAppointmentFormOpening={this.onAppointmentFormOpening}
                    onAppointmentUpdated={e => { this.handleEdit(e) }}
                >
                    <Resource
                        fieldExpr='colorId'
                        dataSource={this.state.itemsWithColor}
                        label='text'
                        useColorAsDefault={true}
                    />
                    <Resource
                        dataSource={priorities}
                        fieldExpr="priorityId"
                        label="Priority"
                    />
                    <AppointmentDragging
                        group={draggingGroupName}
                        onRemove={this.onAppointmentRemove}
                        onAdd={this.onAppointmentAdd}
                    />
                </Scheduler>
            </React.Fragment>
        )
    }
}
export default Timetable