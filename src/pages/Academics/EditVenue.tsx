/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import Select from 'react-select';
import validator from 'validator';
import {customSelectTheme} from '../lib/SelectThemes';

const alerts: Alerts = new ToastifyAlerts();
const EditVenue = (props): JSX.Element => {
    const campusAssigned = [];
    const options = [];
    const [venueName, setVenueName] = useState('');
    const [campuses, setCampuses] = useState([]);
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [campusId, setCampusId] = useState(0);
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const venueChangeHandler = (event) => {
        console.log('venue handler ', event.target.value);
        setVenueName(event.target.value);
    };
    useEffect(() => {
        timetablingAxiosInstance
            .get('/campuses')
            .then((res) => {
                setCampuses(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);
    campuses.map((campus) => {
        return options.push({value: campus.id, label: campus.name});
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        const modifiedVenue = {
            name: venueName === '' ? props.selectedVenue.venue_name : venueName,
            description: description === '' ? props.selectedVenue.venue_description : description,
            capacity: capacity === 0 ? props.selectedVenue.venue_capacity : capacity,
            campusId: campusId === 0 ? props.selectedVenue.venue_campusId : campusId
        };
        props.setLinearDisplay('block');
        setDisabled(true);
        timetablingAxiosInstance
            .put(`/venues/${props.venue_id}`, {Venue: modifiedVenue})
            .then(() => {
                alerts.showSuccess('successfully updated Venue details');
                props.fetchVenues();
                props.setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            }).finally(() => {
                props.setEditModal(false);
                setDisabled(false);
                toggleCloseConfirmModal();
            });
    };
    const handleCampusChange = (campus) => {
        setCampusId(campus.value);
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    const assignedCampus: { cmpsId: number; cmpsName: string }[] = [
        {cmpsId: props.campus_id, cmpsName: props.campus_name}
    ];
    assignedCampus.map((camp) => {
        return campusAssigned.push({value: camp.cmpsId, label: camp.cmpsName});
    });
    return (
        <>
            <div>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm onSubmit={(e) => {
                                            e.preventDefault();
                                            toggleConfirmModal();
                                        }}>
                                            <div className="form-group">
                                                <label htmlFor="email">
                                                    <b>Enter new venue name<span
                                                        className="text-danger">*</span></b>
                                                </label>
                                                <TextInput
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    placeholder="Hall 6"
                                                    defaultValue={props.venue_name}
                                                    errorMessage={{validator: 'Please enter a valid name'}}
                                                    onChange={venueChangeHandler}
                                                />
                                                <br/>
                                                <label htmlFor="description">
                                                    <b>Description<span className="text-danger">*</span></b>
                                                </label>
                                                <br/>
                                                <TextInput
                                                    name="description"
                                                    id="description"
                                                    defaultValue={props.venue_description}
                                                    type="textarea"
                                                    required
                                                    multiline
                                                    rows="3"
                                                    placeholder="Enter description"
                                                    onChange={(e) => {
                                                        setDescription(e.target.value);
                                                    }}
                                                />
                                                <br/>
                                                <br/>
                                                <label htmlFor="description">
                                                    <b>Capacity<span className="text-danger">*</span></b>
                                                </label>
                                                <TextInput
                                                    name="capacity"
                                                    id="capacity"
                                                    type="text"
                                                    required
                                                    defaultValue={props.venue_capacity}
                                                    placeholder="Enter capacity"
                                                    validator={validator.isNumeric}
                                                    errorMessage={{validator: 'Please enter a valid number'}}
                                                    onChange={(e) => {
                                                        setCapacity(e.target.value);
                                                    }}
                                                />
                                                <br/>
                                                <label htmlFor="name">
                                                    <b>Campus<span className="text-danger">*</span></b>
                                                </label>
                                                <Select
                                                    theme={customSelectTheme}
                                                    defaultValue={{label: props.campus_name, value: props.campus_id}}
                                                    options={options}
                                                    isMulti={false}
                                                    placeholder="Select campus"
                                                    noOptionsMessage={() => 'No available campus'}
                                                    onChange={handleCampusChange}
                                                />
                                                    &nbsp;&nbsp;&nbsp;
                                            </div>
                                            <div className="form-group">
                                                <button disabled={disabled} className="btn btn-info float-right">
                                                        Submit
                                                </button>
                                                <button
                                                    disabled={disabled}
                                                    className="btn btn-danger float-left"
                                                    onClick={() => props.setEditModal(false)}
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
            </div>
            <ConfirmationModalWrapper disabled={disabled} submitButton submitFunction={handleSubmit}
                closeModal={toggleCloseConfirmModal} show={confirmModal}>
                <h6 className="text-center">Are you sure you want to update {props.venue_name} ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default EditVenue;
