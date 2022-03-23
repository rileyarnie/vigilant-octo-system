import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {models} from 'powerbi-client';
import {PowerBIEmbed} from 'powerbi-client-react';
function Dashboard4() {
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <PowerBIEmbed
                            embedConfig = {{
                                type: 'report',   // Supported types: report, dashboard, tile, visual and qna
                                id: 'd8263be7-bc89-4f86-b853-303d31a6032c',
                                embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=4d7720b4-6414-45e9-8f2c-b837243a56ae&groupId=0f6081ae-cec9-4a40-897a-5a1d72634660&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUFGUklDQS1OT1JUSC1BLVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlLCJhbmd1bGFyT25seVJlcG9ydEVtYmVkIjp0cnVlLCJjZXJ0aWZpZWRUZWxlbWV0cnlFbWJlZCI6dHJ1ZSwidXNhZ2VNZXRyaWNzVk5leHQiOnRydWUsInNraXBab25lUGF0Y2giOnRydWV9fQ%3d%3d',
                                accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTFhMGIyNTItYjAwNS00ZGQxLWEwMDQtNTIwNWIxM2YwNjZmLyIsImlhdCI6MTY0ODAxMTA3MywibmJmIjoxNjQ4MDExMDczLCJleHAiOjE2NDgwMTYyMjAsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VEFBQUFHbnYzMlo4VnR4djhvQmVyNks0Y2JYT0dNNVd3blVIb001YlJuQ1Y0N0RFaERpTXcrY0p2SVBrWEhLNGNwN05PKzhQSGxNR1RJSEY2N3lqdHl4cnduLzRodzB3Z0V0blJCRnQ3ZWVtMVlVQT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiN2Y1OWE3NzMtMmVhZi00MjljLWEwNTktNTBmYzViYjI4YjQ0IiwiYXBwaWRhY3IiOiIyIiwiZmFtaWx5X25hbWUiOiJLaXJhZ3UiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJpcGFkZHIiOiIxMDIuNjguNzcuOTQiLCJuYW1lIjoiRGF2aWQgIEtpcmFndSIsIm9pZCI6IjIwYmI2ODgwLWM0Y2UtNDBkYy04MWIxLTY1MGNjM2YyMjc2ZSIsInB1aWQiOiIxMDAzMjAwMTc3OEI0RUIxIiwicmgiOiIwLkFRd0FVcktnRVFXdzBVMmdCRklGc1Q4R2J3a0FBQUFBQUFBQXdBQUFBQUFBQUFBTUFJay4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ1NmdXSXBERDVQeTF6N09TUXJjVXFkeWlvMHJwTWVybFRSZEM2Q2dfV2xRIiwidGlkIjoiMTFhMGIyNTItYjAwNS00ZGQxLWEwMDQtNTIwNWIxM2YwNjZmIiwidW5pcXVlX25hbWUiOiJkYXZpZGtpcmFndUBwb3NoaXQub25taWNyb3NvZnQuY29tIiwidXBuIjoiZGF2aWRraXJhZ3VAcG9zaGl0Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjFHWUZwM0hWMEVxTUd5M1loa1V4QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjY5MDkxMjQ2LTIwZTgtNGE1Ni1hYTRkLTA2NjA3NWIyYTdhOCIsIjI5MjMyY2RmLTkzMjMtNDJmZC1hZGUyLTFkMDk3YWYzZTRkZSIsImYwMjNmZDgxLWE2MzctNGI1Ni05NWZkLTc5MWFjMDIyNjAzMyIsImYyZWY5OTJjLTNhZmItNDZiOS1iN2NmLWExMjZlZTc0YzQ1MSIsImYyOGExZjUwLWY2ZTctNDU3MS04MThiLTZhMTJmMmFmNmI2YyIsImZlOTMwYmU3LTVlNjItNDdkYi05MWFmLTk4YzNhNDlhMzhiMSIsIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsIjcyOTgyN2UzLTljMTQtNDlmNy1iYjFiLTk2MDhmMTU2YmJiOCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.pMYtiAX2QiH2_cMddXHPWce2RauRqf0UViprxaEqarusP7iAh5NKpO8yzC9_CS43Rrq5fxrgEBiduQ-3WxbjFKY3yYziGcbKxYU3XyMWXUKtW0FuZebwdPOum4BPf8bj1MhGFbMlN6dPtc5hxMSC5Q59PU-IYlwj0D74n5Grx1vZYPiPTRFLx4eONHxEg2PNdZ2GxqG6UASMrD9sJHEtJFvMbduB2dwVZFfJd1HLsVKdu-hpTnWP9RS6VD_bNeuiLAkY22ao6moJFCZ93-VC7LlNaoxheFvuG55pT5-6ppIY-PV5QY1BK3Rg9wAI1-LWNwzXixWdlBk7P_wiOfDbqg',
                                tokenType: models.TokenType.Aad,
                                settings: {
                                    panes: {
                                        filters: {
                                            expanded: true,
                                            visible: true
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
                                'Embed-container'
                            }
                            getEmbeddedComponent = {
                                (embeddedReport) => {
                                    window['report'] = embeddedReport;
                                }
                            }
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default Dashboard4;