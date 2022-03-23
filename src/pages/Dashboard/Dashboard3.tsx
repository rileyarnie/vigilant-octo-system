import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
function Dashboard3() {
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <iframe title="Finance Officer" width="1140" height="541.25"
                            src="https://app.powerbi.com/reportEmbed?reportId=f89423ac-bc23-459d-b096-8fa07f441be5&autoAuth=true&ctid=11a0b252-b005-4dd1-a004-5205b13f066f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWFmcmljYS1ub3J0aC1hLXByaW1hcnktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D"
                            frameBorder="0" allowFullScreen={true}></iframe>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default Dashboard3;