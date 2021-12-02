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
import { Row, Col, Card, Button,ProgressBar } from 'react-bootstrap';
import Config from '../../config';
import { Modal } from 'react-bootstrap';
import CreateVenue from './CreateVenue';
import EditVenue from './EditVenue';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
const alerts: Alerts = new ToastifyAlerts();
const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
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
function VenueList(props) {
    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Venue name', field: 'name'},
        {title: 'Capacity', field: 'capacity'}
    ];
    interface venue{
        name:string,
        id:number
    }
    const [data, setData] = useState([]);
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const [iserror] = useState(false);
    const [errorMessages] = useState([]);
    const [showModal, setModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [selectedVenue,setSelectedVenue] = useState({} as venue);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = () =>{
        axios
            .get(`${timetablingSrv}/venues`)
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
            });
    };
    const [progress,setProgress] = useState(0);
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const toggleEditModal = () =>{
        showEditModal ? setEditModal(false):setEditModal(true);
    };
    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb />
                </Col>
                <Col>
                    <Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
                        Create Venue
                    </Button>
                </Col>
            </Row>
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
                            actions={[
                                {
                                    icon: Edit,
                                    tooltip: 'Edit Row',
                                    onClick: (event, rowData) => {
                                        setSelectedVenue(rowData);
                                        toggleEditModal(); 
                                    }
                                } 
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal}  backdrop="static">
                <ProgressBar striped variant="info" animated now={progress} />
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Venue</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateVenue setModal={setModal} setProgress={setProgress} > </CreateVenue>
                </Modal.Body>

            </Modal>
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showEditModal}>
                <ProgressBar striped variant="info" animated now={progress} />    
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Edit {selectedVenue.name} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditVenue {...selectedVenue } setData={setData} data={data} setEditModal={setEditModal} setProgress = {setProgress} fetchVenues={fetchVenues}> </EditVenue>
                </Modal.Body>

            </Modal>
        </>
    );
}
export default VenueList;