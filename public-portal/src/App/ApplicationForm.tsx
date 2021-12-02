// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Card, Row, Col, ListGroup, Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import Config from '../config'
import { CountryDropdown } from 'react-country-region-selector'
import { SelectGroup, FileInput, TextInput, ValidationForm } from 'react-bootstrap4-form-validation'
import { Alerts, ToastifyAlerts } from '../lib/Alert'
const alerts: Alerts = new ToastifyAlerts()
function ApplicationForm () {
    interface camp {
        id: number,
        name: string,
    }
    interface applicationResponse {
        firstName: string,
        id: number,
        lastName: string,
        otherName: string,
        nationality: string,
        identification: string,
        gender: string,
        maritalStatus: string,
        religion: string,
        dateOfBirth: Date,
        placeofBirth: string,
        phoneNumber: string,
        emailAddress: string,
        physicalChallenges: string,
        courseStartDate: string,
        campus: string,
        sponsor: string,
        countryOfResidence: string,
        name: string,
        nextOfKinPhoneNumber: string,
        relation: string,
        documentUrl: string

    }

    const simSrv = Config.baseUrl.simSrv
    const timetablingSrv = Config.baseUrl.timetablingSrv

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [show, setShow] = useState(false)
    const [otherName, setOtherName] = useState('')
    const [nationality, setNationality] = useState('')
    const [identification, setIdentification] = useState('')
    const [gender, setGender] = useState('')
    const [maritalStatus, setMaritalStatus] = useState('')
    const [religion, setReligion] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [placeofBirth, setPlaceofBirth] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [fileUploaded, setFileUploaded] = useState('')
    const [nextOfKinName, setNextOfKinName] = useState('')
    const [nextOfKinPhoneNumber, setNextOfKinPhoneNumber] = useState('')
    const [nextOfKinRelation, setNextOfKinRelation] = useState('')
    const [physicalChallenges, setPhysicalChallenges] = useState('')
    const [courseStartDate, setCourseStartDate] = useState('')
    const [campus, setCampus] = useState('')
    const [sponsor, setSponsor] = useState('')
    const [countryOfResidence, setCountryOfResidence] = useState('')
    const [documentsUrl, setDocumentsUrl] = useState('kcse.pdf')
    const [campuses, setCampuses] = useState([])
    const [applicationDetails, setApplicationDetails] = useState<applicationResponse>()

    useEffect(() => {
      axios.get(`${timetablingSrv}/campuses`)
        .then(res => {
          setCampuses(res.data)
        })
        .catch((error) => {
          console.error(error)
          alerts.showError(error.message)
        })
    }, [])
    const handleUpload = () => {
      const form = new FormData()
      form.append('fileUploaded', fileUploaded)
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      axios.post(`${timetablingSrv}/files`, form, config)
        .then((res) => {
          alerts.showSuccess('File uploaded successfully')
          setDocumentsUrl(res.data)
          console.log(res.data)
        })
        .catch((error) => {
          console.log(error)
          alerts.showError(error.message)
        })
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const filledData = {
        body: {
          application: {
            firstName: firstName,
            lastName: lastName,
            otherName: otherName,
            nationality: nationality,
            identification: identification,
            gender: gender,
            maritalStatus: maritalStatus,
            religion: religion,
            dateOfBirth: dateOfBirth,
            placeofBirth: placeofBirth,
            phoneNumber: phoneNumber,
            emailAddress: emailAddress,
            physicalChallenges: physicalChallenges,
            courseStartDate: courseStartDate,
            campus: campus,
            sponsor: sponsor,
            countryOfResidence: countryOfResidence
          },
          nextOfKin: {
            name: nextOfKinName,
            nextOfKinPhoneNumber: nextOfKinPhoneNumber,
            relation: nextOfKinRelation
          },
          supportingDocuments: {
            documentUrl: documentsUrl
          }
        }
      }
      submitApplication(filledData)
    }
    const submitApplication = (applicationData) => {
      console.log(applicationData)
      axios
        .post(`${simSrv}/program-cohort-applications`, applicationData)
        .then((res) => {
          setApplicationDetails(res.data)
          setShow(true)
        })
        .catch((error) => {
          console.log(error)
          alerts.showError(error.message)
        })
    }
    const handleClose = () => setShow(false)
    // const handleShow = () => setShow(true)
    return (
        <Row>
            <Col>
                <h3>Application Form</h3>
                <Card>
                    <Card.Body>
                        <p>Please fill in the following fields</p>
                        <Row>
                            <ValidationForm>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='firstName'><b>First Name</b></label><br/><br/>
                                        <TextInput name='firstName' id='firstName' type='text' placeholder="Enter name" required
                                                   onChange={(e) => {
                                                     setFirstName(e.target.value)
                                                   }}/><br/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='lastName'><b>Last Name</b></label><br/><br/>
                                        <TextInput name='lastName' id='lastName' type='text' placeholder="Enter Last name" required
                                                   onChange={(e) => { setLastName(e.target.value) }}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='otherName'><b>Other Name</b></label><br/><br/>
                                        <TextInput name='otherName' id='otherName' type='text' placeholder="Enter other name"
                                                   onChange={(e) => { setOtherName(e.target.value) }}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='nationality'><b>Nationality</b></label><br/><br/>
                                        <TextInput name='nationality' id='nationality' placeholder=" Kenyan" required onChange={(e) => {
                                          setNationality(e.target.value)
                                        }} type='text'/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='identification'><b>Identification</b></label><br/><br/>
                                        <TextInput name='identification' id='identification' placeholder=" 346678798" required onChange={(e) => {
                                          setIdentification(e.target.value)
                                        }} type='text'/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='gender'><b>Gender</b></label><br/><br/>
                                        <SelectGroup name="gender" id="gender" onChange={(e) => {
                                          setGender(e.target.value)
                                        }} required errorMessage="Please select Gender">
                                            <option value="">--- Please select ---</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </SelectGroup>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='maritalStatus'><b>Marital Status</b></label><br/><br/>
                                        <SelectGroup name="maritalStatus" id="maritalStatus" onChange={(e) => {
                                          setMaritalStatus(e.target.value)
                                        }} required errorMessage="Please select your status">
                                            <option value="">--- Please select ---</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="separated">Separated</option>
                                            <option value="widowed">widowed</option>
                                        </SelectGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='religion'><b>Religion</b></label><br/><br/>
                                        <SelectGroup name="religion" id="religion" required onChange={(e) => {
                                          setReligion(e.target.value)
                                        }} errorMessage="Please select your religion">
                                            <option value="">-- Please select --</option>
                                            <option value="Christianity">Christianity</option>
                                            <option value="Islam">Islam</option>
                                            <option value="Hinduism">Hinduism</option>
                                            <option value="pagan">Pagan</option>
                                            <option value="Other">Other</option>
                                        </SelectGroup>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='dateOfBirth'><b>Date of Birth</b></label><br/><br/>
                                        <TextInput name='dateOfBirth' id='dateOfBirth' required onChange={(e) => { setDateOfBirth(e.target.value) }} type='date'/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='placeofBirth'><b>Place of Birth</b></label><br/><br/>
                                        <TextInput name='placeofBirth' id='placeofBirth' required onChange={(e) => { setPlaceofBirth(e.target.value) }} type='text'/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='phoneNumber'><b>Phone Number</b></label><br/><br/>
                                        <TextInput name='phoneNumber' id='phoneNumber' required onChange={(e) => { setPhoneNumber(e.target.value) }} placeholder="+254 712 345 789" type='text'/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='emailAddress'><b>Email Address</b></label><br/><br/>
                                        <TextInput name='emailAddress' id='emailAddress' required onChange={(e) => { setEmailAddress(e.target.value) }} placeholder="Enter email address" type='email'/>
                                    </div>
                                </div>
                                <br/><br/><br/><br/>
                                <h5><b>Next of Kin Details</b></h5>
                                <div className="form-group row">
                                    <div className="col-md-4">
                                        <label htmlFor='name'><b>Name</b></label><br/><br/>
                                        <TextInput name='name' placeholder="Enter name" id='name' onChange={(e) => { setNextOfKinName(e.target.value) }} type='text'/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor='phoneNumber'><b>Phone Number</b></label><br/><br/>
                                        <TextInput name='phoneNumber' placeholder="Enter phone number" id='phoneNumber' onChange={(e) => { setNextOfKinPhoneNumber(e.target.value) }} type='text'/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor='relation'><b>Relation</b></label><br/><br/>
                                        <TextInput name='relation' placeholder="Relation" id='relation' onChange={(e) => {
                                          setNextOfKinRelation(e.target.value)
                                        }} type='text'/>
                                    </div>
                                </div><br/><br/><br/><br/>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='physicalChallenges'><b>Physical Challenges</b></label><br/><br/>
                                        <TextInput name='physicalChallenges' multiline rows="3" id='physicalChallenges' onChange={(e) => { setPhysicalChallenges(e.target.value) }} type='text'/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='courseStartDate'><b>Course Start Date</b></label><br/><br/>
                                        <TextInput name='courseStartDate' required id='courseStartDate' onChange={(e) => { setCourseStartDate(e.target.value) }} type='date'/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='campus'><b>Campus</b></label><br/><br/>
                                        <SelectGroup name="campus" id="campus" onChange={(e) => { setCampus(e.target.value) }} required errorMessage="Please select campus">
                                            <option value="">- Please select -</option>
                                            {campuses.map((camp:camp) => {
                                              return <option key={camp.name} value={camp.id}>{camp.name}</option>
                                            })}
                                        </SelectGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='sponsor'><b>Sponsor</b></label><br/><br/>
                                        <TextInput name='sponsor' placeholder="Sponsor name" id='sponsor' required onChange={(e) => { setSponsor(e.target.value) }} type='text'/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor='countryOfResidence'><b>Country Of Residence</b></label><br/><br/>
                                        <CountryDropdown
                                            value={countryOfResidence}
                                            onChange={(val) => setCountryOfResidence(val)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor='countryOfResidence'><b>Supporting Documents</b></label><br/>
                                        <FileInput name="fileUploaded" id="image" encType="multipart/form-data"
                                                   fileType={['pdf', 'doc']} maxFileSize="10mb"
                                                   onInput={(e) => {
                                                     setFileUploaded(() => { return e.target.files[0] })
                                                     handleUpload()
                                                   }}
                                                   errorMessage={{ required: 'Please upload an image', fileType: 'Only image is allowed', maxFileSize: 'Max file size is 3MB' }}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                        <br/><br/>
                                    <Button className='btn btn-primary' onClick={(e) => handleSubmit(e)}>
                                            Submit
                                    </Button>
                                </div>
                            </ValidationForm>
                            <Modal
                                backdrop="static"
                                show={show}
                                onHide={handleClose}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter">Thank you <i color="red">{applicationDetails?.firstName} {applicationDetails?.lastName}</i> for your application</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h6>Application Id: {applicationDetails?.id}</h6>
                                    <Row>
                                        <div className="col-md-6">
                                            <ListGroup>
                                                <ListGroup.Item>First Name: {applicationDetails?.firstName}</ListGroup.Item>
                                                <ListGroup.Item>Last Name: {applicationDetails?.lastName}</ListGroup.Item>
                                                <ListGroup.Item>Other Name: {applicationDetails?.otherName}</ListGroup.Item>
                                                <ListGroup.Item>Nationality: {applicationDetails?.nationality}</ListGroup.Item>
                                                <ListGroup.Item>Identification: {applicationDetails?.identification}</ListGroup.Item>
                                                <ListGroup.Item>Gender: {applicationDetails?.gender}</ListGroup.Item>
                                                <ListGroup.Item>Marital Status: {applicationDetails?.maritalStatus}</ListGroup.Item>
                                                <ListGroup.Item>Religion: {applicationDetails?.religion}</ListGroup.Item>
                                                <ListGroup.Item>Date Of Birth: {applicationDetails?.dateOfBirth}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <ListGroup>
                                                <ListGroup.Item>Place of Birth: {applicationDetails?.placeofBirth}</ListGroup.Item>
                                                <ListGroup.Item>Phone Number: {applicationDetails?.phoneNumber}</ListGroup.Item>
                                                <ListGroup.Item>Email Address: {applicationDetails?.emailAddress}</ListGroup.Item>
                                                <ListGroup.Item>Physical Challenges: {applicationDetails?.physicalChallenges}</ListGroup.Item>
                                                <ListGroup.Item>Course Start Date: {applicationDetails?.courseStartDate}</ListGroup.Item>
                                                <ListGroup.Item>Campus: {applicationDetails?.campus}</ListGroup.Item>
                                                <ListGroup.Item>Sponsor: {applicationDetails?.sponsor}</ListGroup.Item>
                                                <ListGroup.Item>Country Of Residence: {applicationDetails?.countryOfResidence}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </Row><br/>
                                    <Row>
                                        <div className="col-md-6">
                                            <h6>Next of Kin Details</h6>
                                            <ListGroup>
                                                <ListGroup.Item>Name: {applicationDetails?.name}</ListGroup.Item>
                                                <ListGroup.Item>Phone Number: {applicationDetails?.nextOfKinPhoneNumber}</ListGroup.Item>
                                                <ListGroup.Item>Relation: {applicationDetails?.relation}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <ListGroup>
                                                <ListGroup.Item>Document Url: {applicationDetails?.documentUrl}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </Row>
                                    <Button className="btn btn-danger btn-rounded float-right" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Body>
                            </Modal>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ApplicationForm
