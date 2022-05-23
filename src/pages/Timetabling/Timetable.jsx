import React from 'react';
import Scheduler, { AppointmentDragging, Resource } from 'devextreme-react/scheduler';
import Draggable from 'devextreme-react/draggable';
import 'devextreme/dist/css/dx.light.css';
import ScrollView from 'devextreme-react/scroll-view';
import './timetable.css';
import SelectBox from 'devextreme-react/select-box';
import CourseCohortService from '../../services/CourseCohortsService';
import { TrainerService } from '../../services/TrainerService';
import { TimetableService } from '../../services/TimetableService';
import { VenueService } from '../../services/VenueService';
import { Button, Col, Row } from 'react-bootstrap';
import { ToastifyAlerts } from '../lib/Alert';
import AppointmentTooltip from './AppointmentTooltip';
import { SemesterService } from '../../services/SemesterService';
import { LinearProgress } from '@mui/material';
import moment from 'moment';

const alerts = new ToastifyAlerts();
const currentDate = new Date();
const draggingGroupName = 'appointmentsGroup';
const venueData = VenueService.fetchVenues().then((res) => {
    return res['data'].map((venue) => {
        return { id: venue.venue_id, text: venue.venue_name };
    });
})
    .catch((error) => {
        console.error(error);
    });
const trainerData = TrainerService.fetchTrainers().then((res) => {
    return res['data'].map((t) => {
        return { id: t.tr_id, text: t.stf_name };
    });
})
    .catch((error) => {
        console.error(error);
    });
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
];

