import React, {useEffect, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Config from '../../../config';
import axios from 'axios';
import {differenceBy, xor} from 'lodash';

export const AssignRoleModal = (props) => {
	const baseUrl = Config.baseUrl.authnzSrv;
	const [roles, setRoles] = useState([]);
	const [isMulti, setMulti] = useState(true);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [selectedRowActions, setSelectedRowActions] = useState([]);
	let options = [] as any;
	useEffect(() => {
		console.log(props)
		axios
			.get(`${baseUrl}/roles`)
			.then((res) => {
				setRoles(res.data);
			})
			.catch((error) => {
				console.log('Error');
				alert(error.message);
			});
	}, []);

	const customTheme = (theme) => {
		return {
			...theme,
			colors: {
				...theme.colors,
				primary25: 'pink',
				primary: 'blue',
				text: 'black',
				backgroundColor: 'yellow'
			}
		};
	};

	roles.map((role) => {
		return options.push({value: role.id, label: role.name});
	});

	const handleChange = (selectedOptions) => {
		setSelectedOptions(selectedOptions);
	};

	const handlePostRoles = async () => {
		let roleIds: number[] = [];
		let userId = props.selectedrowprops.id;
		selectedOptions.map((option) => {
			return roleIds.push(option.value);
		});
		const params = new URLSearchParams();
		roleIds.forEach((roleId)=>{
			params.append('roleIds', roleId.toString());
		})
		axios
			.post(`${baseUrl}/users/${userId}/roles`, params)
			.then((res) => {
				if (res.status == 200) {
					alert(res.data);
					console.log(res);
					props.onHide()
				}
			})
			.catch((error) => {
				console.error(error);
				alert(error.message);
				props.onHide()
			});
	};
	return (
		<Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">{props.selectedrowprops.aadAlias}'s Roles</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Select
					theme={customTheme}
					options={options}
					isMulti={isMulti}
					placeholder="Select roles for this user"
					noOptionsMessage={() => 'No roles available'}
					onChange={handleChange}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={handlePostRoles}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
