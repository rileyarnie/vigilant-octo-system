import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Alerts, ToastifyAlerts } from '../../lib/Alert';
import { authnzAxiosInstance } from '../../../utlis/interceptors/authnz-interceptor';
import TableWrapper from '../../../utlis/TableWrapper';
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
    const [defaultValuesId, setDefaultValuesId] = useState([]);
    const [defaultCheckedRows, setDefaultCheckedRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

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

    const columns = [
        { title: 'ID', field: 'id', hidden: false },
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' }
    ];
    actions.map((action) => {
        return options.push({ value: action.id, label: action.name + ' - ' + action.description });
    });

    const getDefaultChecked = (data, defaultValuesId) => {
        const defaultChecked = [];
        if (data.length <= 0 || defaultValuesId <= 0) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (defaultValuesId.indexOf(element.id) > -1) {
                defaultChecked.push({ ...element, tableData: { checked: true } });
            } else {
                defaultChecked.push(element);
            }
        }
        return setDefaultCheckedRows(defaultChecked);
    };

    useEffect(() => {
        getDefaultChecked(actions, defaultValuesId);
    }, [actions, defaultValuesId]);

    useEffect(() => {
        setDefaultValuesId(props.defaultValues.map((item) => item.value));
    }, [actions, props.defaultValues]);

    const handlePostRoles = async () => {
        const roleId = props.selectedRowProps.id;
        authnzAxiosInstance
            .post(`/roles/${roleId}/actions`, { actionID: selectedRows })
            .then((res) => {
                if (res.status == 200) {
                    alerts.showSuccess('Successfully assigned actions to role');
                }
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alerts.showError(error.message);
            })
            .finally(() => {
                props.onHide();
            });
    };

    const handleRowSelection = (rows) => {
        const roleIds = rows.map((row) => row.id);
        const uniq = [...new Set(roleIds)];
        setSelectedRows(uniq);
    };

    return (
        <Modal {...props} size="lg" backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Assign actions to {props.selectedRowProps.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableWrapper
                    title={`Assign actions to ${props.selectedRowProps.name}`}
                    columns={columns}
                    data={defaultCheckedRows}
                    options={{
                        selection: true,
                        showSelectAllCheckbox: false,
                        showTextRowsSelected: false
                    }}
                    onSelectionChange={(rows) => handleRowSelection(rows)}
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
