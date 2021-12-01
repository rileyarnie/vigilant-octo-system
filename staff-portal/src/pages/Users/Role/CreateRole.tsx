import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import Config from '../../../config';
import axios from 'axios';

interface IProps {
    fetchRoles: () => void
}

const CreateRole = (props:IProps) => {

    const authnzSrv = Config.baseUrl.authnzSrv; 
    const [roleName,setRoleName] = useState('');
    const [showCreateModal,setShowCreateModal] = useState(false);
    const handleRoleChange = (event) => {
        setRoleName(event.target.value);
    };

    const handleRoleSubmit = () => {
        axios.put(`${authnzSrv}/roles`, { 'roleName': roleName })
            .then(() => {
                alert('Successfuly created role');
                props.fetchRoles();
                setShowCreateModal(false);
            })
            .catch(error => {
                alert(error.message);
                console.log(error);
            });
    };
    return (
        <>
            <Button className = 'float-right' variant = "danger" onClick={() => setShowCreateModal(true)} >Create Role</Button>
            <Modal  size="lg" aria-labelledby="contained-modal-title-vcenter" show ={showCreateModal} centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Create Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
       
                        <Row>
                            <Col md={12}>
                                <ValidationForm onSubmit={handleRoleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            <b>Enter Role Name</b>
                                        </label>
                                        <TextInput
                                            name="name"
                                            id="name"
                                            type="text"
                                            placeholder="Role name"
                                            validator={validator.isAlphanumeric}
                                            errorMessage={{ validator: 'Please enter a valid Role name' }}
                                            value={roleName}
                                            onChange = {handleRoleChange}
                                        />
                                    </div>                                                   
                                </ValidationForm>
                            </Col>
                        </Row>
                         
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Col> 
                        <Button className = "float-right" variant="info" onClick={handleRoleSubmit}>
                        Submit
                        </Button>
                        <Button className = "float-left" variant="danger" onClick={() => setShowCreateModal(false)}>
                        Cancel
                        </Button>
                    </Col>
                    
                </Modal.Footer>
            </Modal>
            
        </>
    );
};

export default CreateRole;
