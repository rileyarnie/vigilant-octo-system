/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Card, Col, Row} from 'react-bootstrap';
import {Alerts, ToastifyAlerts} from '../lib/Alert';
import {LinearProgress} from '@mui/material';
import {canPerformActions} from '../../services/ActionChecker';
import {ACTION_GET_USERS} from '../../authnz-library/authnz-actions';
import TableWrapper from '../../utlis/TableWrapper';
import CreateStaff from './CreateStaff/CreateStaff';
import {timetablingAxiosInstance} from '../../utlis/interceptors/timetabling-interceptor';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import {authnzAxiosInstance} from '../../utlis/interceptors/authnz-interceptor';
import CustomSwitch from '../../assets/switch/CustomSwitch';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import {ValidationForm, TextInput} from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Select from 'react-select';

const alerts: Alerts = new ToastifyAlerts();

interface Staff {
    activationStatus: boolean;
    approvalFlowId: number;
    approvalStatus: boolean;
    email: string;
    id: number;
    identification: string;
    identificationType: string;
    name: string;
    userId: 19;
}

const StaffList = (): JSX.Element => {
    const [disabled, setDisabled] = useState(false);
    const [switchStatus, setSwitchStatus] = useState<boolean>();
    const [activationModal, setActivationModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Staff>();
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [linearDisplay, setLinearDisplay] = useState('none');
    const [createStaffModal, setCreateStaffModal] = useState(false);
    const [updateStaffModal, setUpdateStaffModal] = useState(false);
    const [confirmUpdateStaffModal, setConfirmUpdateStaffModal] = useState(false);
    const [confirmCreateStaffModal, setConfirmCreateStaffModal] = useState(false);
    //
    const identificationTypeOptions = [
        {value: 'id_no', label: 'ID No'},
        {value: 'passport', label: 'Passport No'},
        {value: 'company_no', label: 'Company No'},
        {value: 'service', label: 'Service No'},
        {value: 'military_id', label: 'Military ID'},
        {value: 'driver_license', label: 'Driver License'},
    ];
    const [identificationType, setIdentificationType] = useState('');
    const [identification, setIdentification] = useState('');
    const [name, setName] = useState('');
    const [userId, setSelectedUserId] = useState('');
    const [selectedUserAad, setSelectedUserIdAad] = useState('');
    const [email, setEmail] = useState('');

    const toggleCreateStaffModal = () => {
        clearState();
        setCreateStaffModal(!createStaffModal);
    };

    const toggleUpdateStaffModal = () => {
        setUpdateStaffModal(!updateStaffModal);
    };
    const handleCloseActivationModal = () => {
        setActivationModal(false);
    };

    const toggleConfirmUpdateStaffModal = () => {
        setConfirmUpdateStaffModal(!confirmUpdateStaffModal);
    };
    const toggleConfirmCreateStaffModal = () => {
        setConfirmCreateStaffModal(!confirmCreateStaffModal);
    };

    const updateStaff = (updates) => {
        setDisabled(true);
        timetablingAxiosInstance
            .put(`/staff/${selectedRow.id}`, updates)
            .then(() => {
                alerts.showSuccess('successfully updated staff');
                clearState();
                fetchStaff();
            })
            .catch((err) => console.log('err', err))
            .finally(() => {
                setDisabled(false);
                handleCloseActivationModal();
                setUpdateStaffModal(false);
                setConfirmUpdateStaffModal(false);
            });
    };
    const columns = [
        {title: 'SN', field: 'id'},
        {title: 'Name', field: 'name'},
        {title: 'User', field: 'email'},
        {
            title: 'Activation Status',
            field: 'internal_action',
            render: (row: Staff) => (
                <>
                    <CustomSwitch
                        defaultChecked={row.activationStatus}
                        color="secondary"
                        inputProps={{'aria-label': 'controlled'}}
                        checked={row.activationStatus}
                        onChange={() => {
                            setActivationModal(true);
                            setSelectedRow(row);
                            setSwitchStatus(!row.activationStatus);
                        }}
                    />
                    <ConfirmationModalWrapper
                        disabled={disabled}
                        submitButton
                        submitFunction={() => updateStaff({activationStatus: switchStatus})}
                        closeModal={handleCloseActivationModal}
                        show={activationModal}
                    >
                        <h6 className="text-center">
                            Are you sure you want to change the status of <>{selectedRow ? selectedRow.name : ''}</> ?
                        </h6>
                    </ConfirmationModalWrapper>
                </>
            )
        },
        {
            title: 'Actions',
            render: (row) => (
                <button className="btn btn-link"
                    onClick={() => {
                        setSelectedRow(row);
                        editStaffHandler(row);
                    }}
                >
                    Edit Staff
                </button>
            )
        },

    ];

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);


    const editStaffHandler = (data) => {
        const userAad = users.filter((user) => user.id === data.userId)[0].aadAlias;
        setSelectedUserIdAad(userAad);
        setEmail(data.email);
        setSelectedUserId(data.userId);
        setIdentificationType(data.identificationType);
        setIdentification(data.identification);
        setName(data.name);
        toggleUpdateStaffModal();
    };

    const clearState = () => {
        setSelectedUserIdAad('');
        setEmail('');
        setSelectedUserId('');
        setIdentificationType('');
        setIdentification('');
        setName('');
        toggleUpdateStaffModal();
        setDisabled(false);
    };

    const fetchUsers = () => {
        setLinearDisplay('block');
        authnzAxiosInstance
            .get('/users')
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    };
    const fetchStaff = () => {
        setLinearDisplay('block');
        timetablingAxiosInstance
            .get('/staff', {params: {includeDeactivated: true}})
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            })
            .finally(() => {
                setLinearDisplay('none');
            });
    };

    const createStaffHandler = () => {
        setDisabled(true);
        const data = { name, identification, identificationType, email };
        const body = userId ? { ...data, userId } : data;
        timetablingAxiosInstance
            .post('/staff', body)
            .then(() => {
                alerts.showSuccess('successfully created staff');
                clearState();
                fetchStaff();
                toggleCreateStaffModal();
            })
            .catch((err) => {
                alerts.showError(err.message);
            })
            .finally(() => {
                toggleConfirmCreateStaffModal();
                setDisabled(false);
            });
    };

    const updateStaffHandler = () => {
        updateStaff({
            name: name,
            identification: identification,
            identificationType: identificationType,
            email: email,
            userId: userId
        });
    };

    const handleErrorSubmit = (e, _formData, errorInputs) => {
        console.error(errorInputs);
    };
    const handleSelect = (selectedUser) => {
        setSelectedUserId(selectedUser.value);
    };

    const handleIdentificationChange = (event) => {
        setIdentification(event.target.value);
    };
    const handleIdentificationTypeChange = (event) => {
        setIdentificationType(event.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    return (
        <>
            <Row className="align-items-center page-header">
                <Col>
                    <Breadcrumb/>
                </Col>
                <CreateStaff openCreateStaffModal={toggleCreateStaffModal} fetchStaff={fetchStaff}/>
            </Row>
            <LinearProgress style={{display: linearDisplay}}/>
            {canPerformActions(ACTION_GET_USERS.name) && (
                <Row>
                    <Col>
                        <Card>
                            <TableWrapper columns={columns} title="Staff" data={data} options={{}}/>
                        </Card>
                    </Col>
                </Row>
            )}
            <ModalWrapper
                title="Update Staff"
                show={updateStaffModal}
                closeModal={toggleUpdateStaffModal}
                modalSize="lg"
                submitButton
                submitFunction={toggleConfirmUpdateStaffModal}
            >
                <>
                    <Row>
                        <Col>
                            <Row>
                                <Col md={12}>
                                    <ValidationForm onSubmit={toggleConfirmUpdateStaffModal}
                                        onErrorSubmit={handleErrorSubmit}>
                                        <Row>
                                            <Col sm={6}>
                                                <label htmlFor="user">
                                                    <b>
                                                        User
                                                        <span className="text-danger">*</span>
                                                    </b>
                                                </label>
                                                <Select
                                                    options={
                                                        users
                                                            ? users.map((user) => ({
                                                                value: user.id,
                                                                label: user.aadAlias
                                                            }))
                                                            : []
                                                    }
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    placeholder="Select User"
                                                    noOptionsMessage={() => 'No available users'}
                                                    onChange={handleSelect}
                                                    defaultValue={{label: selectedUserAad, value: selectedUserAad}}
                                                />
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <b>
                                                            Enter Email Address<span className="text-danger">*</span>
                                                        </b>
                                                    </label>
                                                    <TextInput
                                                        name="email"
                                                        id="email"
                                                        type="email"
                                                        placeholder="Enter Email"
                                                        validator={validator.isEmail}
                                                        errorMessage={{validator: 'Please enter a valid email'}}
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="name">
                                                        <b>
                                                            Name<span className="text-danger">*</span>
                                                        </b>
                                                    </label>
                                                    <TextInput
                                                        name="name"
                                                        id="name"
                                                        placeholder="Enter Name"
                                                        validator={!validator}
                                                        errorMessage={{validator: 'Please enter a name'}}
                                                        value={name}
                                                        onChange={handleNameChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="identificationType">
                                                        <b>
                                                            Identification Type<span className="text-danger">*</span>
                                                        </b>
                                                    </label>
                                                    <Select
                                                        options={identificationTypeOptions}
                                                        defaultValue={{
                                                            label: identificationType.replace(/(^\w)/g, g => g[0].toUpperCase()).replace(/([-_]\w)/g, g => ' ' + g[1].toUpperCase()).trim(),
                                                            value: identificationType
                                                        }}
                                                        name="identificationType"
                                                        id="identificationType"
                                                        placeholder="Select ID Type"
                                                        noOptionsMessage={() => 'No types available'}
                                                        onChange={(e) => handleIdentificationTypeChange(e)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <label htmlFor="identification">
                                                        <b>
                                                            Identification<span className="text-danger">*</span>
                                                        </b>
                                                    </label>
                                                    <TextInput
                                                        name="identification"
                                                        id="identification"
                                                        placeholder="identification"
                                                        validator={!validator.isEmpty}
                                                        errorMessage={{validator: 'Please enter a value'}}
                                                        value={identification}
                                                        onChange={handleIdentificationChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={6}></Col>
                                        </Row>
                                    </ValidationForm>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            </ModalWrapper>
            <ModalWrapper
                show={createStaffModal}
                closeModal={toggleCreateStaffModal}
                title="Create Staff"
                modalSize="lg"
                submitButton
                submitFunction={toggleConfirmCreateStaffModal}
            >
                <Row>
                    <Col>
                        <Row>
                            <Col md={12}>
                                <ValidationForm onSubmit={toggleConfirmCreateStaffModal}
                                    onErrorSubmit={handleErrorSubmit}>
                                    <Row style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <Col sm={6}>
                                            <div className="form-group">
                                                <label htmlFor="user">
                                                    <b>
                                                        User<span className="text-danger">*</span>
                                                    </b>
                                                </label>
                                                <Select
                                                    options={users.map((user) => ({
                                                        value: user.id,
                                                        label: user.aadAlias
                                                    }))}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    placeholder="Select User"
                                                    noOptionsMessage={() => 'No available users'}
                                                    onChange={handleSelect}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group">
                                                <label htmlFor="email">
                                                    <b>
                                                        Enter Email Address<span className="text-danger">*</span>
                                                    </b>
                                                </label>
                                                <TextInput
                                                    name="email"
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    validator={validator.isEmail}
                                                    errorMessage={{validator: 'Please enter a valid email'}}
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group">
                                                <label htmlFor="name">
                                                    <b>
                                                        Name<span className="text-danger">*</span>
                                                    </b>
                                                </label>
                                                <TextInput
                                                    name="name"
                                                    id="name"
                                                    placeholder="Enter Name"
                                                    validator={!validator}
                                                    errorMessage={{validator: 'Please enter a name'}}
                                                    value={name}
                                                    onChange={handleNameChange}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group">
                                                <label htmlFor="identificationType">
                                                    <b>
                                                        Identification Type<span className="text-danger">*</span>
                                                    </b>
                                                </label>
                                                <Select
                                                    options={identificationTypeOptions}
                                                    name="identificationType"
                                                    id="identificationType"
                                                    placeholder="Select ID Type"
                                                    noOptionsMessage={() => 'No types available'}
                                                    onChange={(e) => handleIdentificationTypeChange(e)}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group">
                                                <label htmlFor="identification">
                                                    <b>
                                                        Identification<span className="text-danger">*</span>
                                                    </b>
                                                </label>
                                                <TextInput
                                                    name="identification"
                                                    id="identification"
                                                    placeholder="Identification Number"
                                                    validator={!validator.isEmpty}
                                                    errorMessage={{validator: 'Please enter an ID Number'}}
                                                    value={identification}
                                                    onChange={handleIdentificationChange}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={6}></Col>
                                    </Row>
                                </ValidationForm>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={updateStaffHandler}
                closeModal={toggleConfirmUpdateStaffModal}
                show={confirmUpdateStaffModal}
            >
                <h6 className="text-center">
                    Are you sure you want to change the details of <>{selectedRow ? selectedRow.name : ''}</> ?
                </h6>
            </ConfirmationModalWrapper>
            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={createStaffHandler}
                closeModal={toggleConfirmCreateStaffModal}
                show={confirmCreateStaffModal}
            >
                <h6 className="text-center">Are you sure you want add staff?</h6>
            </ConfirmationModalWrapper>
        </>
    );
};
export default StaffList;
