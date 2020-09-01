import React from 'react';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';

const Home = () => {
    let dashboard = '';

    if (isAuthenticated()) {
        if (isAuthenticated().user) {
            dashboard = `/${isAuthenticated().user.company}/dashboard`;
        } else {
            dashboard = `/${isAuthenticated().company._id}/dashboard`;
        }
    }

    return (
        <div>
            {!(isAuthenticated()) ? (
                <div className='jumbotron'>
                    <h2>Home</h2>
                    <p className='lead'>Welcome to Workflow Platform Home Page</p>
                </div>
            ) : (   
                <Redirect to={dashboard} />
            )}
        </div>
    );
};

export default Home;