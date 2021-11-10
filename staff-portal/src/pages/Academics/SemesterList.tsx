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
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import Config from '../../config';
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';

const tableIcons = {
	Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref: any) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref: any) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
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
function SemesterList() {
	const columns = [
		{ title: 'ID', field: 'id', hidden: false },
		{ title: 'Name', field: 'name' },
		{ title: 'Start Date', field: 'startDate' },
		{ title: 'End Date', field: 'endDate' },
		{ title: 'Status', field: 'isActive' },
	];
	const [data, setData] = useState([]);
	const timetablingSrv = Config.baseUrl.timetablingSrv;
	const [iserror, setIserror] = useState(false);
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [status, setStatus] = useState('');
	const [showModal, setModal] = useState(false);
	const [errorMessages, setErrorMessages] = useState([]);
	useEffect(() => {
		axios
			.get(`${timetablingSrv}/semesters`)
			.then((res) => {
				setData(res.data);
			})
			.catch((error) => {
				console.error(error);
				alert(error.message);
			});
	}, []);

	const fetchSemesters = () => {
		axios
			.get(`${timetablingSrv}/semesters`)
			.then((res) => {
				setData(res.data);
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	const handleSubmit = (e) => {
		e.preventDefault()
		const semester = {
			 name: name,
			 startDate: startDate,
			 endDate: endDate,
			isActive: status,

		};

		createSemester(semester);
	};

	const createSemester = (semesterData) => {
		console.log(semesterData)
		axios
			.post(`${timetablingSrv}/semesters`, semesterData)
			.then((res) => {
				alert('Succesfully created semester');
				fetchSemesters();
				setModal(false);
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	const toggleCreateModal = () => {
		showModal ? setModal(false) : setModal(true);
	};
	return (
		<>
			<Row className="align-items-center page-header">
				<Col>
					<Breadcrumb />
				</Col>
				<Col>
					<Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
						Create Semester
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
							title="Semesters"
							columns={columns}
							data={data}
							// @ts-ignore
							icons={tableIcons}
							editable={{}}
						/>
					</Card>
				</Col>
			</Row>
			<Modal
				show={showModal}
				onHide={toggleCreateModal}
				onBackdropClick={toggleCreateModal}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Create a Semester</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ValidationForm>
						<div className='form-group'>
							<label htmlFor='name'><b>Enter semester name</b></label>
							<TextInput name='name' id='name' type='text' placeholder="Enter name" required
							           onChange={(e) => {
								           setName(e.target.value)
							           }}/><br />
							<label htmlFor='Date'><b>Start Date</b></label><br />
							<TextInput name='startDate' id='startDate'  type="date" required
							           onChange={(e) => {
								           setStartDate(e.target.value)
							           }}/><br />
							<label htmlFor='Date'><b>End Date</b></label><br />
							<TextInput name='endDate' id='endDate' type="date" required
							           onChange={(e) => {
								           setEndDate(e.target.value)
							           }}/><br />
						</div>
						<label htmlFor='requiresClearance'><b>Status</b></label><br />
						<SelectGroup name="color" id="color" onChange={(e) => {
							setStatus(e.target.value)
						}}>
							<option value="">--- Please select status---</option>
							<option value="true" >True</option>
							<option value="false"  >False</option>
						</SelectGroup><br /><br />
						<div className='form-group'>
							<button className='btn btn-danger' onClick={(e) => handleSubmit(e)}>Submit</button>
						</div>
					</ValidationForm>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default  SemesterList;