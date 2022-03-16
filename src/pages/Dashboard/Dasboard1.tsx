import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report, Embed, service, Page } from 'powerbi-client';
function Dashboard1() {
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <PowerBIEmbed
                            embedConfig = {{
                                type: 'report',   // Supported types: report, dashboard, tile, visual and qna
                                id: '<Report Id>',
                                embedUrl: '<Embed Url>',
                                accessToken: '<Access Token>',
                                tokenType: models.TokenType.Embed,
                                settings: {
                                    panes: {
                                        filters: {
                                            expanded: false,
                                            visible: false
                                        }
                                    },
                                    background: models.BackgroundType.Transparent,
                                }
                            }}

                            eventHandlers = {
                                new Map([
                                    ['loaded', function () {console.log('Report loaded');}],
                                    ['rendered', function () {console.log('Report rendered');}],
                                    ['error', function (event) {console.log(event.detail);}]
                                ])
                            }

                            cssClassName = {
                                'report-style-class'
                            }
                            // getEmbeddedComponent = {
                            //     (embeddedReport) => {
                            //         windw.report = embeddedReport;
                            //     }
                            // }
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default Dashboard1;