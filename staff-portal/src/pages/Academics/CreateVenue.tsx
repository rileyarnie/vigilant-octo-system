import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from "react-bootstrap";
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import Breadcrumb from '../../App/components/Breadcrumb';
import Config from '../../config';

interface Props extends React.HTMLAttributes<Element> {
	setModal:any,
	setProgress:any
  }
class CreateVenue extends Component <Props,{}> {
	constructor(props:any){
        super(props);
    };
	state = {
		name: '',
		description: '',
		capacity: '',
		campusId: '',
		campuses:[]
	};
private timetableSrv = Config.baseUrl.timetablingSrv
	componentDidMount() {
		axios.get(`${this.timetableSrv}/campuses`)
			.then(res => {
				const campuses = res.data;
				this.setState({ campuses: campuses });
			})
			.catch((error) => {
				//handle error using logging library
				console.error(error)
				alert(error.message);
			});
	};

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	handleSubmit = (e, formData,) => {
		e.preventDefault();
		const venue = {
			name: this.state.name,
			description: this.state.description,
			capacity: this.state.capacity,
			campusId: this.state.campusId,
		}
		const params = new URLSearchParams();
		params.append("Venue",JSON.stringify(venue))
		axios.post(`${this.timetableSrv}/venues`,params)
			.then(res => {
				//handle success
				console.log(res);
				this.props.setProgress(100)
				alert('Venue Created Successfully');
				this.props.setModal(false) 
			})
			.catch((error) => {
				//handle error using logging library
				console.error(error)
				alert(error.message);
			});
	};

	handleErrorSubmit = (e, _formData, errorInputs) => {
		console.error(errorInputs);
	};


	render() {
		return (
			<>
				<Row className="align-items-center page-header">

				</Row>
				<Row>
					<Col>
						<Card>
							<Card.Body>
								<Row>
									<Col md={12}>
										<ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}>
											<div className='form-group'>
												<label htmlFor='name'><b>Name of Venue</b></label>
												<TextInput name='name' id='name' type='text' placeholder="Enter name" required onChange={this.handleChange} /><br />
												<label htmlFor='description'><b>Description</b></label><br />
												<TextInput name='description' id='description' type='textarea' required placeholder="Enter description" onChange={this.handleChange} /><br /><br />
												<label htmlFor='description'><b>Capacity</b></label>
												<TextInput name='capacity' id='capacity' type='text' required placeholder="Enter capacity" onChange={this.handleChange} /><br />
												<label htmlFor='campusIdd'><b>Campus</b></label><br></br>
												<SelectGroup name="c" id="color" required onChange={this.handleChange}>
													{
														this.state.campuses.map(campus => {
															return(
																<option value={campus.id} >{campus.name}</option>
															)
														})
													}
												</SelectGroup> <br></br>
												&nbsp;&nbsp;&nbsp;
											</div>
											
											<div className='form-group'>
												<button className='btn btn-danger float-right'>Submit</button>
											</div>
										</ValidationForm>
										<button className="btn btn-info float-left" onClick={()=>this.props.setModal(false)}>Cancel</button> 
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</>
		);
	}
}

export default CreateVenue;