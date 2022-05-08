/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Edit from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Button, Card, Col,  Row } from 'react-bootstrap';
import CreateVenue from './CreateVenue';
import EditVenue from './EditVenue';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_VENUE, ACTION_GET_VENUE, ACTION_UPDATE_VENUE } from '../../authnz-library/timetabling-actions';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import TableWrapper from '../../utlis/TableWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();

const VenueList = (): JSX.Element => {
    const columns = [
        { title: 'ID', field: 'venue_id' },
        { title: 'Venue name', field: 'venue_name' },
        { title: 'Capacity', field: 'venue_capacity' },
        { title: 'Campus', field: 'campus_name' }
    ];
    interface venue {
        venue_name: string;
        venue_id: number;
    }
    const [data, setData] = useState([]);
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);
    const [showModal, setModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState({} as venue);
    const [linearDisplay, setLinearDisplay] = useState('none');

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/venues',{ params: { includeDeactivated: true }})
            .then((res) => {
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    };
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const toggleEditModal = () => {
        showEditModal ? setEditModal(false) : setEditModal(true);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    {canPerformActions(ACTION_CREATE_VENUE.name) && (
                        <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                            Create Venue
                        </Button>
                    )}
                </Col>
            </Row>
            {canPerformActions(ACTION_GET_VENUE.name) && (
                <>
                    <LinearProgress style={{ display: linearDisplay }} />
                    <Row>
                        <Col>
                            <Card>
                                <div>
                                    {iserror && (
                                        <Alert severity="error">
                                            {errorMessages.map((msg, i) => {
                                                return <div key={i}>{msg}</div>;
                                            })}
                                        </Alert>
                                    )}
                                </div>
                                <TableWrapper
                                    title="Venues"
                                    columns={columns}
                                    data={data}
                                    options={{ actionsColumnIndex: -1 }}
                                    actions={
                                        canPerformActions(ACTION_UPDATE_VENUE.name)
                                            ? [
                                                {
                                                    icon: Edit,
                                                    tooltip: 'Edit Row',
                                                    onClick: (event, rowData) => {
                                                        setSelectedVenue(rowData);
                                                        toggleEditModal();
                                                    }
                                                }
                                            ]
                                            : []
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            <ModalWrapper show={showModal} modalSize="lg" closeModal={toggleCreateModal} title="Create Venue" noFooter={true}>
                <CreateVenue
                    setModal={setModal}
                    setLinearDisplay={setLinearDisplay}
                    linearDisplay={linearDisplay}
                    fetchVenues={fetchVenues}
                ></CreateVenue>
            </ModalWrapper>
            <ModalWrapper show={showEditModal} title={`Edit ${selectedVenue.venue_name}`} modalSize='lg' noFooter closeModal={toggleEditModal} >
                <EditVenue
                    {...selectedVenue}
                    linearDisplay={linearDisplay}
                    setLinearDisplay={setLinearDisplay}
                    setData={setData}
                    data={data}
                    setEditModal={setEditModal}
                    fetchVenues={fetchVenues}
                >
                    {' '}
                </EditVenue>
            </ModalWrapper>
        </>
    );
};
export default VenueList;
