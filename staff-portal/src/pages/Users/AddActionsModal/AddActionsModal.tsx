import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ActionsList } from '../ActionsList';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Config from '../../../config';
import axios from 'axios';
import { differenceBy, xor } from 'lodash';

export const AddActionsModal = (props) => {
    const base_url = Config.baseUrl.timetablingSrv;
    const [actions, setActions] = useState([]);
    const [isMulti, setMulti] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedRowActions, setSelectedRowActions] = useState([]);
    let options = [] as any;
    useEffect(() => {
        axios
            .get(`${base_url}/actions`)
            .then((res) => {
                setActions(res.data);
            })
            .catch((error) => {
                console.log('Error');
                alert(error.message)
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

    actions.map((action) => {
        return options.push({ value: action.id, label: action.ActionName });
    });

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const handlePostRoles = async () => {
        let actionsArr = [] as any;
        let roleId = props.selectedrowprops.id;
        selectedOptions.map((option) => {
            return actionsArr.push(option.value);
        });
        const params = new URLSearchParams();
        params.append('actionID', actionsArr);
        axios
            .post(`${base_url}/roles/${roleId}/actions`, params)
            .then((res) => {
                if (res.status == 200) {
                    alert(res.data);
                    console.log(res);
                    props.onHide()
                }
            })
            .catch((error) => {
                //handle error using logging library
                console.error(error);
                alert(error.message);
                props.onHide()
            });
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{props.selectedrowprops.name} Actions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    theme={customTheme}
                    options={options}
                    isMulti={isMulti}
                    placeholder="Select Actions for this Role"
                    noOptionsMessage={() => 'No available actions'}
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
