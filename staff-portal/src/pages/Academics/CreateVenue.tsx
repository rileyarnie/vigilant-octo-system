import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card,} from "react-bootstrap";
import { ValidationForm, SelectGroup, TextInput } from 'react-bootstrap4-form-validation';
import Breadcrumb from '../../App/components/Breadcrumb';

class CreateVenue extends Component {
	state = {
		name: '',
		description: '',
		capacity: '',
		campusId: '',
		campuses:[]
	};

	componentDidMount() {
		axios.get(`/campuses`)
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
		console.log(venue)
		axios.put('/venues')
			.then(res => {
				//handle success
				console.log(res);
				alert('Venue Created Successfully');
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
					<Col>
						<Breadcrumb />
					</Col>
				</Row>
				<Row>
					<Col>
						<Card>
							<Card.Body>
								<Row>
									<Col md={6}>
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
											</div>
											<div className='form-group'>
												<button className='btn btn-danger'>Submit</button>
											</div>
										</ValidationForm>
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