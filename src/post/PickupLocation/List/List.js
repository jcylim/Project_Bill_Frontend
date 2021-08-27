import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

import PostDetails from '../PostDetails/PostDetails';

import useStyles from './styles';

const List = ({ posts, childClicked, isLoading }) => {
    const classes = useStyles();
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        const refs = Array(posts.length).fill().map((_, i) => elRefs[i] || React.createRef());

        setElRefs(refs);
    }, [posts]);

    return (
        <div className={classes.container}>
            <Typography variant='h4'>Produce/Goods Ready to Be Picked Up</Typography>
            <br />
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size='5rem' />
                </div>
            ) : (
                <Grid container spacing={3} className={classes.list}>
                    {posts?.map((post, i) => (
                        <Grid item ref={elRefs[i]} key={i} xs={12}>
                            <PostDetails 
                                post={post}
                                selected={Number(childClicked) === i}
                                refProp={elRefs[i]}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}

export default List;