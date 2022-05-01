import * as React from 'react';
import {Row, Col, Card} from 'react-bootstrap';
import Breadcrumb from '../../App/components/Breadcrumb';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';
import Dashboard1 from './Dasboard1';
import Dashboard2 from './DashBoard2';
import Dashboard3 from './Dashboard3';
import Dashboard5 from './Dashboard5';
import Dashboard4 from './Dashboard4';

function Default(): JSX.Element {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            margin: {
                margin: theme.spacing(1),
            },
            extendedIcon: {
                marginRight: theme.spacing(1),
            },
            root: {
                flexGrow: 1,
                width: '100%',
                backgroundColor: theme.palette.background.paper
            }
        }),
    );
    const classes = useStyles();

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: unknown;
    }
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    function TabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index: unknown) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`
        };
    }

    return (
        <>
            <Row className="align-items-center page-header">
                <Col md={6}>
                    <Breadcrumb/>
                </Col>

                <Col md={6} className="text-right">
                    <button type="button" className="btn btn-primary m-r-5">
                        <i className="feather icon-plus"/> Filter
                    </button>
                    <button type="button" className="btn btn-outline-primary">
                        <i className="feather icon-rotate-cw"/> Reload
                    </button>
                </Col>
            </Row>

            <Row>
                <div className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Director" {...a11yProps(0)} />
                            <Tab label="Registrar" {...a11yProps(1)} />
                            <Tab label="Finance Officer" {...a11yProps(2)} />
                            <Tab label="HOD" {...a11yProps(3)} />
                            <Tab label="Marketer" {...a11yProps(4)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Col>
                            <Card>
                                <Dashboard1/>
                            </Card>
                        </Col>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Col>
                            <Card>
                                <Dashboard2/>
                            </Card>
                        </Col>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Col>
                            <Card>
                                <Dashboard3/>
                            </Card>
                        </Col>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Col>
                            <Card>
                                <Dashboard4/>
                            </Card>
                        </Col>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Col>
                            <Card>
                                <Dashboard5/>
                            </Card>
                        </Col>
                    </TabPanel>
                </div>
            </Row>
        </>
    );
}

export default Default;