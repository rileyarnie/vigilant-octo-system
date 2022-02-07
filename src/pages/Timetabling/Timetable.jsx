import React from 'react'
import Scheduler, {AppointmentDragging} from 'devextreme-react/scheduler'
import Draggable from 'devextreme-react/draggable'
import 'devextreme/dist/css/dx.light.css'
import ScrollView from 'devextreme-react/scroll-view'
import './timetable.css'
import FormControl from '@mui/material/FormControl'
import { MenuItem, Select } from '@material-ui/core'
import CourseCohortService from '../../services/CourseCohortsService'
import { TrainerService } from '../../services/TrainerService'
import { TimetableService } from '../../services/TimetableService'
import { VenueService } from '../../services/VenueService'
import moment from 'moment'

//import Trainer from '../pages/services/Trainer'
//import TimetableUnit from '../pages/services/TimetableUnit'
//import Semester from '../pages/services/Semester'
//import CourseCohort from '../pages/services/CourseCohort'
import { ToastifyAlerts } from '../lib/Alert'
import { SemesterService } from '../../services/SemesterService'
const alerts = new ToastifyAlerts()
const currentDate = new Date()
const draggingGroupName = 'appointmentsGroup'
// const semesters: [] = []
// const trainers: Trainer[] = []
// const timetableData: TimetableUnit[] = []
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
            dayOfWeek: ''
        }
        this.onAppointmentRemove = this.onAppointmentRemove.bind(this)
        this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
        this.onAppointmentAdd = this.onAppointmentAdd.bind(this)
        //this.onVenueChanged = this.onVenueChanged.bind(this);
        //this.handleEdit()
    }

    componentDidMount() {
        this.fetchCourseCohorts('course, timetablingUnits, semesters',this.state.semesterId)
        this.fetchSemesters()
        //this.fetchTimetableData(this.state.semesterId)
        this.sumNumSession()
    }
    fetchCourseCohorts = ( loadExtras:string[], semesterId:number) => {
        CourseCohortService.fetchCourseCohorts(loadExtras, semesterId)
            .then((res) => {
                const myData = res['data']
                const courseCohortData = myData.map((cc) => {
                    return {
                        text: cc.course.name,
                        id: cc.id,
                        trainerId: cc.trainerId,
                        trainingHours: cc.course.trainingHours
                    }
                })
                this.setState({courseCohort:courseCohortData});
                const dataSource = myData.map((t) => (
                  t.timetablingUnit.map((tt) => {
                   return {
                      text: t.course.name,
                      timetablingUnitId: tt.id,
                      courseCohortId: tt.courseCohortId,
                      dayOfWeek: tt.dayOfWeek,
                      numSessions: tt.numSessions,
                      venueId: 45,
                      trainerId: 46,
                      startDate: new Date(moment(new Date().toISOString().slice(0, 10)+' '+tt.startTime).toISOString()),
                      endDate: new Date(moment(new Date().toISOString().slice(0, 10)+' '+tt.endTime).toISOString())
                   }
                   })
                ))
                this.setState({timetableData:dataSource})
                console.log(dataSource)
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
        const timetableUnit = {
            courseCohortId: timetableData.id,
            dayOfWeek: timetableData.startDate.toLocaleDateString('en-us',{weekday:'short'}).toLowerCase(),
            startTime: timetableData.startDate.toTimeString().slice(0,8),
            endTime: timetableData.endDate.toTimeString().slice(0,8),
            numSessions: Math.min(timetableData.trainingHours, this.state.maxNumUnitRepetition)
        }
        console.log(timetableData)
        console.log(timetableUnit)
        //this.validSessionUpdate(timetableData.trainingHours,this.state.maxNumUnitRepetition,7 );
        //this.sumNumSession();
//         TimetableService.createTimetableUnit(timetableUnit)
//             .then(() => {
//                 alerts.showSuccess('TimetableUnit added successfully')
//             })
//             .catch((error) => {
//                 //handle error using logging library
//                 console.error(error)
//                 alerts.showError(error.response.data)
//             })
        if (index >= 0) {
            this.state.courseCohort.splice(index, 1)
            this.state.timetableData.push(e.itemData)

            this.setState({
                timetableUnits: [...this.state.courseCohort],
                timetableData: [...this.state.timetableData]
            })
            console.log(this.state.timetableData)
        }
    }
    async onAppointmentFormOpening(e) {
        //this.sumNumSession();
        const max = Math.max(20,40)

        // Th 20 nof 24 ==== 20/24
        const { form } = e
        const t = e['appointmentData']
        let  venueId  = e.appointmentData;
        let  trainerId = 0;
        let timetablingUnitId = t.timetablingUnitId;
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
                        this.setState({ venueId: e.target.value });
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
            }
        ])
        const timetableUnitData = {
                    timetablingUnitId: t.timetablingUnitId,
                    courseCohortId: t.courseCohortId,
                    venueId: this.state.venueId,
                    dayOfWeek: this.state.dayOfWeek,
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    numSessions: this.state.numSessions,
                    trainerId: this.state.trainerId
                }
                console.log(timetableUnitData)
    }
//     handleEdit = () => {
//         TimetableService.updateTimetableUnit(timetableUnitData)
//             .then(res => {
//                 console.log(res)
//                 alerts.showSuccess('Timetable updated successfully')
//             })
//             .catch((error) => {
//                 console.error(error)
//                 alerts.showError(error.response.data)
//             })
//     }

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

    render() {
        return (
            <React.Fragment>
                <ScrollView id="scroll">
                    <Draggable
                        id="list"
                        data="dropArea"
                        group={draggingGroupName}
                        onDragStart={this.onListDragStart}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Semester"

                                //onChange={handleChange}
                            >
                                {this.state.semesters.map((sem, index) =>
                                    <li key={index}
                                        onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({semesterId: sem.id})
                                        this.setState({startDate: sem.startDate.slice(0,10)})
                                        this.setState({endDate: sem.endDate.slice(0,10)})
                                        const startDate = moment(this.state.startDate)
                                        const endDate = moment(this.state.endDate)
                                        const weeks = Math.floor(moment.duration(endDate.diff(startDate)).asWeeks())
                                        console.log(weeks)
                                        console.log(startDate)
                                        console.log(endDate)
                                        this.setState({maxNumUnitRepetition: weeks})
                                        //this.fetchTimetableData(this.state.semesterId)
                                        this.fetchCourseCohorts('course, timetablingUnits, semesters',this.state.semesterId)
                                        }}>
                                        <MenuItem key={sem.id} value={sem.id}>{sem.name}</MenuItem><br/>
                                    </li>
                                )}
                            </Select>
                        </FormControl>
                        {this.state.courseCohort.map((courseCohort) =>
                            <Draggable
                                key={courseCohort.id}
                                className="item dx-card dx-theme-text-color dx-theme-background-color"
                                clone={true}
                                group={draggingGroupName}
                                data={courseCohort}
                                onDragStart={this.onItemDragStart}
                                onDragEnd={this.onItemDragEnd}>
                                {courseCohort.text}<br/>{<>0/32</>}<br/>{<>Trainer: {courseCohort.trainerId}</>}<br/>
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
                    //onAppointmentUpdated={this.handleEdit}
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