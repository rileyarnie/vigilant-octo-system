/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card} from 'react-bootstrap'
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation'
import Config from '../../config'
import Select from 'react-select'
import { Alerts, ToastifyAlerts } from '../lib/Alert'
import { customSelectTheme } from '../lib/SelectThemes'
import LinearProgress from '@mui/material/LinearProgress'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState } from 'draft-js'
const alerts: Alerts = new ToastifyAlerts()
interface Props extends React.HTMLAttributes<Element> {
    setModal:any,
    setLinearDisplay:any
    fetchCourses:any
    linearDisplay: any
}
const timetablingSrv = Config.baseUrl.timetablingSrv
class CourseCreation extends Component <Props> {
    options = [] as any;
    coursesArr=[];
    state = {
        name: '',
        prerequisiteCourses: [],
        description: '',
        trainingHours: 0,
        isTimetablable: '',
        isElective: '',
        needsTechnicalAssistant: '',
        courses:[],
        selectedCourses:[],
        courseOutline: '',
        editorState: EditorState.createEmpty()
    };

    componentDidMount(){
        this.fetchCoursesAndInitSelect()
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const course = {
            name: this.state.name,
            prerequisiteCourses: this.coursesArr,
            description: this.state.description,
            trainingHours: this.state.trainingHours,
            isTimetableable: this.state.isTimetablable,
            needsTechnicalAssistant: this.state.needsTechnicalAssistant,
            courseOutline: this.state.courseOutline
        }
        this.props.setLinearDisplay('block')
        axios.post(`${timetablingSrv}/courses`, course)
            .then(res => {
                //handle success
                console.log(res)
                this.props.setModal(false)
                alerts.showSuccess('Course created succesfully')
                this.setState({
                    name: '',
                    prerequisiteCourses: '',
                    description: '',
                    trainingHours: '',
                    isTimetableable: '',
                    needsTechnicalAssistant: '',
                    isElective: '',
                    courseOutline: ''
                })
                this.props.fetchCourses()
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error)
                alerts.showError(error.message)
            })
    };

    handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs)
    };
    selectStyle = {
        width:'100%',
        height: '30px'
    };
    fetchCoursesAndInitSelect = () => {
        axios
            .get(`${timetablingSrv}/courses`)
            .then((res) => {
                this.setState({
                    courses: res.data})
                this.state.courses.map((course)=>{
                    return this.options.push({value:course.id, label:course.name})
                })

            })
            .catch((error) => {
                console.error(error)
                alerts.showError(error.message)
            })
    };
    handleSelectChange = (selectedOptions) => {
        selectedOptions?.map((el)=>{
            this.coursesArr.push(el.value)
        })
    };

    render(): JSX.Element {
        return (
            <>
                <Row className="align-items-center page-header">
                </Row>
                <LinearProgress  style={{display: this.props.linearDisplay}} />
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}>
                                            <div className='form-group'>
                                                <label htmlFor='name'><b>Name of course</b></label>
                                                <TextInput name='name' required value={this.state.name} id='name' type='text' placeholder="Enter name"  onChange={this.handleChange} /><br />
                                                <label htmlFor='name'><b>Course pre-requisites</b></label>
                                                <Select
                                                    theme={customSelectTheme}
                                                    options={this.options}
                                                    isMulti={true}
                                                    placeholder="Select Prerequisites for this course"
                                                    noOptionsMessage={() => 'No available courses'}
                                                    onChange={this.handleSelectChange}
                                                />
                                                <p></p>
                                                <label htmlFor='description'><b>Description</b></label>
                                                <TextInput name='description' multiline rows="3" required id='desc' type='text' value={this.state.description} placeholder="enter description" onChange={this.handleChange} /><br />
                                                <label htmlFor='trainingHours'><b>Training Hours</b></label>
                                                <TextInput name='trainingHours' id='hours' type='text' value={this.state.trainingHours} placeholder="number of hours" required onChange={this.handleChange} /><br />
                                                <label htmlFor='courseOutline'><b>Course outline</b></label>
                                                <Editor
                                                    toolbarOnFocus
                                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                                    editorState={this.state.editorState}
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    onEditorStateChange={this.onEditorStateChange}
                                                />;
                                                <label htmlFor='tiimetablelable'><b>Timetablable?</b></label><br />
                                                <SelectGroup name='timetabelable' id='timetableable' required onChange={this.handleChange}>
                                                    <option value="">--- Please select ---</option>
                                                    <option value="true" >True</option>
                                                    <option value="false" >False</option>
                                                </SelectGroup> <br />
                                                <label htmlFor='technicalAssistant'><b>Needs Technical Assistant?</b></label><br />
                                                <SelectGroup name='technicalAssistant' id='technicalAssistant' required onChange={this.handleChange}>
                                                    <option value="">--- Please select ---</option>
                                                    <option value="true" >True</option>
                                                    <option value="false" >False</option>
                                                </SelectGroup><br />
                                                <label htmlFor='isElective'><b>Is Elective?</b></label><br />
                                                <SelectGroup name='isElective' id='isElective' required onChange={this.handleChange}>
                                                    <option value="">--- Please select ---</option>
                                                    <option value="true" >True</option>
                                                    <option value="false" >False</option>
                                                </SelectGroup><br />
                                            </div>
                                            <div className='form-group'>
                                                <button className='btn btn-info float-right'>Submit</button>
                                            </div>
                                        </ValidationForm>
                                        <button className="btn btn-danger float-left" onClick={()=>this.props.setModal(false)}>Cancel</button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default CourseCreation