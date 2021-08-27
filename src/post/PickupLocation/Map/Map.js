import React from 'react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import GoogleMapReact from 'google-map-react';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

import DefaultPost from '../../../img/postPic.jpg';

import useStyles from './styles';

const Map = ({ setCoordinates, coordinates, posts, setChildClicked }) => {
    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)');

    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={(e) => {
                    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
                }}
                onChildClick={child => setChildClicked(child)}
            >
                {posts?.map((post, i) => (
                    <div
                        className={classes.markerContainer}
                        lat={post.address.coordinates.lat}
                        lng={post.address.coordinates.lng}
                        key={i}
                    >
                        {
                            !isDesktop ? (
                                <LocationOnOutlinedIcon color='primary' fontSize='large' />
                            ) : (
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography className={classes.typography} variant='subtitle2' gutterBottom>
                                        {post.title}
                                    </Typography>
                                    <img
                                        className={classes.pointer}
                                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                                        onError={i => (i.target.src = `${DefaultPost}`)}
                                        alt={post.title}
                                    />
                                </Paper>
                            )
                        }
                    </div>
                ))}
            </GoogleMapReact>
        </div>
    );
}

export default Map;