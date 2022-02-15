/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react'
import Scheduler, { AppointmentDragging } from 'devextreme-react/scheduler'
import Draggable from 'devextreme-react/draggable'
import 'devextreme/dist/css/dx.light.css'
import ScrollView from 'devextreme-react/scroll-view'
import './timetable.css'
import SelectBox from 'devextreme-react/select-box'
import CourseCohortService from '../../services/CourseCohortsService'
import { TrainerService } from '../../services/TrainerService'
import { TimetableService } from '../../services/TimetableService'
import { VenueService } from '../../services/VenueService'
import moment from 'moment'
import { Button } from 'react-bootstrap'
const alerts = new ToastifyAlerts()
const currentDate = new Date()
const draggingGroupName = 'appointmentsGroup'
import { ToastifyAlerts } from '../lib/Alert'
import { SemesterService } from '../../services/SemesterService'
const venueData = VenueService.fetchVenues().then((res) => {
    return res['data'].map((venue) => {
        return {id: venue.venue_id, text: venue.venue_name}
    })
})
    .catch((error) => {
        console.error(error)
    })
const trainerData = TrainerService.fetchTrainers().then((res) => {
    return res['data'].map((t) => {
        return {id: t.tr_id, text: t.tr_userId}
    })
})
    .catch((error) => {
        console.error(error)
    })
