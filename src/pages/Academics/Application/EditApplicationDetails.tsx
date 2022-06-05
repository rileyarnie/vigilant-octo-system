/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Row} from 'react-bootstrap';
import axios from 'axios';
import Config from '../../../config';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import {FileInput, SelectGroup, TextInput, ValidationForm} from 'react-bootstrap4-form-validation';
import {Alerts, ToastifyAlerts} from '../../lib/Alert';
import {simsAxiosInstance} from '../../../utlis/interceptors/sims-interceptor';
import {TimetableService} from '../../../services/TimetableService';
import {timetablingAxiosInstance} from '../../../utlis/interceptors/timetabling-interceptor';
import ConfirmationModalWrapper from '../../../App/components/modal/ConfirmationModalWrapper';
import ModalWrapper from '../../../App/components/modal/ModalWrapper';

const alerts: Alerts = new ToastifyAlerts();
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        button: {
            marginRight: theme.spacing(1)
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1)
        }
    })
);

export function EditApplicationDetails(props) {
    interface camp {
        id: number;
        name: string;
    }

    const timetablingSrv = Config.baseUrl.timetablingSrv;
    const [firstName, setFirstName] = useState(props.application?.applications_firstName || '');
    const [lastName, setLastName] = useState(props.application?.applications_lastName || '');
    const [otherName, setOtherName] = useState(props.application?.applications_otherName || '');
    const [nationality, setNationality] = useState(props.application?.applications_nationality || '');
    const [identification, setIdentification] = useState(props.application?.applications_identification || '');
    const [identificationType, setIdentificationType] = useState(props.application?.applications_identificationType || '');
    const [emailAddress, setEmailAddress] = useState(props.application?.applications_emailAddress || '');
    const [gender, setGender] = useState(props.application?.applications_gender || '');
    const [maritalStatus, setMaritalStatus] = useState(props.application?.applications_maritalStatus || '');
    const [religion, setReligion] = useState(props.application?.applications_religion || '');
    const [dateOfBirth, setDateOfBirth] = useState(props.application?.applications_dateOfBirth?.slice(0, 10) || '');
    const [phoneNumber, setPhoneNumber] = useState(props.application?.applications_phoneNumber || '');
    const [fileUploaded, setFileUploaded] = useState(props.application?.applications_otherName);
    const [nextOfKinName, setNextOfKinName] = useState(props.application?.nkd_name || '');
    const [nextOfKinPhoneNumber, setNextOfKinPhoneNumber] = useState(props.application?.nkd_nextOfKinPhoneNumber || '');
    const [nextOfKinRelation, setNextOfKinRelation] = useState(props.application?.nkd_relation || '');
    const [physicalChallengesDetails, setPhysicalChallengesDetails] = useState(props.application?.applications_physicalChallengesDetails);
    const [physicalChallenges, setPhysicalChallenges] = useState(props.application?.applications_physicalChallenges);
    const [preferredStartDate, setPreferredStartDate] = useState(props.application?.applications_preferredStartDate?.slice(0, 10) || '');
    const [campus, setCampus] = useState(props.application?.applications_campus);
    const [sponsor, setSponsor] = useState(props.application?.applications_sponsor || '');
    const [countyOfResidence, setCountyOfResidence] = useState(props.application?.applications_countyOfResidence || '');
    const [documentsUrl, setDocumentsUrl] = useState(props.application?.sdocs_documentUrl || '');
    const [campuses, setCampuses] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);

    JSON.parse(localStorage.getItem('programId') as string);
    const classes = useStyles();
    useEffect(() => {
        const token = localStorage.getItem('idToken');
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };
        axios
            .get(`${timetablingSrv}/campuses`, config)
            .then((res) => {
                setCampuses(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }, []);
    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            application: {
                firstName: firstName,
                lastName: lastName,
                otherName: otherName,
                nationality: nationality,
                emailAddress: emailAddress,
                identification: identification,
                gender: gender,
                maritalStatus: maritalStatus,
                religion: religion,
                dateOfBirth: dateOfBirth,
                identificationType: identificationType,
                phoneNumber: phoneNumber,
                physicalChallenges: physicalChallenges,
                physicalChallengesDetails:physicalChallengesDetails,
                preferredStartDate: preferredStartDate,
                campus: campus,
                sponsor: sponsor,
                countyOfResidence: countyOfResidence,
                programCohortId: props.application?.applications_programCohortId
            },
            nextOfKin: {
                name: nextOfKinName,
                nextOfKinPhoneNumber: nextOfKinPhoneNumber,
                relation: nextOfKinRelation
            },
            supportingDocuments: {
                documentUrl: documentsUrl
            }
        };
        updateApplication(updates);
    };
    const updateApplication = (updates) => {
        setDisabledButton(true);
        simsAxiosInstance
            .put(`/program-cohort-applications/${props.application?.id}`, {modifiedProgramCohortApplication: updates})
            .then(() => {
                alerts.showSuccess('Successfully updated application details');
            })
            .catch((error) => {
                alerts.showError(error.message);
            }).finally(() =>{
                setConfirmModal(false);
                props.close();
                props.fetchProgramCohortApplications();
                setDisabledButton(false);
            });
    };

    function handleUpload() {
        const form = new FormData();
        form.append('fileUploaded', fileUploaded);
        const config = {
            headers: {'content-type': 'multipart/form-data'}
        };
        TimetableService.handleFileUpload(form, config);
        timetablingAxiosInstance
            .post('/files', form, config)
            .then((res) => {
                toggleUploadModal();
                alerts.showSuccess('File uploaded successfully');
                setDocumentsUrl(res.data);
            })
            .catch((error) => {
                alerts.showError(error.message);
            });
    }

    function getSteps() {
        return ['Bio data', 'Other details', 'Next of kin', 'Program Preferences'];
    }

    function getStepContent(step: number) {
        switch (step) {
        case 0:
            return (
                <ValidationForm onSubmit={(e) => { e.preventDefault();handleNext();}}>
                    <div className="form-group row">
                        <div className="col-md-2"> </div>
                        <div className="col-md-4">
                            <label htmlFor="firstName">
                                <b>First Name<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <TextInput
                                name="firstName"
                                id="firstName"
                                value={firstName}
                                type="text"
                                placeholder="Enter name"
                                required
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                }}
                            />
                            <br/>
                            <label htmlFor="lastName">
                                <b>Last Name<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <TextInput
                                name="lastName"
                                id="lastName"
                                value={lastName}
                                type="text"
                                placeholder="Enter Last name"
                                required
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                }}
                            />
                            <br/>
                            <label htmlFor="otherName">
                                <b>Other Name</b>
                            </label>
                            <br/>
                            <TextInput
                                name="otherName"
                                id="otherName"
                                type="text"
                                value={otherName}
                                placeholder="Enter other name"
                                onChange={(e) => {
                                    setOtherName(e.target.value);
                                }}
                            />
                            <br/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="phoneNumber">
                                <b>Phone Number<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <TextInput
                                name="phoneNumber"
                                id="phoneNumber"
                                value={phoneNumber}
                                required
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                }}
                                placeholder="Enter Phone Number"
                                type="text"
                            />
                            <br/>
                            <label htmlFor="identificationType">
                                <b>Identification Type<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <SelectGroup
                                defaultValue={identificationType}
                                name="identificationType"
                                id="identificationType"
                                required
                                onChange={(e) => {
                                    setIdentificationType(e.target.value);
                                }}
                                errorMessage="Please select campus"
                            >
                                <option value="">- Please select -</option>
                                <option value="ID No" selected>ID No</option>
                                <option value="Passport No">Passport No</option>
                                <option value="Company No">Company No</option>
                                <option value="Service No">Service No</option>
                                <option value="Military ID">Military ID</option>
                                <option value="Driver License">Driver License</option>
                            </SelectGroup>
                            <br/>
                            <label htmlFor="identification">
                                <b>Identification Number<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <TextInput
                                name="identification"
                                id="identification"
                                value={identification}
                                placeholder=" 346678798"
                                required
                                onChange={(e) => {
                                    setIdentification(e.target.value);
                                }}
                                type="text"
                            />
                            <br/>
                            <label htmlFor="email">
                                <b>Email Address<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <TextInput
                                name="Email"
                                id="email"
                                value={emailAddress}
                                placeholder=""
                                required
                                onChange={(e) => {
                                    setEmailAddress(e.target.value);
                                }}
                                type="email"
                            />
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <div>
                        <Button
                            className="btn btn-danger float-left mb-2"
                            style={{marginLeft: '1rem'}}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                                Back
                        </Button>
                        <button className="btn btn-danger float-right mb-2">Next</button>
                    </div>
                </ValidationForm>
            );
        case 1:
            return (
                <ValidationForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleNext();
                    }}
                >
                    <div className="form-group row">
                        <div className="col-md-2"></div>
                        <div className="col-md-4">
                            <label htmlFor="gender">
                                <b>
                                    Gender<span className="text-danger">*</span>
                                </b>
                            </label>
                            <SelectGroup
                                defaultValue={gender}
                                name="gender"
                                id="gender"
                                onChange={(e) => {
                                    setGender(e.target.value);
                                }}
                                required
                                errorMessage="Please select Gender"
                            >
                                <option value="">--- Please select ---</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </SelectGroup>
                            <br />
                            <label htmlFor="religion">
                                <b>
                                    Religion<span className="text-danger">*</span>
                                </b>
                            </label>
                            <br />
                            <SelectGroup
                                defaultValue={religion}
                                name="religion"
                                id="religion"
                                value={religion}
                                required
                                onChange={(e) => {
                                    setReligion(e.target.value);
                                }}
                                errorMessage="Please select your religion"
                            >
                                <option value="">-- Please select --</option>
                                <option value="Christian">Christian</option>
                                <option value="Islam">Islam</option>
                                <option value="Hindu">Hinduism</option>
                                <option value="Other">Other</option>
                            </SelectGroup>
                            <br />
                            <label htmlFor="maritalStatus">
                                <b>
                                    Marital Status<span className="text-danger">*</span>
                                </b>
                            </label>
                            <br />
                            <SelectGroup
                                defaultValue={maritalStatus}
                                name="maritalStatus"
                                id="maritalStatus"
                                onChange={(e) => {
                                    setMaritalStatus(e.target.value);
                                }}
                                required
                                errorMessage="Please select your status"
                            >
                                <option value="">--- Please select ---</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="separated">Separated</option>
                                <option value="widowed">widowed</option>
                            </SelectGroup>
                            <br />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="nationality">
                                <b>
                                    Nationality<span className="text-danger">*</span>
                                </b>
                            </label>
                            <br />
                            <SelectGroup
                                defaultValue={nationality}
                                name="nationality"
                                id="nationality"
                                onChange={(e) => {
                                    setNationality(e.target.value);
                                }}
                                required
                                errorMessage="Please select your status"
                            >
                                <option value="">--- Please select ---</option>
                                <option value="afghan">Afghan</option>
                                <option value="albanian">Albanian</option>
                                <option value="algerian">Algerian</option>
                                <option value="american">American</option>
                                <option value="andorran">Andorran</option>
                                <option value="angolan">Angolan</option>
                                <option value="antiguans">Antiguans</option>
                                <option value="argentinean">Argentinean</option>
                                <option value="armenian">Armenian</option>
                                <option value="australian">Australian</option>
                                <option value="austrian">Austrian</option>
                                <option value="azerbaijani">Azerbaijani</option>
                                <option value="bahamian">Bahamian</option>
                                <option value="bahraini">Bahraini</option>
                                <option value="bangladeshi">Bangladeshi</option>
                                <option value="barbadian">Barbadian</option>
                                <option value="barbudans">Barbudans</option>
                                <option value="batswana">Batswana</option>
                                <option value="belarusian">Belarusian</option>
                                <option value="belgian">Belgian</option>
                                <option value="belizean">Belizean</option>
                                <option value="beninese">Beninese</option>
                                <option value="bhutanese">Bhutanese</option>
                                <option value="bolivian">Bolivian</option>
                                <option value="bosnian">Bosnian</option>
                                <option value="brazilian">Brazilian</option>
                                <option value="british">British</option>
                                <option value="bruneian">Bruneian</option>
                                <option value="bulgarian">Bulgarian</option>
                                <option value="burkinabe">Burkinabe</option>
                                <option value="burmese">Burmese</option>
                                <option value="burundian">Burundian</option>
                                <option value="cambodian">Cambodian</option>
                                <option value="cameroonian">Cameroonian</option>
                                <option value="canadian">Canadian</option>
                                <option value="cape verdean">Cape Verdean</option>
                                <option value="central african">Central African</option>
                                <option value="chadian">Chadian</option>
                                <option value="chilean">Chilean</option>
                                <option value="chinese">Chinese</option>
                                <option value="colombian">Colombian</option>
                                <option value="comoran">Comoran</option>
                                <option value="congolese">Congolese</option>
                                <option value="costa rican">Costa Rican</option>
                                <option value="croatian">Croatian</option>
                                <option value="cuban">Cuban</option>
                                <option value="cypriot">Cypriot</option>
                                <option value="czech">Czech</option>
                                <option value="danish">Danish</option>
                                <option value="djibouti">Djibouti</option>
                                <option value="dominican">Dominican</option>
                                <option value="dutch">Dutch</option>
                                <option value="east timorese">East Timorese</option>
                                <option value="ecuadorean">Ecuadorean</option>
                                <option value="egyptian">Egyptian</option>
                                <option value="emirian">Emirian</option>
                                <option value="equatorial guinean">Equatorial Guinean</option>
                                <option value="eritrean">Eritrean</option>
                                <option value="estonian">Estonian</option>
                                <option value="ethiopian">Ethiopian</option>
                                <option value="fijian">Fijian</option>
                                <option value="filipino">Filipino</option>
                                <option value="finnish">Finnish</option>
                                <option value="french">French</option>
                                <option value="gabonese">Gabonese</option>
                                <option value="gambian">Gambian</option>
                                <option value="georgian">Georgian</option>
                                <option value="german">German</option>
                                <option value="ghanaian">Ghanaian</option>
                                <option value="greek">Greek</option>
                                <option value="grenadian">Grenadian</option>
                                <option value="guatemalan">Guatemalan</option>
                                <option value="guinea-bissauan">Guinea-Bissauan</option>
                                <option value="guinean">Guinean</option>
                                <option value="guyanese">Guyanese</option>
                                <option value="haitian">Haitian</option>
                                <option value="herzegovinian">Herzegovinian</option>
                                <option value="honduran">Honduran</option>
                                <option value="hungarian">Hungarian</option>
                                <option value="icelander">Icelander</option>
                                <option value="indian">Indian</option>
                                <option value="indonesian">Indonesian</option>
                                <option value="iranian">Iranian</option>
                                <option value="iraqi">Iraqi</option>
                                <option value="irish">Irish</option>
                                <option value="israeli">Israeli</option>
                                <option value="italian">Italian</option>
                                <option value="ivorian">Ivorian</option>
                                <option value="jamaican">Jamaican</option>
                                <option value="japanese">Japanese</option>
                                <option value="jordanian">Jordanian</option>
                                <option value="kazakhstani">Kazakhstani</option>
                                <option value="kenyan">Kenyan</option>
                                <option value="kittian and nevisian">Kittian and Nevisian</option>
                                <option value="kuwaiti">Kuwaiti</option>
                                <option value="kyrgyz">Kyrgyz</option>
                                <option value="laotian">Laotian</option>
                                <option value="latvian">Latvian</option>
                                <option value="lebanese">Lebanese</option>
                                <option value="liberian">Liberian</option>
                                <option value="libyan">Libyan</option>
                                <option value="liechtensteiner">Liechtensteiner</option>
                                <option value="lithuanian">Lithuanian</option>
                                <option value="luxembourger">Luxembourger</option>
                                <option value="macedonian">Macedonian</option>
                                <option value="malagasy">Malagasy</option>
                                <option value="malawian">Malawian</option>
                                <option value="malaysian">Malaysian</option>
                                <option value="maldivan">Maldivan</option>
                                <option value="malian">Malian</option>
                                <option value="maltese">Maltese</option>
                                <option value="marshallese">Marshallese</option>
                                <option value="mauritanian">Mauritanian</option>
                                <option value="mauritian">Mauritian</option>
                                <option value="mexican">Mexican</option>
                                <option value="micronesian">Micronesian</option>
                                <option value="moldovan">Moldovan</option>
                                <option value="monacan">Monacan</option>
                                <option value="mongolian">Mongolian</option>
                                <option value="moroccan">Moroccan</option>
                                <option value="mosotho">Mosotho</option>
                                <option value="motswana">Motswana</option>
                                <option value="mozambican">Mozambican</option>
                                <option value="namibian">Namibian</option>
                                <option value="nauruan">Nauruan</option>
                                <option value="nepalese">Nepalese</option>
                                <option value="new zealander">New Zealander</option>
                                <option value="ni-vanuatu">Ni-Vanuatu</option>
                                <option value="nicaraguan">Nicaraguan</option>
                                <option value="nigerien">Nigerien</option>
                                <option value="north korean">North Korean</option>
                                <option value="northern irish">Northern Irish</option>
                                <option value="norwegian">Norwegian</option>
                                <option value="omani">Omani</option>
                                <option value="pakistani">Pakistani</option>
                                <option value="palauan">Palauan</option>
                                <option value="panamanian">Panamanian</option>
                                <option value="papua new guinean">Papua New Guinean</option>
                                <option value="paraguayan">Paraguayan</option>
                                <option value="peruvian">Peruvian</option>
                                <option value="polish">Polish</option>
                                <option value="portuguese">Portuguese</option>
                                <option value="qatari">Qatari</option>
                                <option value="romanian">Romanian</option>
                                <option value="russian">Russian</option>
                                <option value="rwandan">Rwandan</option>
                                <option value="saint lucian">Saint Lucian</option>
                                <option value="salvadoran">Salvadoran</option>
                                <option value="samoan">Samoan</option>
                                <option value="san marinese">San Marinese</option>
                                <option value="sao tomean">Sao Tomean</option>
                                <option value="saudi">Saudi</option>
                                <option value="scottish">Scottish</option>
                                <option value="senegalese">Senegalese</option>
                                <option value="serbian">Serbian</option>
                                <option value="seychellois">Seychellois</option>
                                <option value="sierra leonean">Sierra Leonean</option>
                                <option value="singaporean">Singaporean</option>
                                <option value="slovakian">Slovakian</option>
                                <option value="slovenian">Slovenian</option>
                                <option value="solomon islander">Solomon Islander</option>
                                <option value="somali">Somali</option>
                                <option value="south african">South African</option>
                                <option value="south korean">South Korean</option>
                                <option value="spanish">Spanish</option>
                                <option value="sri lankan">Sri Lankan</option>
                                <option value="sudanese">Sudanese</option>
                                <option value="surinamer">Surinamer</option>
                                <option value="swazi">Swazi</option>
                                <option value="swedish">Swedish</option>
                                <option value="swiss">Swiss</option>
                                <option value="syrian">Syrian</option>
                                <option value="taiwanese">Taiwanese</option>
                                <option value="tajik">Tajik</option>
                                <option value="tanzanian">Tanzanian</option>
                                <option value="thai">Thai</option>
                                <option value="togolese">Togolese</option>
                                <option value="tongan">Tongan</option>
                                <option value="trinidadian or tobagonian">Trinidadian or Tobagonian</option>
                                <option value="tunisian">Tunisian</option>
                                <option value="turkish">Turkish</option>
                                <option value="tuvaluan">Tuvaluan</option>
                                <option value="ugandan">Ugandan</option>
                                <option value="ukrainian">Ukrainian</option>
                                <option value="uruguayan">Uruguayan</option>
                                <option value="uzbekistani">Uzbekistani</option>
                                <option value="venezuelan">Venezuelan</option>
                                <option value="vietnamese">Vietnamese</option>
                                <option value="welsh">Welsh</option>
                                <option value="yemenite">Yemenite</option>
                                <option value="zambian">Zambian</option>
                                <option value="zimbabwean">Zimbabwean</option>
                            </SelectGroup>
                            <br />
                            {nationality === 'kenyan' ? (
                                <>
                                    <label htmlFor="maritalStatus">
                                        <b>
                                            County of Residence<span className="text-danger">*</span>
                                        </b>
                                    </label>
                                    <br />
                                    <SelectGroup
                                        defaultValue={countyOfResidence}
                                        name="county"
                                        id="county"
                                        onChange={(e) => {
                                            setCountyOfResidence(e.target.value);
                                        }}
                                        required
                                        errorMessage="Please select your status"
                                    >
                                        <option value="">--- Please select ---</option>
                                        <option value="baringo">Baringo</option>
                                        <option value="bomet">Bomet</option>
                                        <option value="bungoma">Bungoma</option>
                                        <option value="busia">Busia</option>
                                        <option value="elgeyo marakwet">Elgeyo Marakwet</option>
                                        <option value="embu">Embu</option>
                                        <option value="garissa">Garissa</option>
                                        <option value="homa bay">Homa Bay</option>
                                        <option value="isiolo">Isiolo</option>
                                        <option value="kajiado">Kajiado</option>
                                        <option value="kakamega">Kakamega</option>
                                        <option value="kericho">Kericho</option>
                                        <option value="kiambu">Kiambu</option>
                                        <option value="kilifi">Kilifi</option>
                                        <option value="kirinyaga">Kirinyaga</option>
                                        <option value="kisii">Kisii</option>
                                        <option value="kisumu">Kisumu</option>
                                        <option value="kitui">Kitui</option>
                                        <option value="kwale">Kwale</option>
                                        <option value="laikipia">Laikipia</option>
                                        <option value="lamu">Lamu</option>
                                        <option value="machakos">Machakos</option>
                                        <option value="makueni">Makueni</option>
                                        <option value="mandera">Mandera</option>
                                        <option value="meru">Meru</option>
                                        <option value="migori">Migori</option>
                                        <option value="marsabit">Marsabit</option>
                                        <option value="mombasa">Mombasa</option>
                                        <option value="muranga">Muranga</option>
                                        <option value="nairobi">Nairobi</option>
                                        <option value="nakuru">Nakuru</option>
                                        <option value="nandi">Nandi</option>
                                        <option value="narok">Narok</option>
                                        <option value="nyamira">Nyamira</option>
                                        <option value="nyandarua">Nyandarua</option>
                                        <option value="nyeri">Nyeri</option>
                                        <option value="samburu">Samburu</option>
                                        <option value="siaya">Siaya</option>
                                        <option value="taita taveta">Taita Taveta</option>
                                        <option value="tana river">Tana River</option>
                                        <option value="tharaka nithi">Tharaka Nithi</option>
                                        <option value="trans nzoia">Trans Nzoia</option>
                                        <option value="turkana">Turkana</option>
                                        <option value="uasin gishu">Uasin Gishu</option>
                                        <option value="vihiga">Vihiga</option>
                                        <option value="wajir">Wajir</option>
                                        <option value="pokot">West Pokot</option>
                                    </SelectGroup>
                                </>
                            ) : (
                                <></>
                            )}
                            <br />
                            <label htmlFor="dateOfBirth">
                                <b>
                                    Date of Birth<span className="text-danger">*</span>
                                </b>
                            </label>
                            <br />
                            <TextInput
                                name="dateOfBirth"
                                id="dateOfBirth"
                                defaultValue={dateOfBirth}
                                required
                                onChange={(e) => {
                                    setDateOfBirth(e.target.value);
                                }}
                                type="date"
                                max={new Date().toISOString().slice(0, 10)}
                            />
                            <br />
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <div>
                        <Button
                            className="btn btn-danger float-left mb-2"
                            style={{ marginLeft: '1rem' }}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <button className="btn btn-danger float-right mb-2">Next</button>
                    </div>
                </ValidationForm>
            );
        case 2:
            return (
                <ValidationForm onSubmit={(e) => { e.preventDefault();handleNext();}}>
                    <div className="form-group row">
                        <div className="col-md-2"></div>
                        <div className="col-md-4">
                            <label htmlFor="name">
                                <b>Name<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <br/>
                            <TextInput
                                name="name"
                                placeholder="Enter name"
                                id="name"
                                required
                                value={nextOfKinName}
                                onChange={(e) => {
                                    setNextOfKinName(e.target.value);
                                }}
                                type="text"
                            />
                            <br/>
                            <label htmlFor="phoneNumber">
                                <b>Phone Number<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <br/>
                            <TextInput
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                id="phoneNumber"
                                required
                                value={nextOfKinPhoneNumber}
                                onChange={(e) => {
                                    setNextOfKinPhoneNumber(e.target.value);
                                }}
                                type="text"
                            />
                            <br/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="relation">
                                <b>Relation<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <br/>
                            <TextInput
                                name="relation"
                                placeholder="Relation"
                                id="relation"
                                required
                                value={nextOfKinRelation}
                                onChange={(e) => {
                                    setNextOfKinRelation(e.target.value);
                                }}
                                type="text"
                            />
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <div>
                        <Button
                            className="btn btn-danger float-left mb-2"
                            style={{marginLeft: '1rem'}}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <button className="btn btn-danger float-right mb-2">Next</button>
                    </div>
                </ValidationForm>
            );
        default:
            return (
                <ValidationForm onSubmit={(e) => { e.preventDefault();toggleConfirmModal();}}>
                    <div className="form-group row">
                        <div className="col-md-2"></div>
                        <div className="col-md-4">
                            <label htmlFor="courseStartDate">
                                <b>Preferred Start Date<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <TextInput
                                name="courseStartDate"
                                required
                                id="courseStartDate"
                                defaultValue={preferredStartDate}
                                onChange={(e) => {
                                    setPreferredStartDate(e.target.value);
                                }}
                                type="date"
                            />
                            <br/>
                            <label htmlFor="campus">
                                <b>Preferred Campus<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <SelectGroup
                                name="campus"
                                id="campus"
                                value={campus}
                                onChange={(e) => {
                                    setCampus(e.target.value);
                                }}
                                required
                                errorMessage="Please select campus"
                            >
                                <option value="">- Please select -</option>
                                {campuses.map((camp: camp) => {
                                    return (
                                        <option key={camp.name} value={camp.id}>
                                            {camp.name}
                                        </option>
                                    );
                                })}
                            </SelectGroup>
                            <br/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="campus">
                                <b>Sponsor<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <SelectGroup
                                name="campus"
                                id="sponsor"
                                required
                                value={sponsor}
                                onChange={(e) => {
                                    setSponsor(e.target.value);
                                }}
                                errorMessage="Please select campus"
                            >
                                <option value="">- Please select -</option>
                                <option value="Self">Self</option>
                                <option value="KPC">KPC</option>
                                <option value="Employer">Employer</option>
                                <option value="Other">Other</option>
                            </SelectGroup>
                            <br/>
                            <label htmlFor="physicalChallenges">
                                <b>Physical Challenges<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <SelectGroup
                                name="physical"
                                id="pcr"
                                required
                                value={physicalChallenges}
                                onChange={(e) => {
                                    setPhysicalChallenges(e.target.value);
                                }}
                                errorMessage="Please select Yes or No"
                            >
                                <option value="">- Please select -</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </SelectGroup>
                            {physicalChallenges === 'Yes' ? (
                                <>                            <label htmlFor="physicalChallenges">
                                    <b>Give more details<span className="text-danger">*</span></b>
                                </label>
                                <br/>
                                <TextInput
                                    name="physicalChallenges"
                                    multiline
                                    value={physicalChallengesDetails}
                                    rows="3"
                                    id="physicalChallenges"
                                    onChange={(e) => {
                                        setPhysicalChallengesDetails(e.target.value);
                                    }}
                                    type="text"
                                />
                                <br/></>) : (
                                <></>
                            )}
                            <label htmlFor="countryOfResidence">
                                <b>Supporting Documents<span className="text-danger">*</span></b>
                            </label>
                            <br/>
                            <br/>
                            <button
                                className="btn btn-danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowUploadModal(true);
                                }}
                            >
                                    Upload documents
                            </button>
                            <br/>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <div>
                        <Button
                            className="btn btn-danger float-left mb-2"
                            style={{marginLeft: '1rem'}}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <button className="btn btn-info float-right mb-2">Submit</button>
                    </div>
                </ValidationForm>
            );
        }
    }

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const steps = getSteps();
    const isStepOptional = (step: number) => {
        return step === 1;
    };
    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const toggleUploadModal = () => {
        showUploadModal ? setShowUploadModal(false) : setShowUploadModal(true);
    };
    const toggleConfirmModal = () => {
        confirmModal ? setConfirmModal(false) : setConfirmModal(true);
    };
    return (
        <>
            <Container fluid>
                <Row>
                    <Card>
                        <Col>
                            <div className={classes.root}>
                                <Stepper activeStep={activeStep}>
                                    {steps.map((label, index) => {
                                        const stepProps: { completed?: boolean } = {};
                                        const labelProps: { optional?: React.ReactNode } = {};
                                        if (isStepOptional(index)) {
                                            labelProps.optional = <></>;
                                        }
                                        if (isStepSkipped(index)) {
                                            stepProps.completed = false;
                                        }
                                        return (
                                            <Step key={label} {...stepProps}>
                                                <StepLabel {...labelProps}>{label}</StepLabel>
                                            </Step>
                                        );
                                    })}
                                </Stepper>
                                <div>
                                    {activeStep === steps.length ? (
                                        <div>
                                            <Typography className={classes.instructions}>
                                                All steps completed - you&apos;ve finished
                                            </Typography>
                                            <Button onClick={handleReset} className={classes.button}>
                                                Reset
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Card>
                </Row>
            </Container>
            <ConfirmationModalWrapper
                disabled={disabledButton}
                submitButton
                submitFunction={handleEdit}
                closeModal={() => setConfirmModal(false)}
                show={confirmModal}
            >
                <h6>Are you sure you want to update {props.application?.applications_firstName} {props.application?.applications_lastName} application details ?</h6>
            </ConfirmationModalWrapper>
            <ModalWrapper show={showUploadModal} closeModal={toggleUploadModal} title='Upload Document' submitButton submitFunction={handleUpload}>
                <ValidationForm>
                    <FileInput
                        name="fileUploaded"
                        id="image"
                        encType="multipart/form-data"
                        fileType={['pdf']}
                        maxFileSize="2mb"
                        onInput={(e) => {
                            setFileUploaded(() => {
                                return e.target.files[0];
                            });
                        }}
                        errorMessage={{
                            required: 'Please upload a document',
                            fileType:'Only pdf document allowed',
                            maxFileSize: 'Max file size is 2MB'
                        }}
                    />
                </ValidationForm>
            </ModalWrapper>
            {}
        </>
    );
}

export default EditApplicationDetails;
