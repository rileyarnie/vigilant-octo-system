import React, {useEffect, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Select from 'react-select';
import Config from '../../../config';
import axios from 'axios';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import {customSelectTheme} from '../../lib/SelectThemes';
const alerts: Alerts = new ToastifyAlerts();
interface ISelectedRow{
    AADAlias:string;
    id:number;    
}
interface IProps{
    onHide: () => void;
    show: boolean;
    selectedrowprops:ISelectedRow
}
export const AssignRoleModal = (props:IProps):JSX.Element => {
    const authnzSrv = Config.baseUrl.authnzSrv;
    const [roles, setRoles] = useState([]);
    const [isMulti] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options = [];
    useEffect(() => {
        console.log(props);
        axios
            .get(`${authnzSrv}/roles`)
            .then((res) => {
                setRoles(res.data);
            })
            .catch((error) => {
                console.log('Error');
                alerts.showError(error.message);
            });
    }, []);



    roles.map((role) => {
        return options.push({value: role.id, label: role.RoleName});
    });

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const handlePostRoles = async () => {
        const roleIds: number[] = [];
        const userId = props.selectedrowprops.id;
        selectedOptions.map((option) => {
            return roleIds.push(option.value);
        });
        const params = new URLSearchParams();
        roleIds.forEach((roleId)=>{
            params.append('roleIds', roleId.toString());
        });
        axios
            .post(`${authnzSrv}/users/${userId}/roles`, params)
            .then((res) => {
                if (res.status == 200) {
                    alerts.showSuccess('Successfully assigned role to user');
                    console.log(res);
                    props.onHide();
                }
            })
            .catch((error) => {
                console.error(error);
                alerts.showError(error.message);
                props.onHide();
            });
    };
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{props.selectedrowprops.AADAlias}&apos;s Roles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    theme={customSelectTheme}
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
