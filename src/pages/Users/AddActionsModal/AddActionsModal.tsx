import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { customSelectTheme } from '../../lib/SelectThemes';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
const alerts: Alerts = new ToastifyAlerts();


interface ISelectedRowProps {
    name: string;
    id: number;
}

interface IOptions {
    value: number;
    label: string;
}

interface IProps {
    onHide: () => void;
    selectedRowProps: ISelectedRowProps;
    show: boolean;
    toggleModal: () => void;
    defaultValues: IOptions[];
}

export const AddActionsModal = (props: IProps): JSX.Element => {
    const [actions, setActions] = useState([]);
    const [isMulti] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options: IOptions[] = [];
    useEffect(() => {
        authnzAxiosInstance
            .get('/actions')
            .then((res) => {
                setActions(res.data);
            })
            .catch((error) => {
                console.log(error);
                alerts.showError(error.message);
            });
    }, []);

    actions.map((action) => {
        return options.push({ value: action.id, label: action.name+ ' - '+ action.description});
    });
    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const handlePostRoles = async () => {
        const actionsArr = [];
        const roleId = props.selectedRowProps.id;
        selectedOptions.map((option) => {
            return actionsArr.push(option.value);
        });
        authnzAxiosInstance
            .post(`/roles/${roleId}/actions`, { actionID: actionsArr })
            .then((res) => {
                if (res.status == 200) {
                    alerts.showSuccess('Successfully assigned actions to role');
                    console.log(res);
                    props.onHide();
                }
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
                props.onHide();
            });
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Assign actions to {props.selectedRowProps.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    defaultValue={props.defaultValues}
                    theme={customSelectTheme}
                    options={options}
                    isMulti={isMulti}
                    placeholder="Select Actions for this Role"
                    noOptionsMessage={() => 'No available actions'}
                    onChange={handleChange}
                />
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="danger" onClick={props.toggleModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handlePostRoles}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
