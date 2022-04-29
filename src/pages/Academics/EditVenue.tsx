/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { regxAlphaNumericWithSpacesAndUnderscores } from '../lib/validation';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';

const alerts: Alerts = new ToastifyAlerts();
const EditVenue = (props): JSX.Element => {
    const [venueName, setVenueName] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const venueChangeHandler = (event) => {
        setVenueName(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const modifiedVenue = {
            name: venueName
        };
        props.setLinearDisplay('block');
        setDisabled(false);
        timetablingAxiosInstance
            .put(`/venues/${props.venue_id}`, { Venue: modifiedVenue })
            .then(() => {
                setDisabled(true);
                alerts.showSuccess('successfully updated Venue details');
                props.setEditModal(false);
                toggleCloseConfirmModal();
                props.fetchVenues();
                props.setLinearDisplay('none');
            })
            .catch((error) => {
                setDisabled(false);
                console.log(error);
                props.setEditModal(false);
                toggleCloseConfirmModal();
                alerts.showError(error.message);
            });
    };
    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };
    return (
        <>
            <div>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <ValidationForm>
                                            <div className="form-group">
                                                <label htmlFor="email">
                                                    <b>Enter new venue name</b>
                                                </label>
                                                <TextInput
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    placeholder="Hall 6"
                                                    defaultValue={props.venue_name}
                                                    validator={(value) => regxAlphaNumericWithSpacesAndUnderscores.test(value)}
                                                    errorMessage={{ validator: 'Please enter a valid name' }}
                                                    onChange={venueChangeHandler}
                                                />
                                                &nbsp;&nbsp;&nbsp;
                                            </div>
                                        </ValidationForm>
                                        <div className="form-group">
                                            <button disabled={disabled} className="btn btn-info float-right" onClick={toggleConfirmModal}>
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
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <ConfirmationModalWrapper submitButton submitFunction={handleSubmit} closeModal={toggleCloseConfirmModal} show={confirmModal}>
                <h6 className="text-center">Are you sure you want to update {props.venue_name} ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default EditVenue;
