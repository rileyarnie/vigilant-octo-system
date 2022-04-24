/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import validator from 'validator';
import Select from 'react-select';
import { customSelectTheme } from '../lib/SelectThemes';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
const alerts: Alerts = new ToastifyAlerts();
interface Props extends React.HTMLAttributes<Element> {
    setModal: (boolean) => void;
    setLinearDisplay: (string) => void;
    linearDisplay: string;
    fetchVenues: () => void;
}
class CreateVenue extends Component<Props> {
    constructor(props: any) {
        super(props);
    }
    state = {
        name: '',
        description: '',
        capacity: '',
        campusId: '',
        campuses: [],
        confirmModal:false
    };
    options = [] as any;
    componentDidMount() {
        timetablingAxiosInstance
            .get('/campuses')
            .then((res) => {
                const campuses = res.data;
                this.setState({ campuses: campuses });
                this.state.campuses.map((campus) => {
                    return this.options.push({ value: campus.id, label: campus.name });
                });
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSelectChange = (selectedOption) => {
        this.setState({
            campusId: selectedOption.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const venue = {
            name: this.state.name,
            description: this.state.description,
            capacity: this.state.capacity,
            campusId: this.state.campusId
        };
        this.props.setLinearDisplay('block');
        timetablingAxiosInstance
            .post('/venues', { Venue: venue })
            .then(() => {
                alerts.showSuccess('Venue Created Successfully');
                this.props.fetchVenues();
                this.props.setModal(false);
                this.props.setLinearDisplay('none');
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            });
    };
    handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };
    toggleConfirmModal = () => {
        this.setState({confirmModal:true});
    };
    toggleCloseConfirmModal = () => {
        this.setState({confirmModal:false});
    };
    render(): JSX.Element {
        return (
            <>
                <Row className="align-items-center page-header"/>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm  onErrorSubmit={this.handleErrorSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="name">
                                                    <b>Name of Venue</b>
                                                </label>
                                                <TextInput
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter name"
                                                    required
                                                    onChange={this.handleChange}
                                                />
                                                <br />
                                                <label htmlFor="description">
                                                    <b>Description</b>
                                                </label>
                                                <br />
                                                <TextInput
                                                    name="description"
                                                    id="description"
                                                    type="textarea"
                                                    required
                                                    placeholder="Enter description"
                                                    onChange={this.handleChange}
                                                />
                                                <br />
                                                <br />
                                                <label htmlFor="description">
                                                    <b>Capacity</b>
                                                </label>
                                                <TextInput
                                                    name="capacity"
                                                    id="capacity"
                                                    type="text"
                                                    required
                                                    placeholder="Enter capacity"
                                                    onChange={this.handleChange}
                                                    validator={validator.isNumeric}
                                                    errorMessage={{ validator: 'Please enter a valid number' }}
                                                />
                                                <br />
                                                <label htmlFor="name">
                                                    <b>Campus</b>
                                                </label>
                                                <Select
                                                    theme={customSelectTheme}
                                                    options={this.options}
                                                    isMulti={false}
                                                    placeholder="Select campus"
                                                    noOptionsMessage={() => 'No available campus'}
                                                    onChange={this.handleSelectChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;
                                            </div>
                                        </ValidationForm>
                                        <Col>
                                            <button className="btn btn-info float-right" onClick={this.toggleConfirmModal}>Submit</button>
                                            <button className="btn btn-danger float-left" onClick={() => this.props.setModal(false)}>
                                                Cancel
                                            </button>
                                        </Col>

                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    show={this.state.confirmModal}
                    onHide={this.toggleConfirmModal}
                    size="sm"
                    backdrop="static"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>{' '}</Modal.Header>
                    <Modal.Body>
                        <h6 className="text-center">A you sure you want to create a venue ?</h6>
                    </Modal.Body>
                    <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button variant="btn btn-danger btn-rounded" onClick={this.toggleCloseConfirmModal}>
                            Continue editing
                        </Button>
                        <button className="btn btn-info float-right" onClick={this.handleSubmit}>
                            Confirm
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default CreateVenue;
