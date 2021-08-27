import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip, CardActionArea, Select } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import Skeleton from '@material-ui/lab/Skeleton';

import DefaultPost from '../../../img/postPic.jpg';

import useStyles from './styles';

const PostDetails = ({ post, selected, refProp }) => {
    const classes = useStyles();

    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
    const posterName = post.postedBy ? `${post.postedBy.first_name} ${post.postedBy.last_name}` : 'Unknown';
    const price = parseFloat(post.price).toFixed(2);

    if (selected) {
        if (refProp.current) {
            refProp.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <Card elevation={6}>
            <CardMedia
                style={{ height: 350 }}
                image={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                component="img"
                onError={i => (i.target.src = `${DefaultPost}`)}
                title={post.title}
            />
            <CardContent>
                <Typography gutterBottom variant='h5'>{post.title}</Typography>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2'>Price</Typography>
                    <Typography gutterBottom variant='subtitle1' style={{color: 'green'}}>${price}</Typography>
                </Box>
                <Typography className='font-italic mark' variant='subtitle2'>
                    Posted by{' '} 
                    <Link to={`${posterId}`}>
                        {posterName}
                    </Link>
                    {' '}on {new Date(post.created).toDateString()}
                </Typography>
                {post.address ? (
                    <Typography gutterBottom variant='subtitle2' color='textSecondary' className={classes.subtitle}>
                        <LocationOnIcon color='secondary'/> {post.address.text}
                    </Typography>
                ) : (
                    <Typography gutterBottom variant='subtitle2' color='textSecondary' className={classes.subtitle}>
                        No pickup location
                    </Typography>
                )}
                <CardActions>
                    <Link 
                        to={`/post/${post._id}`}
                        className="btn btn-raised btn-primary btn-sm col align-self-center"
                    >
                        Read More
                    </Link>   
                </CardActions>
            </CardContent>
        </Card>
    );
}

export default PostDetails;