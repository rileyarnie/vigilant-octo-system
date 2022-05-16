import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
import ConfirmationModalWrapper from '../../../App/components/modal/ConfirmationModalWrapper';
import { customSelectTheme } from '../../lib/SelectThemes';
import Select from 'react-select';

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
    const [disabled, setDisabled] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [isMulti,] = useState(true);
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
        return options.push({ value: action.id, label: action.name + ' - ' + action.description });
    });

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
                }
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                props.onHide();
                setDisabled(false);
                toggleCloseConfirmModal();
            });
    };

    const toggleConfirmModal = () => {
        setConfirmModal(true);
    };
    const toggleCloseConfirmModal = () => {
        setConfirmModal(false);
    };

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    return (
        <>
            <Modal {...props} size="lg" backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
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
                    <Button variant="primary" onClick={toggleConfirmModal}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={handlePostRoles}
                closeModal={toggleCloseConfirmModal}
                show={confirmModal}
            >
                <h6 className="text-center">Are you sure you want to Assign actions to {props.selectedRowProps.name} ?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};
