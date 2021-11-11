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

const tableIcons = {

    Edit: forwardRef((props, ref: any) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref: any) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref: any) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: any) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: any) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: any) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: any) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: any) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: any) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: any) => <ViewColumn {...props} ref={ref} />)
};
function VenueList(props) {
    const columns = [
        { title: 'ID', field: 'id', hidden: true },
        { title: 'Venue name', field: 'name' }
    ];
    interface venue{
        name:string,
        id:number
    }
    const [data, setData] = useState([]);
    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [showModal, setModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [selectedVenue,setSelectedVenue] = useState({} as venue);

    useEffect(() => {
       fetchVenues()
    }, []);

    const fetchVenues = () =>{
        axios
        .get(`${timetablingSrv}/venues`)
        .then((res) => {
            console.log(res)
            setData(res.data);
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
    }
    const [progress,setProgress] = useState(0)
    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = [];
        if (newData.name === '') {
            errorList.push('Please enter venue name');
        }
        if (errorList.length < 1) {
            axios
                .put(`${timetablingSrv}/venues/{venueId}` + newData.departmentId, newData) 
                .then((res) => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.departmentId;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve();
                    setIserror(false);
                    setErrorMessages([]);
                })
                .catch((error) => {
                    setIserror(true);
                    resolve();
                    alert(error.message);
                    console.log(error)
                });
        } else {
            setErrorMessages(errorList);
            setIserror(true);
            resolve();
        }
    };
    const toggleCreateModal = () => {
        showModal ? setModal(false) : setModal(true);
    };
    const toggleEditModal = () =>{
        showEditModal ? setEditModal(false):setEditModal(true)
    }
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
                            // @ts-ignore
                            icons={tableIcons}
                            actions={[
                                {
                                  icon: Edit,
                                  tooltip: 'Edit Row',
                                  onClick: (event, rowData) => {
                                    // Code to display custom Dialog here
                                    setSelectedVenue(rowData)
                                    toggleEditModal() 
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
				<CreateVenue setModal={setModal} setProgress={setProgress} ></CreateVenue>	
                </Modal.Body>

            </Modal>
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showEditModal}>
            <ProgressBar striped variant="info" animated now={progress} />    
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Edit {selectedVenue.name} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
				<EditVenue {...selectedVenue as any }setData={setData} data={data} setEditModal={setEditModal} setProgress = {setProgress} fetchVenues={fetchVenues}></EditVenue>		
                </Modal.Body>

            </Modal>
        </>
    );
}
export default VenueList;