class Timetable extends React.Component {
    courseCohortData = []
    constructor(props) {
        super(props);
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
            timetableData:[],
            timetableDataWithErrors: [],
            itemsWithColor: [],
            priorityId: 2,
            disablePublishButton: false,
            unitDuration: 60,
            linearDisplay: 'none'
        };
        this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
        this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
        this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
        this.timeTabledUnitsWithErrors = this.timeTabledUnitsWithErrors.bind(this);
    }
    // selectedTimetablingUnit = {}
    componentDidMount() {
        this.fetchCourseCohorts('course, timetablingUnits, semester', this.state.semesterId);
        this.fetchSemesters();
        this.sumNumSession();
        this.fetchTimetableUnitErrors(this.state.semesterId);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.timeTabledUnitErrors !== this.state.timeTabledUnitErrors || prevState.timetableData !== this.state.timetableData) {
            this.timeTabledUnitsWithErrors(this.state.timetableData, this.state.timeTabledUnitErrors);
        }
    }

    /** Check if timetable has errors */
    checkTimeTableErrors() {
        // find if timetable has errors and disable publish button
        const conflictFound = this.state.timeTabledUnitErrors.find(error => error?.errors?.length > 0);

        this.setState({ disablePublishButton: conflictFound ? true : false });
    }

    fetchTimetableUnitErrors = (semesterId) => {
        TimetableService.getTimetableUnitErrors(semesterId)
            .then((res) => {
                const errors = res.data;
                this.setState({ timeTabledUnitErrors: errors });
                this.checkTimeTableErrors(); // check timetable for errors/conflicts
            });
    }
    fetchCourseCohorts = (loadExtras, semesterId) => {
        this.setState({ linearDisplay: 'block' });
        CourseCohortService.fetchCourseCohorts(loadExtras, semesterId)
            .then((res) => {
                const courseCohorts = res.data;
                const courseCohortData = courseCohorts.filter(ch => ch.programCohortSemester.status.toUpperCase() === 'PUBLISHED').map((cc) => {
                    return {
                        text: cc.course.name,
                        id: cc.id,
                        trainerId: cc.trainerId,
                        programCohortId: cc.programCohortId,
                        timetablingUnits: cc.timetablingUnit,
                        trainingHours: cc.course.trainingHours
                    };
                });
                this.setState({ courseCohort: courseCohortData });
                let datasourceTu = [];
                for (const courseCohort of courseCohorts) {
                    const semEndDate = courseCohort.programCohortSemester.semester.endDate;
                    const semEndFormat = moment(semEndDate.split('T')[0]).format('YYYYMMDD') + 'T000000Z';
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
                            recurrenceRule: `FREQ=WEEKLY;BYDAY=${moment(tu.recurrenceStartDate).format('dd').toUpperCase()};UNTIL=${semEndFormat}`
                        });
                        this.setState({ timetableData: datasourceTu });
                        // check if training hours has been met
                        this.checkTrainingHoursHasBeenMet(courseCohort, courseCohorts.indexOf(courseCohort));
                    });
                }
            })
            .catch((error) => {
                alerts.showError(error.message);
            }).finally(() => {
                this.setState({ linearDisplay: 'none' });
            });
    }

    /**
     * handle timetable updates, re-fetch data from the database
     */
    onTimeTableUpdate() {
        this.fetchCourseCohorts('course, timetablingUnits, semester', this.state.semesterId);
        this.setState({ linearDisplay: 'none' });
        this.checkTimeTableErrors(); // check timetable for errors/conflicts
    }

    timeTabledUnitsWithErrors(timeTabledUnits, timeTabledUnitErrors) {
        const items = timeTabledUnits?.map(unit => ({
            ...timeTabledUnitErrors?.find((error) => (error.timetablingUnitId === unit.timetablingUnitId) && error), priorityId: 2
            , ...unit
        }));
        const itemsWithColor = [];
        // const itemsWithColor=items.map(item=>item.errors.length>0?({...item,item.color:"#ff0000"}):({{...item,item.color:"#000ff0"}})}
        for (let i = 0; i < items.length; i++) {
            if (items[i].errors?.length > 0) {
                itemsWithColor.push({ ...items[i], color: '#ff97471' });
            }
            else {
                itemsWithColor.push({ ...items[i], priorityId: 2 });
            }
        }
        return this.setState({ timetableDataWithErrors: items, itemsWithColor: itemsWithColor });
    }

    fetchSemesters = () => {
        SemesterService.fetchSemesters()
            .then((res) => {
                const semData = res['data'];
                this.setState({ semesters: semData });
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    }
    sumNumSession = () => {
        return this.state.courseCohort.map(t => {
            t.totalNumSessions = 0;
            t.timetablingUnit.forEach(tu => {
                t.totalNumSessions += tu.numSessions;
            });
        });
    }

    onAppointmentRemove(e) {
        const index = this.state.timetableDataWithErrors.indexOf(e.itemData);
        if (index >= 0) {
            this.state.timetableDataWithErrors.splice(index, 1);
            this.state.courseCohort.push(e.itemData);
            this.checkTimeTableErrors(); // check timetable for errors/conflicts
            this.setState({
                courseCohort: [...this.state.courseCohort],
                timetableDataWithErrors: [...this.state.timetableDataWithErrors]
            });
        }
    }

    /** Function check is a course has exceeded training hours and remove it from the que */
    checkTrainingHoursHasBeenMet(courseCohort, index) {
        // get expected hours for the course
        const expectedTrainingHours = courseCohort.course.trainingHours;

        // get the total duration for all the units for the course-cohort
        const totalUnitSessionDuration = courseCohort.timetablingUnit.map(unit => unit.durationInMinutes * unit.numSessions).reduce((a, b) => a + b, 0);
        const totalDurationInHours = (totalUnitSessionDuration / 60);

        // check if all hours have been exhausted on the timetable
        const removeCoursesFromList = expectedTrainingHours === totalDurationInHours || totalDurationInHours > expectedTrainingHours;
        if (!removeCoursesFromList) { console.log('Don\'t remove courses from the side, add more units'); }

        // remove the course from the side list only if all hours have been met
        if (removeCoursesFromList) {
            console.log(`All units meet the expected hours: ${totalDurationInHours} for the current cohort`);
            this.state.courseCohort.splice(index, 1);
        }

        this.setState({
            timetableUnits: [...this.state.courseCohort]
        });
    }

    /** add unit to the timetable and save the status to the database  */
    onAppointmentAdd(e) {
        this.setState({ linearDisplay: 'block' });
        // const index = this.state.courseCohort.indexOf(e.fromData)
        const timetableData = e['itemData'];
        const min = Math.min(timetableData.trainingHours, this.state.maxNumUnitRepetition);
        const timetableUnit = {
            courseCohortId: timetableData.id,
            recurrenceStartDate: new Date(timetableData.startDate),
            recurrenceEndDate: new Date(timetableData.endDate),
            startTime: timetableData.startDate.toTimeString().slice(0, 8),
            numSessions: min || 1,
            durationInMinutes: 60,
            colorId: this.state.colorId,
            venueId: null
        };


        // save timetableUnit to the database
        TimetableService.createTimetableUnit(timetableUnit).then(() => {
            alerts.showSuccess('TimetableUnit added successfully');
        }).catch((error) => {
            alerts.showError(error.message);
        }).finally(() => {
            this.onTimeTableUpdate(); // call function to refetch the data from db
        });

        // update the values 
        this.state.timetableDataWithErrors.push(e.itemData);
        this.setState({
            timetableUnits: [...this.state.courseCohort],
            timetableDataWithErrors: [...this.state.timetableDataWithErrors]
        });
    }

    /**
     * get the max value for number of sessions
     * @returns {object} maximum number of sessions
     */
    getMaxValueForNumberOfSession() {
        // get semester
        const semester = this.state.semesters.find(sem => sem.id === this.state.semesterId);

        // Max number of sessions = sem end date - start date (in weeks)
        const semStarts = moment(semester.startDate);
        const semEnds = moment(semester.endDate);
        return { semEnds: semEnds, diff: semEnds.diff(semStarts, 'weeks') };
    }

    /**
     * Handle on timetable unit open
     * @param {event} e data from the form
     */
    async onAppointmentFormOpening(e) {
        const max = await this.getMaxValueForNumberOfSession().diff; // get max value form semester date difference
        const { form } = e;
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
                    valueExpr: 'id'
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
                    valueExpr: 'id'
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
                        this.setState({ startTime: args.value });
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
                        this.setState({ endTime: args.value });
                    }
                }
            },
            {
                label: {
                    text: 'Start Date'
                },
                dataField: 'unitStartDate',
                editorType: 'dxDateBox',
                itemTemplate: 'TestTextInput',
                editorOptions: {
                    width: '100%',
                    type: 'date'
                }
            },
            {
                label: {
                    text: 'End Date'
                },
                dataField: 'unitEndDate',
                editorType: 'dxDateBox',
                itemTemplate: 'TestTextInput',
                editorOptions: {
                    width: '100%',
                    type: 'date',
                    disabled: true
                }
            },
            {
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
                        this.setState({ numSessions: args.value });
                    }
                }
            },

            {
                label: {
                    text: 'Duration in hours'
                },
                dataField: 'unitDuration',
                editorType: 'dxNumberBox',
                editorOptions: {
                    width: '100%',
                    min: 0,
                    max: max,
                    format: '',
                    showSpinButtons: true,
                    type: 'number',
                    onChange(args) {
                        this.setState({ unitDuration: args.value });
                    }
                }
            }


        ]);
    }
    handleEdit(e) {
        this.setState({ linearDisplay: 'block' });
        const updatedTimetablingUnit = {
            timetablingUnitId: e.appointmentData.timetablingUnitId,
            venueId: e.appointmentData.venueId,
            recurrenceStartDate: e.appointmentData.startDate,
            recurrenceEndDate: e.appointmentData.endDate,
            durationInMinutes: e.appointmentData.unitDuration * 60,
            startTime: e.appointmentData.startTime,
            numSessions: e.appointmentData.numSessions,
            trainerId: e.appointmentData.trainerId,
            unitStartDate: e.appointmentData.unitStartDate,
            unitEndDate: new Date(unitEndDate)
        };

        const { ccId, pcId } = this.getCourseCohortProgramCohortId(this.state.courseCohort, updatedTimetablingUnit.timetablingUnitId);
        if (updatedTimetablingUnit.timetablingUnitId) {
            CourseCohortService.updateCourseCohort(ccId, { trainerId: updatedTimetablingUnit.trainerId, programCohortId: pcId });
        }
        TimetableService.updateTimetableUnit(updatedTimetablingUnit)
            .then(() => {
                alerts.showSuccess('Timetable updated successfully');
                this.checkTimeTableErrors(); // check timetable for errors/conflicts
            })
            .catch(() => {
                alerts.showError('Could not update Timetabling Unit');
            }).finally(() => {
                this.onTimeTableUpdate(); // call function to refetch the data from db
                this.setState({ linearDisplay: 'none' });
            });
    }
    handleDeletion(e) {
        this.setState({ linearDisplay: 'block' });
        const timetabledUnitId = e.appointmentData.timetablingUnitId;
        TimetableService.deleteTimetableUnit(timetabledUnitId)
            .then(() => {
                alerts.showSuccess('Successfully deleted a timetabling Unit');
                this.onTimeTableUpdate(); // call function to refetch the data from db
            })
            .catch(() => {
                alerts.showError('Could not delete timetabling Unit');
            }).finally(() => {
            this.setState({ linearDisplay: 'none' });
        });
    }

    onListDragStart(e) {
        e.cancel = true;
    }
    onItemDragStart(e) {
        e.itemData = e.fromData;
    }
    onItemDragEnd(e) {
        if (e.toData) {
            e.cancel = true;
        }
    }
    async publishTimetable() {
        this.setState({ linearDisplay: 'block' });
        await SemesterService.publishTimetable(this.state.semesterId)
            .then(() => {
                alerts.showSuccess('Timetable published successfully');
            })
            .catch((error) => {
                alerts.showError(error.message);
            }).finally(() => {
                this.setState({ linearDisplay: 'none' });
            });
    }
    getTimetablingUnitId(courseCohorts, courseCohortId) {
        const cc = courseCohorts.filter(courseCohort => courseCohort.id === courseCohortId);

        return cc.timetablingUnit.id;
    }
    getCourseCohortProgramCohortId(courseCohorts, timetablingUnitId) {
        const cc = courseCohorts.filter(it => it.timetablingUnits.map(tu => tu.id).includes(timetablingUnitId))[0];
        return {
            ccId: cc.id,
            pcId: cc.programCohortId
        };
    }
    alertTx(e) {
        alert(JSON.stringify(e.appointmentData));
    }
    render() {
        return (
            <>
                <Row>
                    <Col><LinearProgress style={{ display: this.state.linearDisplay }} /></Col>
                </Row>
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
                            onValueChanged={(e) => {
                                // TODO: update currentDate
                                this.setState({ semesterId: e.value })
                                this.fetchCourseCohorts('course, timetablingUnits, semester', this.state.semesterId);
                                this.fetchTimetableUnitErrors(this.state.semesterId);
                                this.timeTabledUnitsWithErrors(this.state.timetableData, this.state.timeTabledUnitErrors);
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
                        cellDuration={this.state.unitDuration}
                        defaultCurrentDate={currentDate}
                        height={600}
                        startDayHour={8}
                        endDayHour={17}
                        editing={true}
                        appointmentTooltipComponent={AppointmentTooltip}
                        onAppointmentFormOpening={this.onAppointmentFormOpening}
                        onAppointmentUpdated={e => { this.handleEdit(e)}}
                        onAppointmentDeleted={e => { this.handleDeletion(e)}}
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
                            onAdd={this.onAppointmentAdd}
                        />
                    </Scheduler>
                </React.Fragment>
            </>
        );
    }
}
export default Timetable;