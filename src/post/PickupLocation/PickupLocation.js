import React, { useState, useEffect } from 'react';
import { list } from '../apiPost';
import { Grid, Typography } from '@material-ui/core';

import Header from './Header/Header';
import List from './List/List';
import Map from './Map/Map';

const PickupLocation = () => {
    const [posts, setPosts] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        })
    }, []);

    useEffect(() => {
        setIsLoading(true);

        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data);
                let activePosts = data.filter(post => post.status === 'ACTIVE');
                let postsWithPickupLocation = activePosts.filter(post => post.address);
                setPosts(postsWithPickupLocation);
                setIsLoading(false);
            }
        })
    }, []);

    return (
        <>
            {/* <Header setCoordinates={setCoordinates} /> */}
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    {posts.length != 0 ? (
                        <List 
                            posts={posts}
                            childClicked={childClicked}
                            isLoading={isLoading}
                        />
                    ) : (
                        <Typography variant='h4' style={{padding: '25px'}}>No Produce/Goods to Be Picked Up</Typography>
                    )}
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates}
                        coordinates={coordinates}
                        posts={posts}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default PickupLocation;