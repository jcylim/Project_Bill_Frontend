import React from 'react';
import { Link } from "react-router-dom";
import { Typography, CircularProgress, Button } from '@material-ui/core';

import useStyles from './styles';

const Confirmation = ({ payStatus, postId, posterName, isFinished }) => {
    const classes = useStyles();

    if (payStatus) {
        if (isFinished) {
            return (
                <>
                    <div>
                        <Typography variant='h5'>Thank you for your purchase, {posterName} will reach out soon! :)</Typography>
                    </div>
                    <br />
                    <Button component={Link} to={`/post/${postId}`} variant='outlined' type='button'>Back to post</Button>
                </>
            )
        } else {
            return (
                <div className={classes.spinner}>
                    <CircularProgress />
                </div>
            )
        }   
    }
};

export default Confirmation;