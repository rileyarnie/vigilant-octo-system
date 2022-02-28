import React from 'react';
class AppointmentTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // eslint-disable-next-line react/prop-types
            errorData: props.data,
        };
    }

    render() {
        const { errorData } = this.state;
        return (
            <div className="movie-tooltip">
                <div className="textCenter">
                    <div>
                        { errorData.appointmentData.errors?.map((error) =>{
                            if(error==='NO_SET_TRAINER'){
                                return    <p>This Course Cohort  has no Trainer</p>;

                            }else{
                                return <p>This Course Cohort  has no set Venue</p>;
                            }
                        }
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default AppointmentTooltip;