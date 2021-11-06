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
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';

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
function VenueList() {
	const columns = [
		{ title: 'ID', field: 'id', hidden: true },
		{ title: 'Venue name', field: 'name' },
	];
	const [data, setData] = useState([]);
	const timetablingSrv = Config.baseUrl.timetablingSrv;
	const [iserror, setIserror] = useState(false);
	const [errorMessages, setErrorMessages] = useState([]);

	useEffect(() => {
		axios.get(`${timetablingSrv}/venues`)
			.then(res => {
				setData(res.data);
			})
			.catch((error) => {
				console.error(error);
				alert(error.message);
			});
	}, []);
	const handleRowUpdate = (newData, oldData, resolve) => {
		//validation
		let errorList = [];
		if (newData.name === '') {
			errorList.push('Please enter venue name');
		}
		if (errorList.length < 1) {
			axios.put('/venues/{venueId}' + newData.departmentId, newData)
				.then(res => {
					const dataUpdate = [...data];
					const index = oldData.tableData.departmentId;
					dataUpdate[index] = newData;
					setData([...dataUpdate]);
					resolve();
					setIserror(false);
					setErrorMessages([]);
				})
				.catch(error => {
					setIserror(true);
					resolve();
					alert(error.message);
				});
		} else {
			setErrorMessages(errorList);
			setIserror(true);
			resolve();
		}
	};
	return (
		<>
			<Row className='align-items-center page-header'>
				<Col>
					<Breadcrumb />
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
							title='Venues'
							columns={columns}
							data={data}
							// @ts-ignore
							icons={tableIcons}
							editable={{
								onRowUpdate: (newData, oldData) =>
									new Promise((resolve) => {
										handleRowUpdate(newData, oldData, resolve);
									}),
							}}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
}
export default VenueList;