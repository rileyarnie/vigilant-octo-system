/* eslint-disable react/display-name */
import React,{useState,useEffect} from 'react';
import {forwardRef} from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import { Icons } from 'material-table';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Breadcrumb from '../../App/components/Breadcrumb';
import {Row,Col,Modal,Button} from 'react-bootstrap';
import Config from '../../config';
import {MenuItem, Select, Switch} from '@material-ui/core';
import {ValidationForm,SelectGroup,FileInput,TextInput} from 'react-bootstrap4-form-validation';
import ProgressBar from 'react-bootstrap/ProgressBar';
import CardPreview from './CardPreview';
import {Link} from 'react-router-dom';

const tableIcons: Icons = {
    Add: forwardRef((props, ref) => < AddBox  {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const ProgramCohorts = ():JSX.Element => {
    interface programCohort{
        program_cohorts_id:number,
        program_cohorts_startDate:Date,
        program_cohorts_anticipatedGraduationYear:number,
        program_cohorts_anticipatedGraduationMonth:number,
        program_cohorts_isActive:boolean
    }

    const [data,setData]=useState([]);
    const [isError]=useState(false);
    const [,setDisabled]=useState(false);
    const [progressBar,setProgress]=useState(0);
    const [programId,setProgramId]=useState(0);
    const [startDate,setStartDate]=useState('');
    const [banner,setBanner]=useState('');
    const [graduationDate,setGraduationDate]=useState('');
    const [description,setDescription]=useState('');
    const [imageUploaded,setImageUploaded]=useState('');
    const [programs,setPrograms]=useState([]);
    const [programName,setProgramName]=useState('');
    const [selectedProgramId,setSelectedProgramId]=useState(0);
    const [selectedGraduationDate]=useState();
    const [selectedStartDate]=useState();
    const [selectedDescription]=useState();
    const [showModal,setModal]=useState(false);
    const [cohortId,setCohortId]=useState(null);
    const [errorMessages]=useState([]);

    const timetablingSrv=Config.baseUrl.timetablingSrv;
    const year=graduationDate.split('').slice(0,4).join('');
    const month=graduationDate.slice(5,7);
    let activationStatus:boolean;
    const handleActivationStatusToggle=(event,row:programCohort)=>{
        setDisabled(true);
        if(row.program_cohorts_isActive){
            activationStatus=false;
            handleToggleStatusSubmit(event,row);
        }
        if(!row.program_cohorts_isActive){
            activationStatus=true;
            handleToggleStatusSubmit(event,row);
        }
    };
    const handleToggleStatusSubmit=(e,row:programCohort)=>{
        const cohortStatus={
            isActive:activationStatus,
        };
        axios
            .put(`${timetablingSrv}/program-cohorts/${row.program_cohorts_id}`,cohortStatus)
            .then(()=>{
                alert('Success');
                fetchProgramCohorts();
                setDisabled(false);

            })
            .catch((error)=>{
                console.error(error);
                alert(error);
                setDisabled(false);
            });
    };

    const columns=[
        {title:'ID',field:'program_cohorts_id'},
        {title:'Code',field:'program_cohorts_code'},
        {title:'Program Name',field:'pg_name'},
        {title:'Requires Clearance',field:'pg_requiresClearance'},
        {title:'Duration',field:'pg_duration'},
        {title:'Certification Type', field: 'pg_certificationType' },        
        {title:'Start Date', render:(rowData)=>rowData.program_cohorts_startDate.slice(0,10)},

        {
            title:'Anticipated Graduation Date',
            render:(rowData)=>rowData.program_cohorts_anticipatedGraduationMonth+'-'+rowData.program_cohorts_anticipatedGraduationYear
        },
        {
            title:'Activation Status',
            field:'internal_action',
            render:(row:programCohort)=>(
                <Switch
                    onChange={(event)=>handleActivationStatusToggle(event,row)}
                    inputProps={{'aria-label':'controlled'}}
                    defaultChecked={row.program_cohorts_isActive===false}
                />
            )
        },
        {
            title: 'Actions',
            field: 'internal_action',
            render: (row) => (
                
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    autoWidth
                    label="Actions"
                    onChange={(event)=>{
                        if(event.target.value === 'Edit'){
                            setCohortId(row.id);
                            toggleCreateModal();
                        }
                        
                    }}
                >
                    <MenuItem value="Edit">Edit</MenuItem>
                    <Link to='/cohortscourses'
                        onClick={() => {
                            localStorage.setItem('programId', row.pg_id);
                            localStorage.setItem('programName', row.pg_name);
                            localStorage.setItem('program_cohort_code', row.program_cohorts_code);    
                            localStorage.setItem('anticipatedGraduation', `${row.program_cohorts_anticipatedGraduationMonth}/${row.program_cohorts_anticipatedGraduationYear}`);
                        }}>
                        <MenuItem value="View courses">View courses</MenuItem>
                    </Link>
                </Select>
            )
        }
    ];
    useEffect(()=>{
        axios.get(`${timetablingSrv}/program-cohorts`,{params:{programId:setProgramId}})
            .then(res=>{
                setData(res.data);
            })
            .catch((error)=>{
                console.error(error);
                alert(error);
            });
        axios.get(`${timetablingSrv}/programs`)
            .then(res=>{
                setPrograms(res.data);
            })
            .catch((error)=>{
                console.error(error);
                alert(error);
            });
    },[]);
    const fetchProgramCohorts=(): void =>{
        axios.get(`${timetablingSrv}/program-cohorts`,)
            .then(res => {
                res.data.forEach(program => {
                    program.name = getProgramName(res.data[0].programId);
                });
                setData(res.data);
            })
            .catch((error)=>{
                console.error(error);
                alert(error.message);
            });
    };
    const handleUpload=(): void =>{
        const form=new FormData();
        form.append('fileUploaded',imageUploaded);
        const config={
            headers:{'content-type':'multipart/form-data'}
        };
        axios.post(`${timetablingSrv}/files`,form,config)
            .then((res)=>{
                alert('Success');
                setBanner(res.data);
                console.log(res);
                console.log(res.data);
            })
            .catch((error)=>{
                console.error(error);
                alert(error.message);
            });
    };

    const updateProgramCohort=(cohortId,updates): void =>{
        axios.put(`${timetablingSrv}/program-cohorts/${cohortId}/`,updates)
            .then(()=>{
                setProgress(100);
                alert('Successfully updated Cohort');
                fetchProgramCohorts();
                resetStateCloseModal();
            })
            .catch(error=>{
                console.error(error);
                setProgress(0);
                alert(error.message);
            });
    };
    const handleEdit=(e): void =>{
        e.preventDefault();
        const updates={
            programId:programId===0?selectedProgramId:programId,
            startDate:startDate===''?selectedStartDate:startDate,
            anticipatedGraduationYear:year,
            anticipatedGraduationMonth:month,
            advertDescription:description===''?selectedDescription:description,
            bannerImageUrl:{banner}
        };

        updateProgramCohort(cohortId,updates);

    };

    const handleCreate=(e): void =>{
        e.preventDefault();
        const cohort={
            programId:programId,
            startDate:startDate,
            anticipatedGraduationYear:year,
            anticipatedGraduationMonth:month,
            advertDescription:description,
            bannerImageUrl:{banner}
        };
        createCohort(cohort);
    };

    const createCohort=(cohortData): void =>{
        console.log(cohortData);
        axios
            .post(`${timetablingSrv}/program-cohorts`,cohortData)
            .then(()=>{
                setProgress(100);
                alert('Successfully created Program Cohort');
                fetchProgramCohorts();
                resetStateCloseModal();
                setProgress(0);
            })
            .catch((err)=>{
                setProgress(0);
                alert(err.message);
            });
    };
    const resetStateCloseModal=(): void =>{
        setCohortId(null);
        setProgramId(0);
        setStartDate('');
        setDescription('');
        setBanner('');
        setModal(false);
        setProgramName('');
    };

    const toggleCreateModal=()=>{
        showModal?resetStateCloseModal():setModal(true);
    };
    const getProgramName = (id: number): string => {
        return programs.filter(program => {
            return program.id === id;
        }).map(name => name.name)[0];
    };
    return (
        <>
            <Row className='align-items-center page-header'>
                <Col>
                    <Breadcrumb/>
                </Col>
                <Col>
                    <Button className="float-right" variant="danger" onClick={()=>toggleCreateModal()}>
                        Create Program Cohort
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <div>
                            {isError&&
                            <Alert severity='error'>
                                {errorMessages.map((msg,i)=>{
                                    return <div key={i}>{msg}</div>;
                                })}
                            </Alert>
                            }
                        </div>
                        <MaterialTable
                            title='Program Cohorts' 
                            icons={tableIcons}
                            columns={columns}
                            data={data}
                            options={{actionsColumnIndex:-1}}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                backdrop="static"
                show={showModal}
                onHide={toggleCreateModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <ProgressBar animated now={progressBar} variant="info"/>
                <Modal.Header closeButton>
                    <Modal.Title
                        id="contained-modal-title-vcenter">{cohortId?'Edit Program Cohort':'Create a Program Cohort'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={8}>
                            <ValidationForm>
                                <div className="form-group">
                                    <label htmlFor="cohortName"><b>Select Program</b></label>
                                    <SelectGroup name="program" id="program" required
                                        errorMessage="Please select a Program."
                                        onChange={(e)=>{
                                            setSelectedProgramId(e.target.value);
                                            setProgramId(e.target.value);
                                        }}>
                                        <option defaultValue={selectedProgramId} value="">-- Please select --</option>
                                        {programs.map((program)=>{
                                            return <option key={program.name} value={program.id}>{program.name}</option>;
                                        })}
                                    </SelectGroup><br/>
                                    <label htmlFor='Date'><b>Start Date</b></label><br/>
                                    <TextInput name='startDate' id='startDate' type="date" required
                                        defaultValue={selectedStartDate}
                                        onChange={(e)=>{
                                            setStartDate(e.target.value);
                                        }}/><br/>
                                    <label htmlFor='Date'><b>Anticipated Graduation Date</b></label><br/>
                                    <TextInput name='graduationDate' id='graduationDate' type="month" required
                                        defaultValue={selectedGraduationDate}
                                        onChange={(e)=>{
                                            setGraduationDate(e.target.value);
                                        }}/><br/>
                                    <label htmlFor="cohortName"><b>Description</b></label>
                                    <TextInput name='description' minLength="4" id='description'
                                        defaultValue={selectedDescription}
                                        type="text" placeholder={cohortId?setDescription:description}
                                        required multiline rows="3"
                                        onChange={(e)=>{
                                            setDescription(e.target.value);
                                        }}/><br/>
                                    <label htmlFor="cohortName"><b>Banner Image</b></label>
                                    <FileInput name="fileUploaded" id="image" encType="multipart/form-data"
                                        onInput={(e)=>{
                                            setImageUploaded(()=>{
                                                return e.target.files[0];
                                            });
                                            handleUpload();
                                        }} required fileType={['png','jpg','jpeg']} maxFileSize="3mb"
                                        errorMessage={{
                                            required:'Please upload an image',
                                            fileType:'Only image is allowed',
                                            maxFileSize:'Max file size is 3MB'
                                        }}/>
                                </div>
                                <input name='banner' id='banner' type="hidden" required value={banner}/><br/>
                                <div className='form-group'>
                                    <button className="btn btn-info btn-rounded float-right"
                                        onClick={(e)=>cohortId?handleEdit(e):handleCreate(e)}>
                                        Submit
                                    </button>
                                    <button className="btn btn-danger btn-rounded float-left"
                                        onClick={()=>toggleCreateModal()}>
                                        Cancel
                                    </button>
                                </div>
                            </ValidationForm>
                        </Col>
                        <Col sm={4}>
                            <CardPreview
                                programName={programName}
                                description={description}
                                startDate={startDate}
                                graduationDate={graduationDate}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProgramCohorts;