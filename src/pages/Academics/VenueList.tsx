/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import { Icons } from 'material-table';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Config from '../../config';
import { Modal } from 'react-bootstrap';
import CreateVenue from './CreateVenue';
import EditVenue from './EditVenue';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { LinearProgress } from '@mui/material';
import { canPerformActions } from '../../services/ActionChecker';
import { ACTION_CREATE_VENUE, ACTION_GET_VENUE, ACTION_UPDATE_VENUE } from '../../authnz-library/timetabling-actions';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const VenueList = (props): JSX.Element => {
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
    const timetablingSrv = Config.baseUrl.timetablingSrv;
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
        axios
            .get(`${timetablingSrv}/venues`)
            .then((res) => {
                console.log(res);
                setData(res.data);
                setLinearDisplay('none');
            })
            .catch((error) => {
                console.error(error);
                setLinearDisplay('none');
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
                                <MaterialTable
                                    title="Venues"
                                    columns={columns}
                                    data={data}
                                    icons={tableIcons}
                                    options={{ actionsColumnIndex: -1 }}
                                    actions={
                                        canPerformActions(ACTION_UPDATE_VENUE.name)?[
                                            {
                                                icon: Edit,
                                                tooltip: 'Edit Row',
                                                onClick: (event, rowData) => {
                                                    setSelectedVenue(rowData);
                                                    toggleEditModal();
                                                }
                                            }
                                        ]:[]
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal} backdrop="static">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Venue</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateVenue
                        setModal={setModal}
                        setLinearDisplay={setLinearDisplay}
                        linearDisplay={linearDisplay}
                        fetchVenues={fetchVenues}
                    >
                        {' '}
                    </CreateVenue>
                </Modal.Body>
            </Modal>
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showEditModal}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Edit {selectedVenue.venue_name} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
            </Modal>
        </>
    );
};
export default VenueList;