class Timetable extends React.Component {
    //myData:CourseCohort[];
    courseCohortData = []
    constructor(props) {
        super(props)
        this.state = {
            courseCohort: [],
            //timetableData: {},
            //trainers,
            venues: [],
            startDate: '',
            endDate: '',
            timetableVenues: [],
            timetableUnits: [],
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
            openedCourseCohort:{},
            durationInMinutes:0,
            recurrenceStartDate: new Date(),
            recurrenceEndDate:new Date()
        }
        this.onAppointmentRemove = this.onAppointmentRemove.bind(this)
        this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this)
        this.onAppointmentAdd = this.onAppointmentAdd.bind(this)
        //this.onVenueChanged = this.onVenueChanged.bind(this);
        //this.handleEdit()
        this.courseCohortData

    }
    // selectedTimetablingUnit = {}
    componentDidMount() {
        this.fetchCourseCohorts('course, timetablingUnits, semesters',this.state.semesterId)
        this.fetchSemesters()
        //this.fetchTimetableData(this.state.semesterId)
        this.sumNumSession()
    }
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    fetchCourseCohorts = ( loadExtras, semesterId) => {
        CourseCohortService.fetchCourseCohorts(loadExtras, semesterId)
            .then((res) => {
                const courseCohorts = res.data
                // this.courseCohortData = courseCohorts
                // // const courseCohortData = courseCohorts.map((cc) => {
                // //     return {
                // //         text: cc.course.name,
                // //         id: cc.id,
                // //         trainerId: cc.trainerId,
                // //         trainingHours: cc.course.trainingHours
                // //     }
                // // })
                // this.setState({courseCohort:courseCohortData})
                // const semData = myData.semester;
                // const startDate = moment(semData?.startDate)
                // const endDate = moment(semData?.endDate)
                // this.setState({startDate: startDate.toISOString().slice(0,10)})
                // this.setState({endDate: endDate.toISOString().slice(0,10)})
                // const weeks = Math.floor(moment.duration(endDate.diff(startDate)).asWeeks())
                // const dataSource = myData.map((t) => 
                //     .timetablingUnit.map((tt) => {
                //         return {
                //             text: t.course.name,
                //             timetablingUnitId: tt.id,
                //             courseCohortId: tt.courseCohortId,
                //             dayOfWeek: tt.dayOfWeek,
                //             numSessions: tt.numSessions,
                //             venueId: 45,
                //             trainerId: 46,
                //             startDate: new Date(moment(new Date().toISOString().slice(0, 10)+' '+tt.startTime).toISOString()),
                //             endDate: new Date(moment(new Date().toISOString().slice(0, 10)+' '+tt.endTime).toISOString())
                //         }
                //     })
                    
                // )
                let datasourceTu = []
                for(const courseCohort of courseCohorts){
                    courseCohort.timetablingUnit.map((tu) => {
                        datasourceTu.push({
                            text: courseCohort.course.name,
                            timetablingUnitId: tu.id,
                            courseCohortId: tu.courseCohortId,
                            dayOfWeek: new Date(tu.recurrenceStartDate).toLocaleString('en-us', {  weekday: 'short' }),
                            numSessions: tu.numSessions,
                            venueId: tu.venueId,
                            trainerId: tu.trainerId,
                            startDate: new Date(tu.recurrenceStartDate),
                            endDate: new Date(tu.recurrenceEndDate)
                        })
                    } )
                }


                this.setState({timetableData:datasourceTu})
            })
            .catch((error) => {
                console.error(error)
                alerts.showError(error.message)
            })
    };
    //     fetchTimetableData = (semesterId:number) => {
    //             TimetableService.getTimetableUnit(semesterId)
    //                 .then((res) => {
    //                     const data = res['data']
    //                     const dataS = data.map((t) => {
    //                     return {
    //                     text: 'Hello Kenya',
    //                     timetablingUnitId: t.id,
    //                     courseCohortId: t.courseCohortId,
    //                     dayOfWeek: t.dayOfWeek,
    //                     numSessions: t.numSessions,
    //                     venueId: t.venueId,
    //                     trainerId: t.trainerId,
    //                     startDate: new Date(moment(new Date().toISOString().slice(0, 10)+' '+t.startTime).toISOString()),
    //                     endDate: new Date(moment(new Date().toISOString().slice(0, 10)+' '+t.endTime).toISOString())
    //                     }
    //                    })
    //                 this.setState({timetableData:dataS})
    //                 })
    //                 .catch((error) => {
    //                     console.error(error)
    //                     alerts.showError(error.message)
    //                 })
    //         };
    fetchSemesters = () => {
        SemesterService.fetchSemesters()
            .then((res) => {
                const semData = res['data']
                this.setState({semesters: semData})
            })
            .catch((error) => {
                console.error(error)
                alerts.showError(error.message)
            })
    };
    sumNumSession  = () => {
        return this.state.courseCohort.map(t => {
            t.totalNumSessions = 0
            t.timetablingUnit.forEach(tu => {
                t.totalNumSessions += tu.numSessions
            })
        })
    }
    // validSessionUpdate = (trainingHours:number, weeksInSemester:number, sessions:number) => {
    //     const minimum = Math.min(trainingHours, weeksInSemester)
    //     return sessions < minimum
    // }
    onAppointmentRemove(e) {
        const index = this.state.timetableData.indexOf(e.itemData)
        if (index >= 0) {
            this.state.timetableData.splice(index, 1)
            this.state.courseCohort.push(e.itemData)
            this.setState({
                courseCohort: [...this.state.courseCohort],
                timetableData: [...this.state.timetableData]
            })
        }
    }
    onAppointmentAdd(e) {
        const index = this.state.courseCohort.indexOf(e.fromData)
        const timetableData = e['itemData']
        const min =  Math.min(timetableData.trainingHours, this.state.maxNumUnitRepetition)
        const timetableUnit = {
            courseCohortId: timetableData.id,
            recurrenceStartDate: timetableData.startDate,
            recurrenceEndDate: timetableData.endDate,
            startTime: timetableData.startDate.toTimeString().slice(0,8),            
            numSessions: min || 1,
            durationInMinutes: 60
        }
        // console.log(timetableData)
        // console.log(timetableUnit)
        // this.validSessionUpdate(timetableData.trainingHours,this.state.maxNumUnitRepetition,7 );
        // this.sumNumSession();
        TimetableService.createTimetableUnit(timetableUnit)
            .then(() => {
                alerts.showSuccess('TimetableUnit added successfully')
               
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error)
                alerts.showError(error.response.data)
            })
        if (index >= 0) {
            this.state.courseCohort.splice(index, 1)
            this.state.timetableData.push(e.itemData)
            this.setState({
                timetableUnits: [...this.state.courseCohort],
                timetableData: [...this.state.timetableData]
            })
        }
    }
    async onAppointmentFormOpening(e) {
        const max = Math.max(20,40)
        const { form } = e
        const t = e['appointmentData']
        // this.selectedTimetablingUnit = e['appointmentData']
        this.state.openedCourseCohort = t
        // alert (JSON.stringify(t))
        let  venueId  = e.appointmentData
        let  trainerId = 0
        let timetablingUnitId = t.timetablingUnitId
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
                        this.setState({trainerId: e.target.value})
                        trainerId = e.target.value
                        alert(trainerId)
                    }
                }
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
                editorOptions: {
                    width: '100%',
                    type: 'time',
                    onChange(args) {
                        this.setState({startTime: args.value})
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
                        this.setState({endTime: args.value})
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
                    format:'',
                    showSpinButtons: true,
                    type: 'number',
                    onChange(args) {
                        this.setState({numSessions: args.value})
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
                    format:'',
                    showSpinButtons: true,
                    type: 'number',
                    onChange(args) {
                        this.setState({durationInMinutes: args.value})
                    }
                }
            }


        ])

    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type


    handleEdit (e) {
        const timetablingUnitId = 1//this.getTimetablingUnitId(this.courseCohortData,e.timetableData.id)
        console.log('psxr',this.courseCohortData)
        const updatedTimetablingUnit = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            timetablingUnitId: timetablingUnitId,
            venueId: this.state.venueId,
            recurrenceStartDate: this.state.recurrenceStartDate,
            recurrenceEndDate: this.state.recurrenceEndDate,
            durationInMinutes: this.state.durationInMinutes,
            startTime: this.state.startTime,
            numSessions: this.state.numSessions,
            trainerId: this.state.trainerId
        }
        
        TimetableService.updateTimetableUnit(updatedTimetablingUnit)
            .then(() => {
                alerts.showSuccess('Timetable updated successfully')
            })
            .catch((error) => {
                console.error(error)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                alerts.showError('Couldnt update Timetable')
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
    async publishTimetable(){
        await SemesterService.publishTimetable(this.state.semesterId)
            .then(res => {
                alerts.showSuccess('Timetable published successfully')
            })
            .catch((error) => {
                console.error(error)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                alerts.showError(error.message)
            })
    }

    getTimetablingUnitId(courseCohorts, courseCohortId){
        const cc = courseCohorts.filter(courseCohort => courseCohort.id === courseCohortId )

        return cc.timetablingUnit.id
    }
    alertTx(e){
        alert(JSON.stringify(e.appointmentData))
    }
    render() {
        return (
            <React.Fragment>
                {this.state.semesterId? <Button  onClick={() =>  this.publishTimetable() } className="float-right" variant="danger" style={{transform: `translateX(${-40}px)`}} >Publish Timetable</Button>: '' }
                <div className="option">
                    <span className="text-center"><b>Select a semester</b></span>
                    <SelectBox
                        items={this.state.semesters}
                        displayExpr="name"
                        valueExpr="id"
                        width={240}
                        //value={id}
                        onValueChanged = {(e) => { this.setState({ semesterId: e.value})
                            this.fetchCourseCohorts('course, timetablingUnits, semesters',this.state.semesterId)
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
                                key={courseCohort.id}
                                className="item dx-card dx-theme-text-color dx-theme-background-color"
                                clone={true}
                                group={draggingGroupName}
                                data={courseCohort}
                                onDragStart={this.onItemDragStart}
                                onDragEnd={this.onItemDragEnd}>
                                {<>Course name: {courseCohort.text}</>}<br/>{<>Sessions: 0/32</>}<br/>{<>Trainer: {courseCohort.trainerId || 'No Set Trainer'}</>}<br/>
                            </Draggable>)}
                    </Draggable>
                </ScrollView>
                <Scheduler
                    timeZone="Africa/Nairobi"
                    id="scheduler"
                    dataSource={this.state.timetableData}
                    views={['day', 'week', 'workWeek']}
                    defaultCurrentView="week"
                    firstDayOfWeek={1}
                    defaultCurrentDate={currentDate}
                    height={600}
                    startDayHour={0}
                    endDayHour={24}
                    editing={true}
                    onAppointmentFormOpening={this.onAppointmentFormOpening}
                    onAppointmentUpdated={e => {this.handleEdit(e)}}
                >
                    {/*                     <Resource */}
                    {/*                         dataSource= {await venueData} */}
                    {/*                         fieldExpr="trainerId" */}
                    {/*                         useColorAsDefault={true} */}
                    {/*                     /> */}
                    {/*                     <Resource */}
                    {/*                         dataSource= {await venueData} */}
                    {/*                         fieldExpr="venueId" */}
                    {/*                     /> */}
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