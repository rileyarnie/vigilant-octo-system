import React, {useState, useEffect} from 'react';
import {forwardRef} from 'react';
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
import {Switch} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Row, Col, Card, Button, Modal, ProgressBar} from 'react-bootstrap';
import Config from '../../config';
import {Link} from 'react-router-dom';
import {ValidationForm, SelectGroup, TextInput} from 'react-bootstrap4-form-validation';

const tableIcons = {
	Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref}/>),
	Check: forwardRef((props, ref: any) => <Check {...props} ref={ref}/>),
	Clear: forwardRef((props, ref: any) => <Clear {...props} ref={ref}/>),
	Delete: forwardRef((props, ref: any) => <DeleteOutline {...props} ref={ref}/>),
	DetailPanel: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref}/>),
	Edit: forwardRef((props, ref: any) => <Edit {...props} ref={ref}/>),
	Export: forwardRef((props, ref: any) => <SaveAlt {...props} ref={ref}/>),
	Filter: forwardRef((props, ref: any) => <FilterList {...props} ref={ref}/>),
	FirstPage: forwardRef((props, ref: any) => <FirstPage {...props} ref={ref}/>),
	LastPage: forwardRef((props, ref: any) => <LastPage {...props} ref={ref}/>),
	NextPage: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref}/>),
	PreviousPage: forwardRef((props, ref: any) => <ChevronLeft {...props} ref={ref}/>),
	ResetSearch: forwardRef((props, ref: any) => <Clear {...props} ref={ref}/>),
	Search: forwardRef((props, ref: any) => <Search {...props} ref={ref}/>),
	SortArrow: forwardRef((props, ref: any) => <ArrowDownward {...props} ref={ref}/>),
	ThirdStateCheck: forwardRef((props, ref: any) => <Remove {...props} ref={ref}/>),
	ViewColumn: forwardRef((props, ref: any) => <ViewColumn {...props} ref={ref}/>)
};

