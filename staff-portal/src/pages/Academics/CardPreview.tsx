import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});
interface IProps {
    programName:string,
    description:string,
    startDate:string,
    graduationDate:string,
    bannerImage: string
}
const CardPreview = (props:IProps):JSX.Element => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="banner image"
                    height="140"
                    image={props.bannerImage}
                    title="bannerurl"/>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h6">
                        <p>{props.programName}</p>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <b>Start Date</b> : {props.startDate}<br/>
                        <b>Graduation Date</b> : {props.graduationDate}<br/>
                        {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button style={{textTransform: 'none'}} size="small" color="primary">Apply Now</Button>
                <Button size="small" style={{textTransform: 'none'}} color="primary">more details</Button>
            </CardActions>
        </Card>
    );
};
export default CardPreview;