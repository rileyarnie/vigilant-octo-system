import React, {useState, useEffect} from 'react';
import {forwardRef} from 'react';
import Config from '../../config';
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
import {Card, Col, Row} from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
//import {Actions} from "./ActionsByRole/Actions"
import {Assign} from './Role/Assign';

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

function AssignRole() {

	const columns = [
		{title: 'id', field: 'id'},
		{title: 'AAD ALIAS', field: 'AADAlias'},

	];
	const [data, setData] = useState([]);
	const [id, setId] = useState(0);
	const [AADAlias, setAADAlias] = useState('')

	//for error handling
	const [iserror, setIserror] = useState(false);
	const [errorMessages, setErrorMessages] = useState([]);

	useEffect(() => {
		const authnzSrv = Config.baseUrl.authnzSrv;
		axios
			.get(`${authnzSrv}/users`)
			.then((res) => {
					setData(res.data);
				})
				.catch(error => {
					console.log('Error');
					alert(error.message);
				});
	}, []);
	const handleRowSelection = (row) => {
		setId(row[0]?.id);
		setAADAlias(row[0]?.AADAlias);
		console.log(row)
	}
	const selectedRowProps = {
		id: id,
		AADAlias: AADAlias
	}
	return (
		<>
			<div>
				<Row className='align-items-center page-header'>
					<Col>
						<Breadcrumb/>
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
								title='Select User to assign role'
								columns={columns}
								data={data}
								options={{
									selection: true,
									showSelectAllCheckbox: false,
									showTextRowsSelected: false
								}}
								onSelectionChange={(rows) => handleRowSelection(rows)}

								// @ts-ignore
								icons={tableIcons}
								editable={{}}
							/>
						</Card>
					</Col>

				</Row>
				&nbsp;&nbsp;&nbsp;
				<Assign {...selectedRowProps as any} ></Assign>
			</div>
		</>
	);
}

export default AssignRole;