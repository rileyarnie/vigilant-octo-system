import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import '../../assets/scss/dashboard.css';
function Dashboard1() {
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <iframe title="Director-deputy director" width="1140" height="541.25"
                            src="https://app.powerbi.com/reportEmbed?reportId=f60e641f-4444-4144-a507-1767ec771eda&autoAuth=true&ctid=11a0b252-b005-4dd1-a004-5205b13f066f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWFmcmljYS1ub3J0aC1hLXByaW1hcnktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D"
                            frameBorder="0" allowFullScreen={true}></iframe>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default Dashboard1;