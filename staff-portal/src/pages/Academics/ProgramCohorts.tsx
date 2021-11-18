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
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import Config  from '../../config';
import { ValidationForm, SelectGroup, FileInput, TextInput } from 'react-bootstrap4-form-validation';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Switch } from '@material-ui/core';
const useStyles = makeStyles({
	root: {
		maxWidth: 345,
	},
});
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

function ProgramCohorts() {
	const timetablingSrv = Config.baseUrl.timetablingSrv;

	const columns = [
		{ title: 'ID', field: 'id' },
		{ title: 'Code', field: 'code' },
		{ title: 'Program Name', field: 'name' },
		{title: 'Start Date', render: (rowData) => rowData.startDate.slice(0, 10)},
		{title: 'Graduation Date', render: (rowData) => rowData.anticipatedGraduationMonth + "-" + rowData.anticipatedGraduationYear},
	];
	const [data, setData] = useState([]);
	const [iserror, setIserror] = useState(false);
	const [progressBar, setProgress] = useState(0);

	const [cohortName, setCohortName] = useState('');
	const [cohorts, setCohorts] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [programName, setProgramName] = useState('');

	const [showModal, setModal] = useState(false);
	const [modalShow, setModalShow] = useState(false);

	const [cohortId, setCohortId] = useState(null);
	const [selectedCohortName, setSelectedCohortName] = useState('');
	const [isActive, setisActive] = useState(false);
	const [errorMessages, setErrorMessages] = useState([]);
	useEffect(() => {
		axios.get(`${timetablingSrv}/program-cohorts`)
			.then(res => {
				setData(res.data);
			})
			.catch((error) => {
				//handle error using logging library
				console.error(error);
				alert(error)
			});
	}, []);

	const resetStateCloseModal = () => {
		setCohortId(null);
		setCohortName('');
		setModal(false);
	}
	const toggleCreateModal = () => {
		showModal ? resetStateCloseModal() : setModal(true);
	};
	return (
		<>
			<Row className='align-items-center page-header'>
				<Col>
					<Breadcrumb />
				</Col>
				<Col>
					<Button className="float-right" variant="danger" onClick={() => toggleCreateModal()}>
						Create Program Cohort
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
							title='Program Cohorts'
							columns={columns}
							data={data}
							// @ts-ignore
							icons={tableIcons}
							options={{actionsColumnIndex: -1}}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
}
export default ProgramCohorts;