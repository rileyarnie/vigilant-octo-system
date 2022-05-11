/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import Select from 'react-select';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { customSelectTheme } from '../lib/SelectThemes';
import LinearProgress from '@mui/material/LinearProgress';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();
const selectOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
];

interface Props extends React.HTMLAttributes<Element> {
    setModal: any;
    setLinearDisplay: any;
    fetchCourses: any;
    linearDisplay: any;
}

class CourseCreation extends Component<Props> {
    options = [] as any;
    departmentOptions = [];
    coursesArr = [];
    selectionOptions = [];
    state = {
        name: '',
        prerequisiteCourses: [],
        description: '',
        trainingHours: 0,
        isTimetablable: '',
        isElective: '',
        needsTechnicalAssistant: '',
        courses: [],
        selectedCourses: [],
        courseOutline: '',
        editorState: EditorState.createEmpty(),
        departments: [],
        departmentId: 0,
        confirmModal: false,
        disabled: false
    };

    componentDidMount() {
        this.fetchCoursesAndInitSelect();
        timetablingAxiosInstance
            .get('/departments')
            .then((res) => {
                this.setState({
                    departments: res.data
                });
                this.state.departments.map((dpt) => {
                    return this.departmentOptions.push({ value: dpt.id, label: dpt.name });
                });
                selectOptions.map((sel) => {
                    return this.selectionOptions.push({ value: sel.value, label: sel.label });
                });
            })
            .catch((err) => {
                alerts.showError(err.message);
            });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleDepartment = (departmentId) => {
        this.setState({ departmentId: departmentId.value });
    };
    handleTechnician = (technician) => {
        this.setState({ needsTechnicalAssistant: technician.value });
    };
    handleElective = (elective) => {
        this.setState({ isElective: elective.value });
    };
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const course = {
            name: this.state.name,
            prerequisiteCourses: this.coursesArr,
            description: this.state.description,
            trainingHours: this.state.trainingHours,
            isTimetableable: this.state.isTimetablable,
            needsTechnicalAssistant: this.state.needsTechnicalAssistant,
            departmentId: this.state.departmentId,
            courseOutline: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        };
        this.props.setLinearDisplay('block');
        this.setState({ disabled: true });
        timetablingAxiosInstance
            .post('/courses', course)
            .then((res) => {
                //handle success
                console.log(res);
                console.log('Course', course);
                this.props.setModal(false);
                alerts.showSuccess('Course created succesfully');
                this.setState({
                    name: '',
                    prerequisiteCourses: '',
                    description: '',
                    trainingHours: '',
                    isTimetableable: '',
                    needsTechnicalAssistant: '',
                    isElective: '',
                    departmentId: '',
                    courseOutline: '',
                    disabled: false
                });
                this.props.fetchCourses();
                this.setState({ confirmModal: false });
            })
            .catch((error) => {
                //handle error using logging library
                this.setState({ confirmModal: false, disabled: false });
                console.error(error);
                alerts.showError(error.message);
            });
    };

    handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };
    selectStyle = {
        width: '100%',
        height: '30px'
    };
    fetchCoursesAndInitSelect = () => {
        timetablingAxiosInstance
            .get('/courses')
            .then((res) => {
                this.setState({
                    courses: res.data
                });
                this.state.courses.map((course) => {
                    return this.options.push({ value: course.id, label: course.name });
                });
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    handleSelectChange = (selectedOptions) => {
        selectedOptions?.map((el) => {
            this.coursesArr.push(el.value);
        });
    };
    toggleConfirmModal = () => {
        this.setState({ confirmModal: true });
    };
    toggleCloseConfirmModal = () => {
        this.setState({ confirmModal: false });
    };

    render(): JSX.Element {
        return (
            <>
                <Row className="align-items-center page-header" />
                <LinearProgress style={{ display: this.props.linearDisplay }} />
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm onSubmit={(e) => { e.preventDefault();this.toggleConfirmModal();}}>
                                            <div className="form-group">
                                                <label htmlFor="name">
                                                    <b>Name of course<span className="text-danger">*</span></b>
                                                </label>
                                                <TextInput
                                                    name="name"
                                                    required
                                                    value={this.state.name}
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter name"
                                                    onChange={this.handleChange}
                                                />
                                                <br />
                                                <label htmlFor="name">
                                                    <b>Course pre-requisites</b>
                                                </label>
                                                <Select
                                                    theme={customSelectTheme}
                                                    options={this.options}
                                                    isMulti={true}
                                                    placeholder="Select Prerequisites for this course"
                                                    noOptionsMessage={() => 'No available courses'}
                                                    onChange={this.handleSelectChange}
                                                />
                                                <p />
                                                <label htmlFor="description">
                                                    <b>Description<span className="text-danger">*</span></b>
                                                </label>
                                                <TextInput
                                                    name="description"
                                                    multiline
                                                    rows="3"
                                                    required
                                                    id="desc"
                                                    type="text"
                                                    value={this.state.description}
                                                    placeholder="enter description"
                                                    onChange={this.handleChange}
                                                />
                                                <br />
                                                <label htmlFor="department">
                                                    <b>Department<span className="text-danger">*</span></b>
                                                </label>
                                                <br />
                                                <Select
                                                    theme={customSelectTheme}
                                                    defaultValue=""
                                                    options={this.departmentOptions}
                                                    isMulti={false}
                                                    isClearable
                                                    placeholder="Select a department."
                                                    noOptionsMessage={() => 'No department available'}
                                                    onChange={this.handleDepartment}
                                                />
                                                <br />
                                                <label htmlFor="trainingHours">
                                                    <b>Training Hours<span className="text-danger">*</span></b>
                                                </label>
                                                <TextInput
                                                    name="trainingHours"
                                                    id="hours"
                                                    type="text"
                                                    value={this.state.trainingHours}
                                                    placeholder="number of hours"
                                                    required
                                                    onChange={this.handleChange}
                                                />
                                                <br />
                                                <label htmlFor="courseOutline">
                                                    <b>Course outline<span className="text-danger">*</span></b>
                                                </label>
                                                <Editor
                                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                                    editorState={this.state.editorState}
                                                    wrapperClassName="demo-wrapper"
                                                    editorClassName="demo-editor"
                                                    onEditorStateChange={this.onEditorStateChange}
                                                />
                                                <label htmlFor="timetablelable">
                                                    <b>Timetablable?<span className="text-danger">*</span></b>
                                                </label>
                                                <br />
                                                <br />
                                                <SelectGroup name="isTimetablable" id="timetableable" required onChange={this.handleChange}>
                                                    <option value="">--- Please select ---</option>
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </SelectGroup>
                                                <br />
                                                <label htmlFor="needsTechnicalAssistant">
                                                    <b>Needs Technical Assistant?<span className="text-danger">*</span></b>
                                                </label>
                                                <br />
                                                <Select
                                                    theme={customSelectTheme}
                                                    defaultValue=""
                                                    options={this.selectionOptions}
                                                    isMulti={false}
                                                    isClearable
                                                    placeholder="Please select"
                                                    noOptionsMessage={() => 'No option available'}
                                                    onChange={this.handleTechnician}
                                                />
                                                <br />
                                                <label htmlFor="isElective">
                                                    <b>Is Elective?<span className="text-danger">*</span></b>
                                                </label>
                                                <br />
                                                <Select
                                                    theme={customSelectTheme}
                                                    defaultValue=""
                                                    options={this.selectionOptions}
                                                    isMulti={false}
                                                    isClearable
                                                    placeholder="Please select"
                                                    noOptionsMessage={() => 'No option available'}
                                                    onChange={this.handleElective}
                                                />
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-info float-right">Submit</button>
                                                <button
                                                    disabled={this.state.disabled}
                                                    className="btn btn-danger float-left"
                                                    onClick={(e) =>{e.preventDefault(); this.props.setModal(false);}}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </ValidationForm>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <ConfirmationModalWrapper disabled={this.state.disabled}
                    submitButton
                    submitFunction={this.handleSubmit}
                    closeModal={this.toggleCloseConfirmModal}
                    show={this.state.confirmModal}
                >
                    <h6 className="text-center">Are you sure you want to create a course ?</h6>
                </ConfirmationModalWrapper>
            </>
        );
    }
}

export default CourseCreation;