function Programs() {
	const timetablingSrv = Config.baseUrl.timetablingSrv;

	interface Program {
		name: string;
		id: number;
		description: string;
		prerequisiteDocumentation: number;
		requiresClearance: boolean;
		certificationType: string;
		activation_status: boolean;
		approval_status: boolean;
		duration: string;
	}

	const [data, setData] = useState([]);
	const [iserror, setIserror] = useState(false);
	const [progressBar, setProgress] = useState(0);

	const [programName, setProgramName] = useState('');
	const [description, setDescription] = useState('');
	const [prerequisiteDocumentation, setPrerequisiteDocumentation] = useState('');
	const [requiresClearance, setRequiresClearance] = useState('');
	const [certificationType, setCertificationType] = useState('');
	const [duration, setDuration] = useState('');

	const [showModal, setModal] = useState(false);
	const [programId, setProgramId] = useState(null);
	const [selectedProgramName, setSelectedProgramName] = useState('');
	const [selectedDescription, setSelectedDescription] = useState('');
	const [selectedPrerequisiteDocumentation, setSelectedPrerequisiteDocumentation] = useState('');
	const [selectedRequiresClearance, setSelectedRequiresClearance] = useState('');
	const [selectedCertificationType, setSelectedCertificationType] = useState('');
	const [selectedDuration, setSelectedDuration] = useState('');

	const [checked, setChecked] = useState(true);
	const[disabled,setDisabled] = useState(false)
	let activationStatus: boolean;
	const handleActivationStatusToggle = (event, row: Program) => {
		setDisabled(true)
		if (row.activation_status) {
			activationStatus = false;
			handleToggleStatusSubmit(event, row);
		}
		if (!row.activation_status) {
			activationStatus = true;
			handleToggleStatusSubmit(event, row);
		}
	};
	const handleToggleStatusSubmit = (e, row: Program) => {
		const program = {
			activation_status: activationStatus,
		};
		axios
			.put(`${timetablingSrv}/programs/${row.id}`, program)
			.then((res) => {
				alert('Success')
				fetchPrograms();
				setDisabled(false)

			})
			.catch((error) => {
				console.error(error);
				alert(error);
				setDisabled(false)
			});
	};


	const columns = [
		{title: 'ID', field: 'id', editable: 'never' as const,},
		{title: 'Program Name', field: 'name'},
		{
			title: 'Activation Status',
			field: 'internal_action',
			render: (row: Program) => (
				<Switch
					onChange={(event) => handleActivationStatusToggle(event, row)}
					inputProps={{ 'aria-label': 'controlled' }}
					defaultChecked={row.activation_status === true ? true : false}
				/>
			)
		},
		{
			title: 'Assign courses',
			field: 'internal_action',
			render: (row) => (
				<Link to={"/assigncourses"} onClick={() => localStorage.setItem("programId", row.id)}>
					<button className="btn btn-danger">
						Assign courses
					</button>
				</Link>
			)
		},
		{
			title: 'View courses',
			field: 'internal_action',
			render: (row) => (
				<Link to={"/programcourses"} onClick={() => localStorage.setItem("programId", row.id)}>
					<button className="btn btn-danger">
						View courses
					</button>
				</Link>
			)
		}
	];
	const [errorMessages, setErrorMessages] = useState([]);
	useEffect(() => {
		axios.get(`${timetablingSrv}/programs`)
			.then(res => {
				setData(res.data);
			})
			.catch((error) => {
				console.error(error);
				alert(error.message)
			});
	}, []);

	const fetchPrograms = () => {
		axios.get(`${timetablingSrv}/programs`)
			.then(res => {
				setData(res.data);
			})
			.catch((error) => {
				console.error(error);
				alert(error.message)
			});
	};
	const handleCreate = (e) => {
		e.preventDefault()
		const program = {
			name: programName,
			description: description,
			prerequisiteDocumentation: prerequisiteDocumentation,
			requiresClearance: requiresClearance,
			certificationType: certificationType,
			duration: duration,
		};

		createProgram(program)
	};
	const createProgram = (programData) => {
		console.log(programData)
		axios
			.post(`${timetablingSrv}/programs`, programData)
			.then((res) => {
				setProgress(100);
				alert('Succesfully created a Program');
				fetchPrograms();
				resetStateCloseModal()
				setProgress(0);
			})
			.catch((error) => {
				setProgress(0)
				alert(error.message);
			});
	};
	const resetStateCloseModal = () => {
		setProgramId(null);
		setProgramName('');
		setDescription('');
		setPrerequisiteDocumentation('');
		setRequiresClearance('');
		setCertificationType('');
		setDuration('');
		setModal(false);
	}
	const toggleCreateModal = () => {
		showModal ? resetStateCloseModal() : setModal(true);
	};
	const handleClose = () => setModal(false);
	return (
		<>
			<Row className='align-items-center page-header'>
				<Col>
					<Breadcrumb/>
				</Col>
				<Col>
					<Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
						Create Program
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card>
						<div>
							{iserror &&
                            <Alert severity='error'>
								{errorMessages.map((msg, i) => {
									return <div key={i}>{msg}</div>;
								})}
                            </Alert>
							}
						</div>
						<MaterialTable
							title='Programs'
							columns={columns}
							data={data}
							// @ts-ignore
							icons={tableIcons}
						/>
					</Card>
				</Col>
			</Row>
			<Modal
				show={showModal}
				onHide={toggleCreateModal}
				size="lg"
				backdrop="static"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<ProgressBar animated now={progressBar} variant="info"/>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Create a Program</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ValidationForm>
						<div className='form-group'>
							<label htmlFor='name'><b>Program Name</b></label>
							<TextInput name='name' id='name' value={programName} type='text'
							           placeholder="Enter name"
							           onChange={(e) => setProgramName(e.target.value)}/><br/>
							<label htmlFor='description'><b>Description</b></label>
							<TextInput name='description' id='desc' multiline rows="3" type='text'
							           value={description} placeholder="enter description"
							           onChange={(e) => setDescription(e.target.value)}/><br/>
							<label htmlFor='cou'><b>Prerequisite Documentation</b></label>
							<TextInput name='prerequisiteDocumentation' id='prerequisiteDocumentation' multiline
							           rows="3" value={prerequisiteDocumentation}
							           onChange={(e) => setPrerequisiteDocumentation(e.target.value)}
							           type='textarea'
							           placeholder="Enter prerequisite documentation separate with ,"/><br/>
							<label htmlFor='certificationType'><b>CertificationType</b></label><br/>
							<SelectGroup name="certificationType" value={certificationType}
							             onChange={(e) => setCertificationType(e.target.value)}
							             required errorMessage="Please select CertificationType.">
								<option value="">--- Please select ---</option>
								<option value="Degree">Degree</option>
								<option value="Diploma">Diploma</option>
								<option value="Certificate">Certificate</option>
							</SelectGroup><br/><br/>
							<label htmlFor='requiresClearance'><b>Requires Clearance</b></label><br/>
							<SelectGroup name='requiresClearance' value={requiresClearance} id='requiresClearance'
							             onChange={(e) => setRequiresClearance(e.target.value)}>
								<option value="">--- Please select ---</option>
								<option value="true">True</option>
								<option value="false">False</option>
							</SelectGroup><br/><br/>
							<label htmlFor='duration'><b>Program duration</b></label><br/>
							<TextInput name='duration' value={duration} id='programDuration' type='textarea'
							           placeholder="Enter program duration e.g 4w2d"
							           onChange={(e) => setDuration(e.target.value)}/><br/><br/>
						</div>
						<div className='form-group'>
							<button className='btn btn-info float-right' onClick={(e) => handleCreate(e)}>Submit
							</button>
						</div>
					</ValidationForm>
					<button className="btn btn-danger float-danger" onClick={handleClose}>
						Close
					</button>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Programs;