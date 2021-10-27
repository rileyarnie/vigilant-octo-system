import * as React from 'react';
import { Row, Col, Card, } from "react-bootstrap";
import Breadcrumb from "../../App/components/Breadcrumb";
class Default extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <Row className="align-items-center page-header">
          <Col md={6}>
            <Breadcrumb />
          </Col>

          <Col md={6} className="text-right">
            <button type="button" className="btn btn-primary m-r-5">
              <i className="feather icon-plus" /> Filter
            </button>
            <button type="button" className="btn btn-outline-primary">
              <i className="feather icon-rotate-cw" /> Reload
            </button>
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col sm="auto">
                    <i className="icon feather icon-navigation-2 f-30 text-c-green" />
                  </Col>
                  <Col sm="auto">
                    <h6 className="text-muted m-b-10">students</h6>
                    <h2 className="m-b-0">205</h2>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col sm="auto">
                    <i className="icon feather icon-mail f-30 text-c-yellow" />
                  </Col>
                  <Col sm="auto">
                    <h6 className="text-muted m-b-10">Messages</h6>
                    <h2 className="m-b-0">325</h2>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col sm="auto">
                    <i className="icon feather icon-book f-30 text-c-blue" />
                  </Col>
                  <Col sm="auto">
                    <h6 className="text-muted m-b-10">Courses</h6>
                    <h2 className="m-b-0">29</h2>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col sm="auto">
                    <i className="icon feather icon-users f-30 text-c-red" />
                  </Col>
                  <Col sm="auto">
                    <h6 className="text-muted m-b-10">Applicants</h6>
                    <h2 className="m-b-0">84</h2>
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
export default Default;
