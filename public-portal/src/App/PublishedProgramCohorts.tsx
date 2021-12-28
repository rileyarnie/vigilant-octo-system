/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { Alerts, ToastifyAlerts } from '../lib/Alert'
import Config from '../config'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
})
interface programCohort {
    program_cohorts_id:string,
    program_cohorts_bannerImageUrl:string,
    pg_name: string,
    program_cohorts_startDate: string,
    program_cohorts_anticipatedGraduationYear: string,
    program_cohorts_anticipatedGraduationMonth: string,
    program_cohorts_advertDescription: string,
    bannerImageUrl: string
}
const timetablingSrv = Config.baseUrl.timetablingSrv
const PublishedCourses = () => {
  const classes = useStyles()
  const alerts: Alerts = new ToastifyAlerts()
  const [data, setData] = useState([])

  useEffect(() => {
    fetchProgramCohorts()
  }, [])
  const fetchProgramCohorts = () => {
    axios.get(`${timetablingSrv}/program-cohorts`)
      .then(res => {
        const myData = res.data
        setData(myData)
      })
      .catch((error) => {
        console.error(error)
        alerts.showError(error.message)
      })
  }
  return (
        <div className="card list">
            <Grid container spacing={1} direction="row" justifyContent="flex-start" alignItems="flex-start">
                {data.map((cohort:programCohort) => (
                    <Grid item xs={12} sm={6} md={3} key={cohort.program_cohorts_id}>
                    <Card key={cohort.program_cohorts_id} className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                alt="banner image"
                                height="140"
                                key="bannerImgUrl"
                                image={cohort.program_cohorts_bannerImageUrl}
                                title="bannerImgUrl"/>
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="h6">
                                    <p>{cohort.pg_name}</p>
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    <b>Start Date</b> : {cohort.program_cohorts_startDate.slice(0, 10)}<br/>
                                    <b>Graduation Date</b> : {cohort.program_cohorts_anticipatedGraduationYear}-{cohort.program_cohorts_anticipatedGraduationMonth}<br/>
                                    {cohort.program_cohorts_advertDescription}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Link target={'_blank'} to={'/apply'} onClick={() => localStorage.setItem('programId', cohort.program_cohorts_id)}>
                                <Button style={{ textTransform: 'none' }} size="small" color="primary">Apply Now</Button>
                            </Link>
                            <Button size="small" style={{ textTransform: 'none' }} color="primary">more details</Button>
                        </CardActions>
                    </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
  )
}

export default PublishedCourses
